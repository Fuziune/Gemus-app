"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Truck, CheckCircle2, Sparkles, Eye } from "lucide-react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const products = [
  {
    id: 1,
    name: "Pandantiv Celeste",
    price: "2.450 RON",
    image: "/images/jewelry-necklace.jpg",
    matchScore: 98,
    deliveryBadge: "Ships via Easybox",
    deliveryIcon: Truck,
    tags: ["Bestseller", "Perfect Match"],
  },
  {
    id: 2,
    name: "Cercei Aurora",
    price: "1.890 RON",
    image: "/images/jewelry-earrings.jpg",
    matchScore: 94,
    deliveryBadge: "Verificarea Coletului",
    deliveryIcon: CheckCircle2,
    tags: ["New Arrival"],
  },
  {
    id: 3,
    name: "Bratara Soleil",
    price: "1.250 RON",
    image: "/images/jewelry-bracelet.jpg",
    matchScore: 91,
    deliveryBadge: "Ships via Easybox",
    deliveryIcon: Truck,
    tags: [],
  },
]

export function ProductResults() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="px-6 py-32 bg-secondary/10">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full mb-2">
            <Sparkles className="w-3 h-3 text-accent" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-accent font-semibold">Curated For You</span>
          </div>
          <h2 className="font-serif text-5xl md:text-6xl text-foreground text-balance">
            Your Perfect Matches.
          </h2>
          <p className="font-sans text-muted-foreground max-w-lg mx-auto text-lg font-light">
            Based on your analysis, these pieces harmonize best with your features.
          </p>
        </motion.div>

        {/* Product grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{
                duration: 0.8,
                delay: 0.1 + index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <Card className="group relative overflow-hidden bg-white border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-xl h-full flex flex-col">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                  {/* Match Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="px-3 py-1.5 bg-white/90 backdrop-blur border border-accent/30 text-accent rounded-full shadow-lg">
                      <span className="text-xs font-bold tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {product.matchScore}% MATCH
                      </span>
                    </div>
                  </div>

                  {/* Quick View Overlay (Appears on Hover) */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center backdrop-blur-[2px]">
                    <Button variant="secondary" size="sm" className="bg-white text-black hover:bg-white/90 rounded-full px-6 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 font-medium">
                      <Eye className="w-4 h-4 mr-2" />
                      Quick View
                    </Button>
                  </div>

                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={500}
                    height={667}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Product Info */}
                <div className="p-8 flex flex-col flex-1 bg-white">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-md">
                      <product.deliveryIcon className="w-3 h-3 text-gray-500" strokeWidth={2} />
                      <span className="text-[10px] text-gray-600 font-medium uppercase tracking-wider">
                        {product.deliveryBadge}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <h3 className="font-serif text-2xl text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
                      <p className="text-lg font-medium text-foreground/80 font-sans">
                        {product.price}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full w-10 h-10 text-muted-foreground hover:text-white hover:bg-black transition-all duration-300"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mt-20"
        >
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-12 rounded-full border-foreground/10 text-foreground hover:bg-foreground hover:text-white hover:border-transparent uppercase tracking-widest text-xs font-semibold transition-all duration-300"
          >
            Explore Full Collection
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
