import { Car, MapPin, Phone, Mail, Instagram } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer id="contato" className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Auto<span className="text-orange-400">Elite</span> Motors
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Sua concessionária de confiança. Os melhores carros e motos com as melhores condições do mercado.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navegação</h4>
            <div className="space-y-3">
              <Link href="/" className="block text-gray-400 text-sm hover:text-orange-400 transition">Início</Link>
              <Link href="/#estoque" className="block text-gray-400 text-sm hover:text-orange-400 transition">Estoque</Link>
              <Link href="/#sobre" className="block text-gray-400 text-sm hover:text-orange-400 transition">Sobre</Link>
              <Link href="/admin/login" className="block text-gray-400 text-sm hover:text-orange-400 transition">Área Admin</Link>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contato</h4>
            <div className="space-y-3">
              <p className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                Av. Principal, 1000 - Centro
              </p>
              <p className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                (11) 99999-9999
              </p>
              <p className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                contato@autoelite.com.br
              </p>
              <p className="flex items-center gap-3 text-gray-400 text-sm">
                <Instagram className="w-4 h-4 text-orange-400 shrink-0" />
                @autoelitemotors
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} AutoElite Motors. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
