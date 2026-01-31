"use client"

import { Button } from "@/components/ui/button"
import { TrustStrip } from "@/components/trust-strip"
import { HeroCarousel } from "@/components/hero-carousel"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-32 text-center overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto space-y-10">
        {/* Brand pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-3 px-4 py-2 border border-border bg-card"
        >
          <div className="w-1.5 h-1.5 bg-accent" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-sans font-medium">Gemus AI</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground leading-[1.05] text-balance"
        >
          The Science of Style.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-sans text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed text-pretty"
        >
          Gemus AI analyzes 50+ facial landmarks to find the perfect jewelry gift.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="pt-4"
        >
          <Button
            size="lg"
            className="group rounded-none h-12 px-8 text-sm font-medium tracking-wide uppercase bg-primary text-primary-foreground hover:bg-foreground/90 transition-all duration-300"
          >
            Start Analysis
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </motion.div>

        {/* Trust indicator */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xs text-muted-foreground/70 pt-2 font-sans tracking-wide"
        >
          No account required · Results in 30 seconds
        </motion.p>

        {/* Trust Strip */}
        <TrustStrip />
      </div>

      <div className="w-full mt-16 sm:mt-24 px-4">
        <HeroCarousel />
      </div>
    </section>
  )
}
