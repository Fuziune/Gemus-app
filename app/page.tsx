"use client"

import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { ScannerInterface } from "@/components/scanner-interface"
import { GeminiScanner } from "@/components/gemini-scanner"
import { ProductResults } from "@/components/product-results"
import { UnboxingPromise } from "@/components/unboxing-promise"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function GemusLandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="relative min-h-screen bg-background selection:bg-accent/20">
      {/* Navigation */}
      <nav
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b",
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-border py-2"
            : "bg-transparent border-transparent py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className={cn(
            "font-serif text-xl tracking-wide transition-colors duration-300",
            isScrolled ? "text-foreground" : "text-white"
          )}>
            Gemus
          </div>
          <div className="flex items-center gap-8">
            <a href="#how-it-works" className={cn(
              "text-[10px] font-sans uppercase tracking-[0.2em] transition-colors duration-300 hidden sm:block",
              isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"
            )}>
              Methodology
            </a>
            <a href="#results" className={cn(
              "text-[10px] font-sans uppercase tracking-[0.2em] transition-colors duration-300 hidden sm:block",
              isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"
            )}>
              Collection
            </a>
            <button className={cn(
              "text-[10px] font-medium font-sans uppercase tracking-[0.2em] transition-colors duration-300 px-4 py-2 border rounded-full",
              isScrolled
                ? "text-foreground border-foreground/20 hover:bg-foreground hover:text-background"
                : "text-white border-white/30 hover:bg-white hover:text-black"
            )}>
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* How It Works */}
      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* Scanner Interface */}
      {/* <ScannerInterface /> */}

      {/* AI Gemini Scanner (New Feature) */}
      <GeminiScanner />

      {/* Results */}
      <div id="results">
        <ProductResults />
      </div>

      {/* Unboxing Promise */}
      <UnboxingPromise />

      {/* Footer */}
      <footer className="px-6 py-20 border-t border-border bg-secondary/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="font-serif text-2xl text-foreground mb-2">Gemus</div>
            <p className="text-[10px] text-muted-foreground font-sans uppercase tracking-[0.2em]">
              The science of the perfect gift.
            </p>
          </div>
          <div className="flex items-center gap-12">
            <a href="#" className="text-[10px] text-muted-foreground hover:text-foreground transition-colors duration-300 font-sans uppercase tracking-[0.2em]">
              Privacy Policy
            </a>
            <a href="#" className="text-[10px] text-muted-foreground hover:text-foreground transition-colors duration-300 font-sans uppercase tracking-[0.2em]">
              Terms of Service
            </a>
            <a href="#" className="text-[10px] text-muted-foreground hover:text-foreground transition-colors duration-300 font-sans uppercase tracking-[0.2em]">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
