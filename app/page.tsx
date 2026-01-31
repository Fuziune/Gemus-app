import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { ScannerInterface } from "@/components/scanner-interface"
import { GeminiScanner } from "@/components/gemini-scanner"
import { ProductResults } from "@/components/product-results"
import { UnboxingPromise } from "@/components/unboxing-promise"

export default function GemusLandingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-serif text-lg tracking-wide text-foreground">
            Gemus
          </div>
          <div className="flex items-center gap-10">
            <a href="#how-it-works" className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300 font-sans uppercase tracking-wider hidden sm:block">
              Methodology
            </a>
            <a href="#results" className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300 font-sans uppercase tracking-wider hidden sm:block">
              Collection
            </a>
            <button className="text-xs font-medium text-foreground hover:text-accent transition-colors duration-300 font-sans uppercase tracking-wider">
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
      <footer className="px-6 py-16 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="font-serif text-lg text-foreground">Gemus</div>
          <p className="text-[10px] text-muted-foreground font-sans uppercase tracking-wider">
            The science of the perfect gift.
          </p>
          <div className="flex items-center gap-10">
            <a href="#" className="text-[10px] text-muted-foreground hover:text-foreground transition-colors duration-300 font-sans uppercase tracking-wider">
              Privacy
            </a>
            <a href="#" className="text-[10px] text-muted-foreground hover:text-foreground transition-colors duration-300 font-sans uppercase tracking-wider">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
