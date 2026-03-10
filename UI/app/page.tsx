import { Navigation } from "@/components/numera/navigation"
import { HeroGrid } from "@/components/numera/hero-grid"
import { AppCard } from "@/components/numera/app-card"
import { Footer } from "@/components/numera/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-14">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left - Content */}
              <div className="flex flex-col gap-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight text-balance">
                  Real-time digit recognition
                </h1>
                <p className="text-lg text-[#9ca3af] max-w-md">
                  Draw any digit from 0-9 and watch our neural network classify it in real-time. 
                  Powered by PyTorch and trained on the MNIST dataset.
                </p>
                <div className="flex gap-6">
                  <div className="flex flex-col">
                    <span className="font-serif text-3xl text-[#a8f0a0]">99%</span>
                    <span className="font-mono text-xs text-[#6b7280] uppercase tracking-wider">Accuracy</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-3xl text-[#a8f0a0]">60K</span>
                    <span className="font-mono text-xs text-[#6b7280] uppercase tracking-wider">Training samples</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-3xl text-[#a8f0a0]">{"<"}50ms</span>
                    <span className="font-mono text-xs text-[#6b7280] uppercase tracking-wider">Inference</span>
                  </div>
                </div>
              </div>

              {/* Right - Hero Grid (desktop only) */}
              <div className="hidden md:flex justify-center md:justify-end">
                <HeroGrid />
              </div>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#2a2d2e] to-[#2a2d2e]" />
            <span className="font-mono text-xs text-[#6b7280] uppercase tracking-wider px-2">
              Live classifier
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#2a2d2e] to-[#2a2d2e]" />
          </div>
        </div>

        {/* App Card Section */}
        <section className="py-8 pb-16">
          <div className="max-w-3xl mx-auto px-4">
            <AppCard />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
