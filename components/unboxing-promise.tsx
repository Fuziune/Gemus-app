"use client"

import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

const features = [
  "Luxury Packaging",
  "Authenticity Certificate",
  "Care Instructions",
]

export function UnboxingPromise() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="px-6 py-32 bg-secondary/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/3] overflow-hidden bg-secondary/30"
          >
            <Image
              src="/images/premium-gift-box.jpg"
              alt="Premium jewelry gift packaging"
              fill
              className="object-cover"
            />
            {/* Overlay badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-4 left-4 bg-card border border-accent px-4 py-2 flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 bg-accent" />
              <span className="text-[10px] font-mono text-foreground uppercase tracking-wider">
                Premium
              </span>
            </motion.div>
          </motion.div>

          {/* Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[10px] tracking-[0.3em] uppercase text-accent mb-5 font-sans font-medium">
                The Promise
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground text-balance leading-[1.1]">
                Not just a gift,
                <br />
                a moment.
              </h2>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-muted-foreground font-sans leading-relaxed"
            >
              Every piece from our verified Romanian jewelers arrives in premium packaging. 
              From the elegant box to the finishing details, every element is designed to make 
              the unboxing as special as the gift itself.
            </motion.p>

            <div className="flex flex-wrap gap-3 pt-4">
              {features.map((feature, index) => (
                <motion.div 
                  key={feature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.35 + index * 0.08,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="flex items-center gap-2.5 px-4 py-2.5 bg-card border border-border"
                >
                  <div className="w-1 h-1 bg-accent" />
                  <span className="text-xs text-foreground font-sans">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
