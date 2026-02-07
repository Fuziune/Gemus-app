"use client"

import { ShieldCheck, Truck, RotateCcw, Clock } from "lucide-react"

const benefits = [
  {
    icon: ShieldCheck,
    text: "Certified 14K Gold",
  },
  {
    icon: Truck,
    text: "Free Shipping",
  },
  {
    icon: RotateCcw,
    text: "30-Day Returns",
  },
  {
    icon: Clock,
    text: "2-Year Warranty",
  },
]

export function TrustStrip() {
  return (
    <div className="w-full border-t border-white/10 pt-8 mt-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-2 text-center group"
          >
            <benefit.icon
              className="w-5 h-5 text-white/60 group-hover:text-white transition-colors duration-300"
              strokeWidth={1.5}
            />
            <span className="text-[10px] uppercase tracking-widest text-white/50 group-hover:text-white/80 transition-colors duration-300 font-medium">
              {benefit.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
