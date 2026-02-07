"use client"

import { useState, useRef, ChangeEvent } from "react"
import { Card } from "@/components/ui/card"
import { Camera, Upload, Check, AlertCircle, X, ImageIcon, Sparkles, ScanFace, Zap } from "lucide-react"
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
        <section ref={containerRef} className="relative py-32 overflow-hidden bg-background" id="ai-scanner">
            {/* Subtle Tech Background Grid */}
            {/* Subtle Tech Background Grid - Increased Visibility */}
            <div className="absolute inset-0 z-0 opacity-[0.05]"
                style={{
                    backgroundImage: 'linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)',
                    backgroundSize: '40px 40px'
                }}
            />
            {/* Vignette Overlay */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.03)_100%)] pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-accent/20 rounded-full shadow-sm mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                        <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/80 font-semibold">Gemus AI Engine v2.0</span>
                    </div>
                    <h2 className="font-serif text-5xl md:text-6xl text-foreground">
                        Smart Feature Recognition
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto text-lg font-light leading-relaxed">
                        Upload a photo to instantly analyze face shape, skin tone, and receive personalized jewelry recommendations.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <Card className="grid md:grid-cols-2 gap-0 overflow-hidden border border-black/10 bg-white shadow-[0_30px_60px_-12px_rgba(0,0,0,0.12)] min-h-[600px] rounded-3xl ring-1 ring-black/5">
                        {/* Left: Input Area / Viewfinder */}
                        <div className="relative flex flex-col items-center justify-center p-8 min-h-[400px] border-b md:border-b-0 md:border-r border-black/5 bg-slate-50/50">

                            {/* Decorative Tech Corners - Gold */}
                            <div className="absolute top-8 left-8 w-6 h-6 border-t-[1.5px] border-l-[1.5px] border-accent opacity-60" />
                            <div className="absolute top-8 right-8 w-6 h-6 border-t-[1.5px] border-r-[1.5px] border-accent opacity-60" />
                            <div className="absolute bottom-8 left-8 w-6 h-6 border-b-[1.5px] border-l-[1.5px] border-accent opacity-60" />
                            <div className="absolute bottom-8 right-8 w-6 h-6 border-b-[1.5px] border-r-[1.5px] border-accent opacity-60" />

                            <AnimatePresence mode="wait">
                                {mode === 'idle' && (
                                    <motion.div
                                        key="idle"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-center space-y-8 relative z-10"
                                    >
                                        <div className="w-24 h-24 rounded-full bg-white border border-accent/20 flex items-center justify-center mx-auto shadow-sm">
                                            <ScanFace className="w-10 h-10 text-accent/80" strokeWidth={1} />
                                        </div>
                                        <div className="flex flex-col gap-4 w-72">
                                            <Button onClick={startCamera} className="uppercase tracking-widest text-xs h-14 bg-foreground text-background hover:bg-foreground/90 rounded-full font-bold shadow-lg transition-transform hover:scale-105">
                                                <Camera className="mr-2 w-4 h-4" /> Open Camera
                                            </Button>
                                            <Button onClick={() => { fileInputRef.current?.click(); posthog.capture('gemini_scanner_upload_photo') }} variant="outline" className="uppercase tracking-widest text-xs h-14 border-input bg-white text-foreground hover:bg-secondary/50 rounded-full font-bold transition-all hover:border-accent/40">
                                                <Upload className="mr-2 w-4 h-4" /> Upload Photo
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {mode === 'camera' && (
                                    <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative w-full h-full flex flex-col items-center justify-center">
                                        <div className="relative w-full aspect-[3/4] md:aspect-auto md:h-full max-h-[500px] overflow-hidden rounded-2xl border border-border shadow-inner bg-black">
                                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-90" />
                                        </div>
                                        <Button onClick={capturePhoto} className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full px-10 py-6 shadow-2xl bg-white text-foreground hover:bg-white/95 text-xs font-bold uppercase tracking-widest border border-border/10">
                                            Take Photo
                                        </Button>
                                    </motion.div>
                                )}

                                {(mode === 'analyzing' || mode === 'complete') && imageSrc && (
                                    <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative w-full h-full flex items-center justify-center">
                                        <div className="relative w-full aspect-[3/4] md:aspect-auto md:h-full max-h-[500px] overflow-hidden rounded-2xl border border-border shadow-md">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={imageSrc} alt="Analyzed" className="w-full h-full object-cover" />
                                            {mode === 'analyzing' && (
                                                <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
                                                    <div className="text-center text-foreground space-y-4 bg-white/80 p-6 rounded-2xl shadow-lg border border-accent/10">
                                                        <Spinner className="w-8 h-8 mx-auto text-accent" />
                                                        <p className="text-xs uppercase tracking-widest animate-pulse font-medium text-muted-foreground">Analyzing Biometrics...</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {errorMessage && (
                                <div className="absolute top-10 left-10 right-10 bg-red-50 border border-red-100 p-4 text-red-600 text-sm text-center rounded-lg shadow-sm">
                                    {errorMessage}
                                    <Button variant="link" size="sm" onClick={reset} className="ml-2 h-auto p-0 text-red-700 underline">Retry</Button>
                                </div>
                            )}
                        </div>

                        {/* Right: Results Area */}
                        <div className="p-10 md:p-12 flex flex-col bg-white relative">

                            <h3 className="font-serif text-3xl mb-8 text-foreground relative z-10 border-b border-border pb-6 flex items-center justify-between">
                                Analysis Report
                                {result && <div className="p-1 bg-green-50 rounded-full"><Check className="w-5 h-5 text-green-600" /></div>}
                            </h3>

                            <div className="relative z-10 flex-1">
                                {mode === 'idle' || mode === 'camera' ? (
                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 space-y-4">
                                        <Zap className="w-10 h-10 opacity-30" strokeWidth={1} />
                                        <p className="text-xs uppercase tracking-widest font-medium">Ready for Input</p>
                                    </div>
                                ) : mode === 'analyzing' ? (
                                    <div className="space-y-6 animate-pulse opacity-30 mt-8">
                                        <div className="h-6 bg-foreground/10 rounded w-3/4"></div>
                                        <div className="h-4 bg-foreground/5 rounded w-full"></div>
                                        <div className="h-4 bg-foreground/5 rounded w-5/6"></div>
                                        <div className="grid grid-cols-2 gap-4 mt-8">
                                            <div className="h-24 bg-foreground/5 rounded"></div>
                                            <div className="h-24 bg-foreground/5 rounded"></div>
                                        </div>
                                    </div>
                                ) : result ? (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <div className="grid grid-cols-2 gap-4 pb-4">
                                            <div className="p-5 bg-secondary/30 rounded-xl border border-secondary/50">
                                                <span className="text-[10px] uppercase text-muted-foreground block mb-2 tracking-wider font-semibold">Face Shape</span>
                                                <span className="font-serif text-xl text-foreground">{result.faceShape}</span>
                                            </div>
                                            <div className="p-5 bg-secondary/30 rounded-xl border border-secondary/50">
                                                <span className="text-[10px] uppercase text-muted-foreground block mb-2 tracking-wider font-semibold">Skin Tone</span>
                                                <span className="font-serif text-xl text-foreground">{result.skinTone}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="font-serif text-lg text-foreground">AI Stylist Notes</h4>
                                            <p className="text-sm text-muted-foreground italic leading-relaxed border-l-2 border-accent/40 pl-4 py-1">
                                                "{result.stylingAdvice.reasoning}"
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-serif text-lg mb-4 text-foreground">Curated Recommendations</h4>
                                            <ul className="space-y-3">
                                                {result.stylingAdvice.jewelryRecommendations.map((rec, i) => (
                                                    <motion.li
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.1 * i }}
                                                        key={i}
                                                        className="flex items-start text-sm text-foreground/80"
                                                    >
                                                        <span className="mr-3 text-accent mt-1 text-[10px]">●</span>
                                                        {rec}
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="pt-6 mt-auto">
                                            <Button onClick={reset} variant="ghost" className="w-full text-muted-foreground hover:text-foreground hover:bg-secondary/50 uppercase tracking-widest text-xs h-12">
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
