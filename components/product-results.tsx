"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Truck, RotateCcw } from "lucide-react"
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
  },
  {
    id: 2,
    name: "Cercei Aurora",
    price: "1.890 RON",
    image: "/images/jewelry-earrings.jpg",
    matchScore: 94,
    deliveryBadge: "Verificarea Coletului",
    deliveryIcon: RotateCcw,
  },
  {
    id: 3,
    name: "Bratara Soleil",
    price: "1.250 RON",
    image: "/images/jewelry-bracelet.jpg",
    matchScore: 91,
    deliveryBadge: "Ships via Easybox",
    deliveryIcon: Truck,
  },
]

export function ProductResults() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="px-6 py-32">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-accent mb-5 font-sans font-medium">
            Results
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground text-balance">
            Your matches.
          </h2>
        </motion.div>

        {/* Product grid */}
        <div className="grid md:grid-cols-3 gap-px bg-border">
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.1 + index * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <Card className="group relative overflow-hidden bg-card border-0 rounded-none">
                {/* Match Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="px-3 py-1.5 bg-card border border-accent text-accent">
                    <span className="text-xs font-mono tracking-wider">
                      {product.matchScore}% MATCH
                    </span>
                  </div>
                </div>

                {/* Product Image */}
                <div className="aspect-[3/4] overflow-hidden bg-secondary/30">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={533}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Product Info */}
                <div className="p-6 border-t border-border">
                  {/* Trust Badge */}
                  <div className="mb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-border bg-secondary/30">
                      <product.deliveryIcon className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
                      <span className="text-[10px] text-muted-foreground font-sans uppercase tracking-wider">
                        {product.deliveryBadge}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-serif text-xl text-foreground mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground font-mono">
                        {product.price}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-none w-10 h-10 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300 group/btn"
                    >
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                    </Button>
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
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mt-16"
        >
          <Button
            variant="outline"
            size="lg"
            className="rounded-none h-12 px-10 border-border text-foreground hover:bg-secondary/30 hover:border-accent bg-transparent uppercase tracking-wider text-xs transition-all duration-300"
          >
            Explore Full Collection
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
