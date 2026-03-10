"use client"

import { useRef, useEffect, useState, useCallback } from "react"

interface DrawingCanvasProps {
  onCanvasReady: (canvas: HTMLCanvasElement) => void
  onClear: () => void
  clearTrigger: number
}

export function DrawingCanvas({ onCanvasReady, clearTrigger }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const rect = container.getBoundingClientRect()
    const size = Math.min(rect.width, rect.height)
    const dpr = window.devicePixelRatio || 1

    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.scale(dpr, dpr)
      ctx.fillStyle = "#0a0b0b"
      ctx.fillRect(0, 0, size, size)
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 20
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
    }

    onCanvasReady(canvas)
  }, [onCanvasReady])

  useEffect(() => {
    setupCanvas()
    window.addEventListener("resize", setupCanvas)
    window.addEventListener("orientationchange", setupCanvas)
    return () => {
      window.removeEventListener("resize", setupCanvas)
      window.removeEventListener("orientationchange", setupCanvas)
    }
  }, [setupCanvas])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    const dpr = window.devicePixelRatio || 1
    const size = canvas.width / dpr
    ctx.fillStyle = "#0a0b0b"
    ctx.fillRect(0, 0, size, size)
    setHasDrawn(false)
  }, [clearTrigger])

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX
    const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    const { x, y } = getCoordinates(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x, y)
    ctx.stroke()
    setIsDrawing(true)
    setHasDrawn(true)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    e.preventDefault()
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    const { x, y } = getCoordinates(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-[#9ca3af] uppercase tracking-wider">Input</span>
        <span className="text-[#4a4d4e]">·</span>
        <span className="font-mono text-xs text-[#6b7280]">Drawing canvas</span>
      </div>
      <div
        ref={containerRef}
        className="relative aspect-square w-full max-w-[320px] mx-auto"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 rounded-xl cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-mono text-sm text-[#4a4d4e]">Draw a digit (0-9)</span>
          </div>
        )}
      </div>
    </div>
  )
}
