"use client"

import { Loader2 } from "lucide-react"

interface PredictionResult {
  prediction: number
  confidence: number
  probabilities: Record<string, number>
}

interface ResultsPanelProps {
  result: PredictionResult | null
  isLoading: boolean
}

export function ResultsPanel({ result, isLoading }: ResultsPanelProps) {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-[#9ca3af] uppercase tracking-wider">Output</span>
        <span className="text-[#4a4d4e]">·</span>
        <span className="font-mono text-xs text-[#6b7280]">Prediction & Distribution</span>
      </div>

      <div className="flex-1 flex flex-col justify-center min-h-[280px] sm:min-h-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8">
            <Loader2 className="w-8 h-8 text-[#a8f0a0] animate-spin" />
            <span className="font-mono text-sm text-[#6b7280]">Analyzing...</span>
          </div>
        ) : result ? (
          <div className="flex flex-col gap-6">
            {/* Top Prediction */}
            <div className="flex flex-col items-center gap-2">
              <span className="font-serif text-7xl text-[#a8f0a0] drop-shadow-[0_0_30px_rgba(168,240,160,0.5)]">
                {result.prediction}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-[#9ca3af]">Confidence:</span>
                <span className="font-mono text-sm text-[#a8f0a0]">
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
              {/* Confidence Bar */}
              <div className="w-full max-w-[200px] h-2 bg-[#1a1d1e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#a8f0a0] to-[#6ee7b7] rounded-full transition-all duration-500"
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
            </div>

            {/* Probability Distribution */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs text-[#6b7280] uppercase tracking-wider">Distribution</span>
              <div className="flex flex-col gap-1.5">
                {Object.entries(result.probabilities)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([digit, prob]) => (
                    <div key={digit} className="flex items-center gap-2">
                      <span className="font-serif text-sm text-[#6b7280] w-4">{digit}</span>
                      <div className="flex-1 h-4 bg-[#1a1d1e] rounded overflow-hidden">
                        <div
                          className={`h-full rounded transition-all duration-500 ${
                            parseInt(digit) === result.prediction
                              ? "bg-[#a8f0a0]"
                              : "bg-[#3a3d3e]"
                          }`}
                          style={{ width: `${Math.max(prob * 100, 1)}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-[#6b7280] w-12 text-right">
                        {(prob * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <div className="w-16 h-16 rounded-xl bg-[#1a1d1e] flex items-center justify-center">
              <span className="font-serif text-3xl text-[#3a3d3e]">?</span>
            </div>
            <span className="font-mono text-sm text-[#4a4d4e]">
              Draw a digit and run inference
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
