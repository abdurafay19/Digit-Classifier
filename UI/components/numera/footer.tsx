export function Footer() {
  return (
    <footer className="border-t border-[#2a2d2e] py-6">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="font-mono text-xs text-[#6b7280] flex items-center gap-2">
          <span>Numera</span>
          <span className="text-[#4a4d4e]">·</span>
          <span>PyTorch</span>
          <span className="text-[#4a4d4e]">·</span>
          <span>MNIST</span>
        </div>
        <div className="hidden sm:block font-mono text-xs text-[#6b7280]">
          Built with <span className="text-red-400">♥</span> by Abdul Rafay
        </div>
      </div>
    </footer>
  )
}
