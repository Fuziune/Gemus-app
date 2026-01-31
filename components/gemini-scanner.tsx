"use client"

import { useState, useRef, ChangeEvent } from "react"
import { Card } from "@/components/ui/card"
import { Camera, Upload, Check, AlertCircle, X, ImageIcon, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, useInView } from "framer-motion"
import { Spinner } from "@/components/ui/spinner"
import { analyzeImageAction } from "@/app/actions/analyze"
import type { FaceAnalysisResult } from "@/lib/ai-analysis"

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
        <section ref={containerRef} className="px-6 py-32 bg-secondary/30" id="ai-scanner">
            <div className="max-w-6xl mx-auto">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span className="text-[10px] tracking-[0.3em] uppercase text-accent font-sans font-medium">Powered by Gemini AI</span>
                    </div>
                    <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Smart Feature Recognition</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Upload a photo to instantly analyze face shape, skin tone, and receive personalized jewelry recommendations.
                    </p>
                </motion.div>

                <Card className="grid md:grid-cols-2 gap-0 overflow-hidden border-border bg-card shadow-2xl min-h-[500px]">
                    {/* Left: Input Area */}
                    <div className="relative bg-black/5 flex flex-col items-center justify-center p-6 min-h-[400px]">
                        {mode === 'idle' && (
                            <div className="text-center space-y-6">
                                <div className="w-20 h-20 border border-dashed border-foreground/30 rounded-full flex items-center justify-center mx-auto">
                                    <ImageIcon className="w-8 h-8 text-foreground/50" />
                                </div>
                                <div className="flex flex-col gap-3 w-64">
                                    <Button onClick={startCamera} className="uppercase tracking-wider text-xs h-12">
                                        <Camera className="mr-2 w-4 h-4" /> Open Camera
                                    </Button>
                                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="uppercase tracking-wider text-xs h-12">
                                        <Upload className="mr-2 w-4 h-4" /> Upload Photo
                                    </Button>
                                </div>
                            </div>
                        )}

                        {mode === 'camera' && (
                            <div className="relative w-full h-full flex flex-col items-center">
                                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-md" />
                                <Button onClick={capturePhoto} className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full px-8 shadow-xl bg-white text-black hover:bg-white/90">
                                    Take Photo
                                </Button>
                            </div>
                        )}

                        {(mode === 'analyzing' || mode === 'complete') && imageSrc && (
                            <div className="relative w-full h-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={imageSrc} alt="Analyzed" className="w-full h-full object-cover" />
                                {mode === 'analyzing' && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                                        <div className="text-center text-white space-y-3">
                                            <Spinner className="w-8 h-8 mx-auto" />
                                            <p className="text-xs uppercase tracking-widest animate-pulse">Processing with AI...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {errorMessage && (
                            <div className="absolute top-4 left-4 right-4 bg-red-500/10 border border-red-500/20 p-3 text-red-500 text-xs text-center rounded">
                                {errorMessage}
                                <Button variant="link" size="sm" onClick={reset} className="ml-2 h-auto p-0 text-red-500 underline">Retry</Button>
                            </div>
                        )}
                    </div>

                    {/* Right: Results Area */}
                    <div className="p-8 bg-card flex flex-col">
                        <h3 className="font-serif text-2xl mb-8 border-b pb-4">Analysis Report</h3>

                        {mode === 'idle' || mode === 'camera' ? (
                            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm italic">
                                Waiting for input...
                            </div>
                        ) : mode === 'analyzing' ? (
                            <div className="space-y-4 animate-pulse opacity-50">
                                <div className="h-4 bg-secondary rounded w-3/4"></div>
                                <div className="h-4 bg-secondary rounded w-1/2"></div>
                                <div className="h-32 bg-secondary rounded w-full mt-8"></div>
                            </div>
                        ) : result ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-secondary/20 rounded">
                                        <span className="text-[10px] uppercase text-muted-foreground block mb-1">Face Shape</span>
                                        <span className="font-medium text-lg text-accent">{result.faceShape}</span>
                                    </div>
                                    <div className="p-3 bg-secondary/20 rounded">
                                        <span className="text-[10px] uppercase text-muted-foreground block mb-1">Skin Tone</span>
                                        <span className="font-medium text-sm">{result.skinTone}</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-[10px] uppercase text-muted-foreground block mb-2">Features Identified</span>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-xs border px-2 py-1 rounded-full">{result.genderPresentation}</span>
                                        <span className="text-xs border px-2 py-1 rounded-full">{result.estimatedAgeRange} years</span>
                                        {result.facialFeatures.distinctiveFeatures.map((f, i) => (
                                            <span key={i} className="text-xs border px-2 py-1 rounded-full bg-secondary/10">{f}</span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-serif text-lg mb-2 mt-4 text-accent">Stylist Recommendations</h4>
                                    <ul className="space-y-2 mb-4">
                                        {result.stylingAdvice.jewelryRecommendations.map((rec, i) => (
                                            <li key={i} className="flex items-start text-sm">
                                                <Check className="w-4 h-4 mr-2 text-accent shrink-0 mt-0.5" />
                                                {rec}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-xs text-muted-foreground italic pl-6 border-l-2 border-accent/30">
                                        "{result.stylingAdvice.reasoning}"
                                    </p>
                                </div>

                                <div className="pt-4 mt-auto">
                                    <Button onClick={reset} variant="outline" className="w-full">
                                        Scan Another
                                    </Button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </Card>
            </div>
        </section>
    )
}
