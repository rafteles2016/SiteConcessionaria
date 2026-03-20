'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { Vehicle } from '@/lib/types'
import { ArrowLeft, Calendar, Fuel, Gauge, Palette, Settings, MessageCircle, ChevronLeft, ChevronRight, Share2 } from 'lucide-react'

export default function VehicleDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [activePhoto, setActivePhoto] = useState(0)

  useEffect(() => {
    fetch(`/api/veiculos/${id}`)
      .then(res => res.json())
      .then(data => {
        setVehicle(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Veículo não encontrado</h1>
        <button onClick={() => router.push('/')} className="text-orange-400 hover:underline">
          Voltar ao início
        </button>
      </div>
    )
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'
  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no ${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} - R$ ${vehicle.preco?.toLocaleString('pt-BR')}. Gostaria de mais informações!`
  )

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <WhatsAppButton />

      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Back */}
          <button
            onClick={() => router.push('/#estoque')}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao estoque
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gallery */}
            <div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-800 mb-4">
                {vehicle.fotos?.length > 0 ? (
                  <>
                    <img
                      src={vehicle.fotos[activePhoto]}
                      alt={`${vehicle.marca} ${vehicle.modelo}`}
                      className="w-full h-full object-cover"
                    />
                    {vehicle.fotos.length > 1 && (
                      <>
                        <button
                          onClick={() => setActivePhoto(prev => prev === 0 ? vehicle.fotos.length - 1 : prev - 1)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setActivePhoto(prev => prev === vehicle.fotos.length - 1 ? 0 : prev + 1)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                          {vehicle.fotos.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setActivePhoto(i)}
                              className={`w-2 h-2 rounded-full transition ${i === activePhoto ? 'bg-orange-500 w-6' : 'bg-white/50'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <p>Sem fotos disponíveis</p>
                  </div>
                )}

                {vehicle.status === 'vendido' && (
                  <div className="absolute top-4 left-4 px-4 py-2 bg-red-500 text-white font-bold rounded-full text-sm">
                    VENDIDO
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {vehicle.fotos?.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {vehicle.fotos.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhoto(i)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition ${
                        i === activePhoto ? 'border-orange-500' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-orange-500/10 text-orange-400 text-xs font-medium rounded-full capitalize">
                    {vehicle.tipo}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    vehicle.status === 'disponivel' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {vehicle.status === 'disponivel' ? 'Disponível' : 'Vendido'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">{vehicle.marca}</p>
                <h1 className="text-3xl md:text-4xl font-bold text-white mt-1">{vehicle.modelo}</h1>
              </div>

              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-6">
                <p className="text-sm text-gray-400 mb-1">Preço</p>
                <p className="text-3xl font-bold text-orange-400">
                  R$ {vehicle.preco?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <Calendar className="w-5 h-5 text-orange-400 mb-2" />
                  <p className="text-xs text-gray-400">Ano</p>
                  <p className="text-white font-semibold">{vehicle.ano}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <Gauge className="w-5 h-5 text-orange-400 mb-2" />
                  <p className="text-xs text-gray-400">Quilometragem</p>
                  <p className="text-white font-semibold">{vehicle.quilometragem?.toLocaleString('pt-BR')} km</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <Fuel className="w-5 h-5 text-orange-400 mb-2" />
                  <p className="text-xs text-gray-400">Combustível</p>
                  <p className="text-white font-semibold">{vehicle.combustivel}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <Settings className="w-5 h-5 text-orange-400 mb-2" />
                  <p className="text-xs text-gray-400">Câmbio</p>
                  <p className="text-white font-semibold">{vehicle.cambio}</p>
                </div>
                {vehicle.cor && (
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 col-span-2">
                    <Palette className="w-5 h-5 text-orange-400 mb-2" />
                    <p className="text-xs text-gray-400">Cor</p>
                    <p className="text-white font-semibold">{vehicle.cor}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {vehicle.descricao && (
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-6">
                  <h3 className="text-white font-semibold mb-3">Descrição</h3>
                  <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{vehicle.descricao}</p>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  Tenho Interesse
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-xl transition"
                >
                  <Share2 className="w-5 h-5" />
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
