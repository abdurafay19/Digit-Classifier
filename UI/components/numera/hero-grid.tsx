"use client"

import { useEffect, useState } from "react"

export function HeroGrid() {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const [activeIndices, setActiveIndices] = useState<number[]>([])

  useEffect(() => {
    const animate = () => {
      const count = Math.floor(Math.random() * 3) + 3 // 3-5 cells
      const indices: number[] = []
      while (indices.length < count) {
        const idx = Math.floor(Math.random() * 10)
        if (!indices.includes(idx)) {
          indices.push(idx)
        }
      }
      setActiveIndices(indices)
    }

    animate()
    const interval = setInterval(animate, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-5 gap-2 w-fit">
      {digits.map((digit, index) => (
        <div
          key={digit}
          className={`
            w-14 h-14 rounded-lg flex items-center justify-center
            font-serif text-2xl transition-all duration-500
            ${
              activeIndices.includes(index)
                ? "bg-[#a8f0a0]/20 text-[#a8f0a0] shadow-[0_0_20px_rgba(168,240,160,0.3)]"
                : "bg-[#111314] text-[#4a4d4e]"
            }
          `}
        >
          {digit}
        </div>
      ))}
    </div>
  )
}
