"use client"

import { motion } from "framer-motion"
import { Scan, ShieldCheck, BadgeCheck } from "lucide-react"

const trustIndicators = [
  { icon: Scan, label: "AI Vision" },
  { icon: ShieldCheck, label: "Private & Secure" },
  { icon: BadgeCheck, label: "Verified Jewelers" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.6,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function TrustStrip() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex items-center justify-center gap-12 md:gap-16 pt-12"
    >
      {trustIndicators.map((item) => (
        <motion.div
          key={item.label}
          variants={itemVariants}
          className="flex flex-col items-center gap-3 opacity-60 hover:opacity-100 transition-opacity duration-500"
        >
          <div className="w-10 h-10 border border-border bg-card flex items-center justify-center">
            <item.icon className="w-4 h-4 text-foreground" strokeWidth={1.5} />
          </div>
          <span className="text-[10px] text-muted-foreground font-sans tracking-[0.15em] uppercase">
            {item.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}
