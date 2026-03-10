"use client"

import { useState, useRef, useCallback } from "react"
import { DrawingCanvas } from "./drawing-canvas"
import { ResultsPanel } from "./results-panel"
import { Loader2 } from "lucide-react"

interface PredictionResult {
  prediction: number
  confidence: number
  probabilities: Record<string, number>
}

export function AppCard() {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [clearTrigger, setClearTrigger] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas
  }, [])

  const handleClear = useCallback(() => {
    setClearTrigger((prev) => prev + 1)
    setResult(null)
  }, [])

  const handleRunInference = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsLoading(true)

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png")
      })

      const formData = new FormData()
      formData.append("file", blob, "digit.png")

      const response = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Prediction failed")
      }

      const data: PredictionResult = await response.json()
      setResult(data)

      // Scroll results into view on mobile
      if (window.innerWidth <= 680 && resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    } catch (error) {
      console.error("Inference error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#111314] rounded-2xl border border-[#2a2d2e] shadow-2xl shadow-black/50 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left Pane - Canvas */}
        <div className="p-6 border-b md:border-b-0 md:border-r border-[#2a2d2e]">
          <DrawingCanvas
            onCanvasReady={handleCanvasReady}
            onClear={handleClear}
            clearTrigger={clearTrigger}
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleRunInference}
              disabled={isLoading}
              className="flex-1 h-12 sm:h-10 bg-[#a8f0a0] hover:bg-[#8ed888] active:bg-[#7ac878] text-[#080909] font-mono text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,240,160,0.2)] hover:shadow-[0_0_30px_rgba(168,240,160,0.3)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Run Inference"
              )}
            </button>
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="h-12 sm:h-10 px-6 border border-[#2a2d2e] hover:border-[#4a4d4e] text-[#9ca3af] hover:text-white font-mono text-sm rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Right Pane - Results */}
        <div ref={resultsRef} className="p-6">
          <ResultsPanel result={result} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
