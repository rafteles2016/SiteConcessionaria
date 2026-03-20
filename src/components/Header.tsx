'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Car, Menu, X, Phone } from 'lucide-react'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white hidden sm:block">
              Auto<span className="text-orange-400">Elite</span> Motors
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-gray-300 hover:text-white transition">
              Início
            </Link>
            <Link href="/#estoque" className="text-sm text-gray-300 hover:text-white transition">
              Estoque
            </Link>
            <Link href="/#sobre" className="text-sm text-gray-300 hover:text-white transition">
              Sobre
            </Link>
            <Link href="/#contato" className="text-sm text-gray-300 hover:text-white transition">
              Contato
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition"
            >
              <Phone className="w-4 h-4" />
              Contato
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-4 py-4 space-y-2">
            <Link href="/" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition">
              Início
            </Link>
            <Link href="/#estoque" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition">
              Estoque
            </Link>
            <Link href="/#sobre" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition">
              Sobre
            </Link>
            <Link href="/#contato" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition">
              Contato
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
