"use client"

import { Github } from "lucide-react"

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080909]/80 backdrop-blur-md border-b border-[#2a2d2e]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label="Numera logo">🧿</span>
          <span className="font-serif text-xl text-white">Numera</span>
          <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#1a1d1e] text-[#9ca3af] border border-[#2a2d2e]">
            v1.0 · MNIST
          </span>
        </div>
        <a
          href="https://github.com/abdurafay19/Digit-Classifier"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-[#1a1d1e] transition-colors"
          aria-label="View on GitHub"
        >
          <Github className="w-5 h-5 text-[#9ca3af] hover:text-white transition-colors" />
        </a>
      </div>
    </nav>
  )
}
