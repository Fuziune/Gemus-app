"use client"

import { motion, useInView } from "framer-motion"
import { ScanFace, Cpu, Gift } from "lucide-react"
import { useRef } from "react"

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
          className="w-full h-full object-cover opacity-100"
          src="/videos/Jewellry_video_1.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-accent mb-5 font-sans font-medium">
            Methodology
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground text-balance">
            Three precise steps.
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 bg-transparent">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{
                duration: 0.8,
                delay: 0.15 + index * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="group relative p-10 bg-white/40 backdrop-blur-md hover:bg-white/60 transition-colors duration-500 border border-white/20 shadow-lg"
            >
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-10">
                <div className="w-12 h-12 border border-foreground/10 flex items-center justify-center transition-all duration-500 group-hover:border-accent">
                  <step.icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                </div>
                <span className="text-5xl font-serif text-foreground/10 group-hover:text-accent/30 transition-colors duration-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Content */}
              <h3 className="font-serif text-2xl text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
