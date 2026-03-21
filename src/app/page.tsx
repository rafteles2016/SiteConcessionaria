'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import VehicleCard from '@/components/VehicleCard'
import WhatsAppButton from '@/components/WhatsAppButton'
import { Vehicle, MARCAS_CARRO, MARCAS_MOTO } from '@/lib/types'
import { Search, Car, Bike, Filter, X, Shield, Award, ThumbsUp, ChevronRight } from 'lucide-react'

export default function HomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState<string>('')
  const [filtroMarca, setFiltroMarca] = useState<string>('')
  const [filtroBusca, setFiltroBusca] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchVehicles()
  }, [filtroTipo, filtroMarca])

  async function fetchVehicles() {
    setLoading(true)
    const params = new URLSearchParams()
    if (filtroTipo) params.set('tipo', filtroTipo)
    if (filtroMarca) params.set('marca', filtroMarca)

    const res = await fetch(`/api/veiculos?${params}`)
    const data = await res.json()
    setVehicles(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const marcas = filtroTipo === 'moto' ? MARCAS_MOTO : filtroTipo === 'carro' ? MARCAS_CARRO : [...new Set([...MARCAS_CARRO, ...MARCAS_MOTO])].sort()

  const vehiclesFiltrados = vehicles.filter(v => {
    if (v.status === 'vendido') return false
    if (filtroBusca) {
      const busca = filtroBusca.toLowerCase()
      return (
        v.marca.toLowerCase().includes(busca) ||
        v.modelo.toLowerCase().includes(busca) ||
        v.descricao?.toLowerCase().includes(busca)
      )
    }
    return true
  })

  const destaques = vehicles.filter(v => v.destaque && v.status !== 'vendido')

  function clearFilters() {
    setFiltroTipo('')
    setFiltroMarca('')
    setFiltroBusca('')
  }

  const hasFilters = filtroTipo || filtroMarca || filtroBusca

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <WhatsAppButton />

      {/* Hero */}
      <section className="relative pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-medium mb-6">
              <Car className="w-4 h-4" />
              Carros e Motos Selecionados
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Encontre o veículo dos{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                seus sonhos
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Os melhores carros e motos com as melhores condições. Visite nossa loja e realize seu sonho!
            </p>

            {/* Search Bar */}
            <div className="flex items-center max-w-xl mx-auto bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
              <div className="flex-1 flex items-center px-5">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={filtroBusca}
                  onChange={(e) => setFiltroBusca(e.target.value)}
                  placeholder="Buscar por marca ou modelo..."
                  className="w-full px-3 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                />
              </div>
              <a
                href="#estoque"
                className="px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-medium transition flex items-center gap-2"
              >
                Buscar
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Destaques */}
      {destaques.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Destaques</h2>
              <p className="text-gray-400 text-sm mt-1">Veículos selecionados para você</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destaques.slice(0, 3).map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>
      )}

      {/* Diferenciais */}
      <section id="sobre" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center">
            <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-orange-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Garantia</h3>
            <p className="text-gray-400 text-sm">Todos os veículos com garantia e procedência verificada</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center">
            <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-7 h-7 text-orange-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Qualidade</h3>
            <p className="text-gray-400 text-sm">Veículos revisados e preparados com o mais alto padrão</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center">
            <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="w-7 h-7 text-orange-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Facilidade</h3>
            <p className="text-gray-400 text-sm">Financiamento facilitado e troca com avaliação justa</p>
          </div>
        </div>
      </section>

      {/* Estoque */}
      <section id="estoque" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Nosso Estoque</h2>
            <p className="text-gray-400 text-sm mt-1">{vehiclesFiltrados.length} veículo(s) encontrado(s)</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-300 hover:border-orange-500/50 transition"
          >
            <Filter className="w-4 h-4" />
            Filtros
            {hasFilters && (
              <span className="w-2 h-2 bg-orange-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Filtrar veículos</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="text-orange-400 text-sm hover:underline flex items-center gap-1">
                  <X className="w-3 h-3" />
                  Limpar filtros
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Tipo</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setFiltroTipo(''); setFiltroMarca('') }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition border ${
                      !filtroTipo ? 'bg-orange-500 border-orange-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-300'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => { setFiltroTipo('carro'); setFiltroMarca('') }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition border flex items-center justify-center gap-1.5 ${
                      filtroTipo === 'carro' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-300'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    Carros
                  </button>
                  <button
                    onClick={() => { setFiltroTipo('moto'); setFiltroMarca('') }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition border flex items-center justify-center gap-1.5 ${
                      filtroTipo === 'moto' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-300'
                    }`}
                  >
                    <Bike className="w-4 h-4" />
                    Motos
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Marca</label>
                <select
                  value={filtroMarca}
                  onChange={(e) => setFiltroMarca(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                >
                  <option value="">Todas as marcas</option>
                  {marcas.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Buscar</label>
                <input
                  type="text"
                  value={filtroBusca}
                  onChange={(e) => setFiltroBusca(e.target.value)}
                  placeholder="Modelo, marca..."
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* Vehicle Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-700" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-700 rounded w-1/3" />
                  <div className="h-5 bg-gray-700 rounded w-2/3" />
                  <div className="h-3 bg-gray-700 rounded w-1/2" />
                  <div className="h-6 bg-gray-700 rounded w-1/3 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : vehiclesFiltrados.length === 0 ? (
          <div className="text-center py-20">
            <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold text-lg mb-2">Nenhum veículo encontrado</h3>
            <p className="text-gray-400 text-sm">Tente alterar os filtros para ver mais resultados</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-4 text-orange-400 text-sm hover:underline">
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehiclesFiltrados.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
