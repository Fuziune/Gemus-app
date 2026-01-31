"use client"

import { useState, useEffect, useRef, ChangeEvent } from "react"
import { Card } from "@/components/ui/card"
import { Camera, Upload, Check, AlertCircle, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, useInView } from "framer-motion"
import { Spinner } from "@/components/ui/spinner"
import { analyzeFaceShape } from "@/lib/face-logic"
import { FaceLandmarker, FilesetResolver, FaceLandmarkerResult } from "@mediapipe/tasks-vision"

export function ScannerInterface() {
  const [mode, setMode] = useState<'idle' | 'camera' | 'upload'>('idle');
  const isScanning = mode !== 'idle';
  const [modelLoaded, setModelLoaded] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);

  const [faceShape, setFaceShape] = useState<string>("Analyzing...")
  const [recommendation, setRecommendation] = useState<string>("")
  const [scanProgress, setScanProgress] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const landmarkerRef = useRef<FaceLandmarker | null>(null)
  const requestRef = useRef<number>(null)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  useEffect(() => {
    const loadModel = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        landmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "CPU"
          },
          outputFaceBlendshapes: true,
          // STABILITY FIX: Use IMAGE mode. 
          // VIDEO mode requires strict increasing timestamps which causes crashes if desynced.
          // IMAGE mode treats every frame independently, which is robust for both webcam and uploads.
          runningMode: "IMAGE",
          numFaces: 1
        });
        setModelLoaded(true);
      } catch (err) {
        console.error("Failed to load AI Model", err);
        setErrorMessage("AI Model failed to load. Refresh page.");
      }
    };
    loadModel();
  }, []);

  const resetScanState = () => {
    setFaceShape("Analyzing...");
    setRecommendation("");
    setScanProgress(0);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }

  const startCamera = async () => {
    resetScanState();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          setMode('camera');
          setErrorMessage(null);
          predictWebcam();
        };
      }
    } catch (err) {
      setErrorMessage("Camera access denied. Please allow permissions.");
      setMode('idle');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setMode('idle');
    resetScanState();
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    resetScanState();
    stopCamera();
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImageSrc(e.target?.result as string);
      setMode('upload');
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const closeUpload = () => {
    setUploadedImageSrc(null);
    setMode('idle');
    resetScanState();
  }

  const drawResults = (results: FaceLandmarkerResult, inputElement: HTMLVideoElement | HTMLImageElement) => {
    if (!canvasRef.current || !results.faceLandmarks || results.faceLandmarks.length === 0) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const rect = inputElement.getBoundingClientRect();
    canvasRef.current.width = rect.width;
    canvasRef.current.height = rect.height;
    const videoWidth = inputElement instanceof HTMLVideoElement ? inputElement.videoWidth : inputElement.naturalWidth;
    const videoHeight = inputElement instanceof HTMLVideoElement ? inputElement.videoHeight : inputElement.naturalHeight;
    const scale = Math.max(canvasRef.current.width / videoWidth, canvasRef.current.height / videoHeight);
    const xOffset = (canvasRef.current.width - videoWidth * scale) / 2;
    const yOffset = (canvasRef.current.height - videoHeight * scale) / 2;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.lineWidth = 2;
    const mapCoord = (pt: { x: number, y: number }) => ({
      x: pt.x * videoWidth * scale + xOffset,
      y: pt.y * videoHeight * scale + yOffset
    });
    const landmarks = results.faceLandmarks[0];
    ctx.strokeStyle = "#00BFFF";
    ctx.beginPath();
    ctx.moveTo(mapCoord(landmarks[172]).x, mapCoord(landmarks[172]).y);
    ctx.lineTo(mapCoord(landmarks[397]).x, mapCoord(landmarks[397]).y);
    ctx.stroke();
    ctx.strokeStyle = "#D4AF37";
    ctx.beginPath();
    ctx.moveTo(mapCoord(landmarks[234]).x, mapCoord(landmarks[234]).y);
    ctx.lineTo(mapCoord(landmarks[454]).x, mapCoord(landmarks[454]).y);
    ctx.stroke();
  }

  const predictWebcam = async () => {
    if (mode !== 'camera' || !landmarkerRef.current || !videoRef.current || !canvasRef.current) return;
    // IMAGE mode detection (stateless, no timestamp needed)
    const results = landmarkerRef.current.detect(videoRef.current);
    if (results.faceLandmarks && results.faceLandmarks.length > 0) {
      const analysis = analyzeFaceShape(results.faceLandmarks[0]);
      if (analysis) {
        setFaceShape(analysis.shape);
        setRecommendation(analysis.recommendation);
        setScanProgress(prev => Math.min(prev + 1, 100));
        drawResults(results, videoRef.current);
      }
    } else {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    requestRef.current = requestAnimationFrame(predictWebcam);
  };

  // SAFEGUARD: Effect to trigger prediction when image changes
  useEffect(() => {
    if (mode === 'upload' && uploadedImageSrc && modelLoaded && landmarkerRef.current) {
      predictImage(uploadedImageSrc);
    }
  }, [mode, uploadedImageSrc, modelLoaded]);

  const predictImage = async (src: string) => {
    resetScanState();
    if (!landmarkerRef.current) {
      console.error("[predictImage] Landmarker not initialized");
      setErrorMessage("AI model not ready. Please refresh.");
      return;
    }

    try {
      console.log("[predictImage] Starting prediction...");

      // Load image
      const img = new Image();
      img.crossOrigin = "anonymous"; // Prevent CORS issues
      img.src = src;

      await img.decode();
      console.log(`[predictImage] Image decoded: ${img.naturalWidth}x${img.naturalHeight}`);

      // AGGRESSIVE DOWNSCALING: Use 512px max to minimize memory usage
      const MAX_DIMENSION = 512;
      let width = img.naturalWidth;
      let height = img.naturalHeight;

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
        console.log(`[predictImage] Downscaling to: ${width}x${height}`);
      }

      // Validate dimensions
      if (width < 100 || height < 100 || width > 2048 || height > 2048) {
        throw new Error(`Invalid dimensions: ${width}x${height}`);
      }

      // Use simple canvas instead of ImageBitmap (more compatible)
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', {
        willReadFrequently: false,
        alpha: false
      });

      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      // Draw with explicit dimensions
      ctx.drawImage(img, 0, 0, width, height);
      console.log("[predictImage] Canvas prepared, calling detect()...");

      // Wrap detect in try-catch to catch WASM errors
      let results;
      try {
        results = landmarkerRef.current.detect(canvas);
        console.log("[predictImage] Detection completed successfully");
      } catch (detectError) {
        console.error("[predictImage] Detection failed:", detectError);
        throw new Error(`Face detection failed: ${detectError instanceof Error ? detectError.message : 'Unknown error'}`);
      }

      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        console.log("[predictImage] Face detected, analyzing shape...");
        const analysis = analyzeFaceShape(results.faceLandmarks[0]);
        if (analysis) {
          setFaceShape(analysis.shape);
          setRecommendation(analysis.recommendation);

          // Draw visual feedback
          if (imageRef.current) {
            drawResults(results, imageRef.current);
          }

          setScanProgress(0);
          const interval = setInterval(() => {
            setScanProgress(prev => {
              if (prev >= 100) {
                clearInterval(interval);
                return 100;
              }
              return prev + 10;
            });
          }, 50);
          console.log("[predictImage] Analysis complete!");
        }
      } else {
        console.warn("[predictImage] No face detected in image");
        setErrorMessage("No face detected. Please try a clearer photo with your face visible.");
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Unknown error';
      console.error("[predictImage] Error:", errorMsg, e);
      setErrorMessage(`Analysis failed: ${errorMsg}`);
    }
  }

  const getStepStatus = (index: number) => {
    if (!isScanning) return "pending";
    if (index === 0 && scanProgress > 20) return "complete";
    if (index === 1 && scanProgress > 60) return "complete";
    if (index === 2 && scanProgress > 90) return "complete";
    if (index === 0 && scanProgress <= 20) return "processing";
    if (index === 1 && scanProgress > 20) return "processing";
    if (index === 2 && scanProgress > 60) return "processing";
    return "pending";
  }

  const steps = [
    { label: "Face Shape", log: "GEOMETRY_DETECT", value: faceShape },
    { label: "Undertone", log: "SPECTRUM_ANALYSIS", value: "Detecting..." },
    { label: "Confidence", log: "MATCH_PROBABILITY", value: `${Math.floor(scanProgress)}%` },
  ]

  return (
    <section ref={containerRef} className="px-6 py-32 bg-secondary/50" id="scanner">
      <div className="max-w-5xl mx-auto">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-accent mb-5 font-sans font-medium">AI Analysis</p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground text-balance">Precision engineered.</h2>
        </motion.div>

        <Card className="relative overflow-hidden bg-card border-border rounded-none shadow-2xl">
          <div className="grid md:grid-cols-[1fr,300px]">

            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[480px] bg-secondary/20 flex items-center justify-center overflow-hidden group">
              {mode === 'camera' && (
                <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
              )}
              {mode === 'upload' && uploadedImageSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img ref={imageRef} src={uploadedImageSrc} alt="Uploaded" className="absolute inset-0 w-full h-full object-cover" />
              )}
              <canvas ref={canvasRef} className={cn("absolute inset-0 w-full h-full z-10 pointer-events-none", !isScanning && "hidden")} />
              <div className="absolute inset-8 border border-border/40 z-20 pointer-events-none">
                <div className="absolute -top-px -left-px w-6 h-6 border-t-2 border-l-2 border-accent" />
                <div className="absolute -top-px -right-px w-6 h-6 border-t-2 border-r-2 border-accent" />
                <div className="absolute -bottom-px -left-px w-6 h-6 border-b-2 border-l-2 border-accent" />
                <div className="absolute -bottom-px -right-px w-6 h-6 border-b-2 border-r-2 border-accent" />
                {isScanning && (
                  <div className="absolute inset-x-0 top-0 h-px bg-accent/80 shadow-[0_0_15px_rgba(212,175,55,0.8)] animate-scan" />
                )}
              </div>

              {mode === 'idle' && (
                <div className="text-center space-y-6 z-30 relative p-6">
                  <div className="w-16 h-16 border border-border bg-background shadow-sm flex items-center justify-center mx-auto rounded-full mb-4">
                    {!modelLoaded ? (
                      <Spinner className="w-6 h-6 text-accent" />
                    ) : errorMessage ? (
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-foreground" strokeWidth={1.5} />
                    )}
                  </div>
                  {errorMessage && (
                    <p className="text-red-400 text-xs font-medium mb-4">{errorMessage}</p>
                  )}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button onClick={startCamera} disabled={!modelLoaded} className="rounded-none bg-accent hover:bg-accent/90 text-black font-medium w-48 h-12 uppercase tracking-wider text-xs">
                      <Camera className="w-4 h-4 mr-2" /> Use Camera
                    </Button>
                    <span className="text-muted-foreground text-xs font-sans uppercase tracking-widest">or</span>
                    <Button onClick={handleUploadClick} disabled={!modelLoaded} variant="outline" className="rounded-none border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground w-48 h-12 uppercase tracking-wider text-xs">
                      <Upload className="w-4 h-4 mr-2" /> Upload Photo
                    </Button>
                  </div>
                  <p className="text-muted-foreground/60 text-[10px] uppercase tracking-widest mt-4">
                    Privacy Protected. Photos are analyzed locally.
                  </p>
                </div>
              )}

              {mode === 'camera' && (
                <Button onClick={stopCamera} variant="destructive" size="sm" className="absolute bottom-4 z-50 rounded-full px-6 shadow-lg">
                  Stop Camera
                </Button>
              )}
              {mode === 'upload' && (
                <Button onClick={closeUpload} variant="secondary" size="icon" className="absolute top-4 right-4 z-50 rounded-full bg-background/80 backdrop-blur text-foreground border border-border shadow-sm hover:bg-background">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="border-t md:border-t-0 md:border-l border-border bg-card p-8 flex flex-col justify-between min-h-[480px]">
              <div>
                <div className="space-y-1 mb-8">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-sans">System Log</p>
                  <p className="text-sm text-foreground font-mono">GEMUS_CORE_v1.2.1</p>
                </div>
                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const status = getStepStatus(index);
                    return (
                      <div key={index} className={cn(
                        "border p-4 transition-all duration-300",
                        status === "complete" ? "border-accent/40 bg-accent/5" : "border-border/40"
                      )}>
                        <div className="flex justify-between mb-2">
                          <span className="text-[10px] font-mono text-muted-foreground uppercase">{step.log}</span>
                          {status === "processing" && <Spinner className="w-3 h-3 text-accent" />}
                          {status === "complete" && <Check className="w-3 h-3 text-accent" />}
                        </div>
                        <p className={cn(
                          "text-sm font-medium font-sans",
                          status === "complete" ? "text-foreground" : "text-muted-foreground/50"
                        )}>
                          {status === "pending" ? "Waiting..." : step.value}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
              <motion.div
                initial={false}
                animate={scanProgress > 95 ? { opacity: 1, y: 0, pointerEvents: 'auto' } : { opacity: 0, y: 10, pointerEvents: 'none' }}
              >
                <Button className="w-full mt-6 bg-primary text-primary-foreground rounded-none h-12 uppercase tracking-widest text-xs hover:bg-primary/90 transition-all">
                  View {faceShape} Collection
                </Button>
                <p className="text-xs text-muted-foreground mt-4 text-center leading-relaxed font-sans">
                  {recommendation}
                </p>
              </motion.div>
            </div>

          </div>
        </Card>
      </div>
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .animate-scan { animation: scan 3s ease-in-out infinite; }
      `}</style>
    </section>
  )
}