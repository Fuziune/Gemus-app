"use client"

import { motion, useInView } from "framer-motion"
import { ScanFace, Cpu, Gift } from "lucide-react"
import { useRef } from "react"
import { cn } from "@/lib/utils"

const steps = [
  {
    icon: ScanFace,
    title: "Scan",
    description: "Our AI analyzes 50+ facial landmarks with medical-grade precision.",
  },
  {
    icon: Cpu,
    title: "Match",
    description: "We compare results against 5,000+ curated Romanian designs.",
  },
  {
    icon: Gift,
    title: "Gift",
    description: "Receive a personalized list with 95% match guarantee.",
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative px-6 py-32 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          src="/videos/Jewellry_video_1.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />



        {/* Bottom Gradient - Fades from Transparent to Page Background */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full backdrop-blur-md mb-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/90 font-semibold">Methodology</span>
          </div>
          <h2 className="font-serif text-4xl md:text-6xl text-white drop-shadow-sm">
            Three precise steps.
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{
                duration: 0.8,
                delay: 0.2 + index * 0.15,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="group relative p-12 min-h-[450px] flex flex-col justify-between rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

              {/* Step indicator */}
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10 group-hover:border-accent/50">
                  <step.icon className="w-7 h-7 text-white/80 group-hover:text-accent transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <span className="text-7xl font-serif text-white/5 group-hover:text-white/10 transition-colors duration-500 font-bold">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10 mt-auto">
                <h3 className="font-serif text-3xl text-white mb-6 group-hover:translate-x-1 transition-transform duration-300">
                  {step.title}
                </h3>
                <p className="text-base text-white/70 font-light leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
