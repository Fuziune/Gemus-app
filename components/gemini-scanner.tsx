"use client"

import { useState, useRef, ChangeEvent } from "react"
import { Card } from "@/components/ui/card"
import { Camera, Upload, Check, AlertCircle, X, ImageIcon, Sparkles, ScanFace } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Spinner } from "@/components/ui/spinner"
import { analyzeImageAction } from "@/app/actions/analyze"
import type { FaceAnalysisResult } from "@/lib/ai-analysis"
import posthog from 'posthog-js'
import Image from "next/image"

export function GeminiScanner() {
    const [mode, setMode] = useState<'idle' | 'camera' | 'upload' | 'analyzing' | 'complete'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [result, setResult] = useState<FaceAnalysisResult | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })

    const startCamera = async () => {
        try {
            setMode('camera');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: 1280, height: 720 }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            setErrorMessage("Camera access denied.");
            setMode('idle');
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setImageSrc(dataUrl); // Preview

        // Stop camera
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(t => t.stop());

        handleAnalysis(dataUrl);
    };

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const src = ev.target?.result as string;
            setImageSrc(src);
            handleAnalysis(src);
        };
        reader.readAsDataURL(file);
    };

    const handleAnalysis = async (base64Image: string) => {
        setMode('analyzing');
        setErrorMessage(null);

        // Convert base64 to File object for the server action
        const res = await fetch(base64Image);
        const blob = await res.blob();
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        const formData = new FormData();
        formData.append("image", file);

        const response = await analyzeImageAction(formData);

        if (response.success && response.data) {
            setResult(response.data);
            setMode('complete');
        } else {
            setErrorMessage("Analysis failed. Please try again.");
            setMode('idle');
        }
    };

    const reset = () => {
        setMode('idle');
        setImageSrc(null);
        setResult(null);
    };

    return (
        <section ref={containerRef} className="relative py-32 overflow-hidden" id="ai-scanner">
            {/* Dark Tech Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/scanner-bg.png"
                    alt="AI Technology Background"
                    fill
                    className="object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-black/80 to-background" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full backdrop-blur-md">
                        <Sparkles className="w-3 h-3 text-accent" />
                        <span className="text-[10px] tracking-[0.3em] uppercase text-accent font-semibold">Gemus AI Engine</span>
                    </div>
                    <h2 className="font-serif text-5xl md:text-6xl text-white drop-shadow-xl">
                        Smart Feature Recognition
                    </h2>
                    <p className="text-white/60 max-w-xl mx-auto text-lg font-light leading-relaxed">
                        Upload a photo to instantly analyze face shape, skin tone, and receive personalized jewelry recommendations.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <Card className="grid md:grid-cols-2 gap-0 overflow-hidden border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl min-h-[600px] ring-1 ring-white/10">
                        {/* Left: Input Area / Viewfinder */}
                        <div className="relative flex flex-col items-center justify-center p-8 min-h-[400px] border-b md:border-b-0 md:border-r border-white/10 bg-black/20">

                            {/* Decorative Viewfinder Corners */}
                            <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-accent/50 rounded-tl-lg" />
                            <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-accent/50 rounded-tr-lg" />
                            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-accent/50 rounded-bl-lg" />
                            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-accent/50 rounded-br-lg" />

                            <AnimatePresence mode="wait">
                                {mode === 'idle' && (
                                    <motion.div
                                        key="idle"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-center space-y-8 relative z-10"
                                    >
                                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]">
                                            <ScanFace className="w-10 h-10 text-white/80" strokeWidth={1} />
                                        </div>
                                        <div className="flex flex-col gap-4 w-72">
                                            <Button onClick={startCamera} className="uppercase tracking-widest text-xs h-14 bg-white text-black hover:bg-white/90 rounded-full font-bold">
                                                <Camera className="mr-2 w-4 h-4" /> Open Camera
                                            </Button>
                                            <Button onClick={() => { fileInputRef.current?.click(); posthog.capture('gemini_scanner_upload_photo') }} variant="outline" className="uppercase tracking-widest text-xs h-14 border-white/20 text-white hover:bg-white/10 rounded-full font-bold backdrop-blur-sm">
                                                <Upload className="mr-2 w-4 h-4" /> Upload Photo
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {mode === 'camera' && (
                                    <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative w-full h-full flex flex-col items-center justify-center">
                                        <div className="relative w-full aspect-[3/4] md:aspect-auto md:h-full max-h-[500px] overflow-hidden rounded-lg border border-white/20">
                                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                                        </div>
                                        <Button onClick={capturePhoto} className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full px-10 py-6 shadow-2xl bg-white text-black hover:bg-white/90 text-xs font-bold uppercase tracking-widest">
                                            Take Photo
                                        </Button>
                                    </motion.div>
                                )}

                                {(mode === 'analyzing' || mode === 'complete') && imageSrc && (
                                    <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative w-full h-full flex items-center justify-center">
                                        <div className="relative w-full aspect-[3/4] md:aspect-auto md:h-full max-h-[500px] overflow-hidden rounded-lg border border-white/20">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={imageSrc} alt="Analyzed" className="w-full h-full object-cover" />
                                            {mode === 'analyzing' && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                                    <div className="text-center text-white space-y-4">
                                                        <Spinner className="w-10 h-10 mx-auto text-accent" />
                                                        <p className="text-sm uppercase tracking-widest animate-pulse font-medium text-accent">Analyzing Features...</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {errorMessage && (
                                <div className="absolute top-10 left-10 right-10 bg-red-500/20 border border-red-500/30 p-4 text-red-200 text-sm text-center rounded-lg backdrop-blur-md">
                                    {errorMessage}
                                    <Button variant="link" size="sm" onClick={reset} className="ml-2 h-auto p-0 text-white underline">Retry</Button>
                                </div>
                            )}
                        </div>

                        {/* Right: Results Area */}
                        <div className="p-8 md:p-12 flex flex-col bg-white/5 relative">
                            {/* Background Texture for Result Side */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light pointer-events-none"></div>

                            <h3 className="font-serif text-3xl mb-8 text-white relative z-10 border-b border-white/10 pb-6 flex items-center justify-between">
                                Analysis Report
                                {result && <Check className="w-6 h-6 text-green-400" />}
                            </h3>

                            <div className="relative z-10 flex-1">
                                {mode === 'idle' || mode === 'camera' ? (
                                    <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-4">
                                        <Sparkles className="w-12 h-12 opacity-50" />
                                        <p className="text-sm uppercase tracking-widest font-light">Waiting for capture...</p>
                                    </div>
                                ) : mode === 'analyzing' ? (
                                    <div className="space-y-6 animate-pulse opacity-50 mt-8">
                                        <div className="h-6 bg-white/10 rounded w-3/4"></div>
                                        <div className="h-4 bg-white/5 rounded w-full"></div>
                                        <div className="h-4 bg-white/5 rounded w-5/6"></div>
                                        <div className="grid grid-cols-2 gap-4 mt-8">
                                            <div className="h-24 bg-white/5 rounded"></div>
                                            <div className="h-24 bg-white/5 rounded"></div>
                                        </div>
                                    </div>
                                ) : result ? (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <div className="grid grid-cols-2 gap-4 pb-4">
                                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-accent/40 transition-colors">
                                                <span className="text-[10px] uppercase text-white/50 block mb-2 tracking-wider">Face Shape</span>
                                                <span className="font-serif text-xl text-accent">{result.faceShape}</span>
                                            </div>
                                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-accent/40 transition-colors">
                                                <span className="text-[10px] uppercase text-white/50 block mb-2 tracking-wider">Skin Tone</span>
                                                <span className="font-serif text-xl text-white">{result.skinTone}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="font-serif text-lg text-white/90">Stylist Notes</h4>
                                            <p className="text-sm text-white/70 italic leading-relaxed border-l-2 border-accent/50 pl-4 py-1">
                                                "{result.stylingAdvice.reasoning}"
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-serif text-lg mb-4 text-accent">Curated Recommendations</h4>
                                            <ul className="space-y-3">
                                                {result.stylingAdvice.jewelryRecommendations.map((rec, i) => (
                                                    <motion.li
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.1 * i }}
                                                        key={i}
                                                        className="flex items-start text-sm text-white/80"
                                                    >
                                                        <span className="mr-3 text-accent mt-1 text-[10px]">●</span>
                                                        {rec}
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="pt-6 mt-auto">
                                            <Button onClick={reset} variant="outline" className="w-full text-white border-white/20 hover:bg-white/10 hover:text-white uppercase tracking-widest text-xs h-12">
                                                Analyze New Photo
                                            </Button>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </section>
    )
}
