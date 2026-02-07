"use client"

import { Button } from "@/components/ui/button"
import { TrustStrip } from "@/components/trust-strip"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import Image from "next/image"
import { useRef } from "react"

export function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden flex items-center justify-center text-center">
      {/* Background Image with Parallax & Ken Burns Effect */}
      <motion.div
        style={{ y, scale, opacity }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/images/hero-cinematic.png"
          alt="Luxury Jewelry Background"
          fill
          priority
          className="object-cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 space-y-8 flex flex-col items-center">

        {/* Brand Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md"
        >
          <Sparkles className="w-3 h-3 text-accent" />
          <span className="text-[11px] tracking-[0.2em] uppercase text-white/90 font-medium font-sans">
            Gemus AI · Premium Selection
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-6xl md:text-8xl lg:text-9xl tracking-tight text-white leading-[0.9] drop-shadow-2xl"
        >
          The Science <br />
          <span className="italic font-light text-white/90">of Elegance.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-lg md:text-xl text-white/80 max-w-xl mx-auto leading-relaxed font-light mt-4 mix-blend-plus-lighter"
        >
          Analyze your unique facial features to discover jewelry <br className="hidden md:block" />
          curated specifically for your aura.
        </motion.p>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 1, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 pt-6"
        >
          <Button
            size="lg"
            className="group h-14 px-10 rounded-full text-sm font-semibold tracking-wide uppercase bg-white text-black hover:bg-white/90 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
          >
            Start Analysis
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-14 px-10 rounded-full text-sm font-semibold tracking-wide uppercase border-white/15 text-black hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm"
          >
            Explore Methodology
          </Button>
        </motion.div>
      </div>

      {/* Trust Strip Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="absolute bottom-10 left-0 right-0 z-10 opacity-70 scale-90"
      >
        {/* <TrustStrip /> */}
      </motion.div>
    </section>
  )
}
