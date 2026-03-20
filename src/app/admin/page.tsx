'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminSidebar from '@/components/AdminSidebar'
import { Vehicle } from '@/lib/types'
import { Car, Bike, DollarSign, Package, Eye, Pencil, Trash2, CheckCircle, Instagram } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchVehicles()
  }, [])

  async function fetchVehicles() {
    const res = await fetch('/api/veiculos?admin=true')
    if (res.status === 401) {
      router.push('/admin/login')
      return
    }
    const data = await res.json()
    setVehicles(data)
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este veículo?')) return
    const res = await fetch(`/api/veiculos/${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Veículo excluído!')
      fetchVehicles()
    } else {
      toast.error('Erro ao excluir')
    }
  }

  async function handleToggleStatus(vehicle: Vehicle) {
    const newStatus = vehicle.status === 'vendido' ? 'disponivel' : 'vendido'
    const res = await fetch(`/api/veiculos/${vehicle.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      toast.success(newStatus === 'vendido' ? 'Marcado como vendido!' : 'Marcado como disponível!')
      fetchVehicles()
    }
  }

  async function handlePostInstagram(vehicle: Vehicle) {
    if (!vehicle.fotos?.length) {
      toast.error('Veículo precisa ter pelo menos uma foto')
      return
    }

    const caption = `🚗 ${vehicle.marca} ${vehicle.modelo} ${vehicle.ano}\n\n💰 R$ ${vehicle.preco.toLocaleString('pt-BR')}\n📍 Venha conferir!\n\n#${vehicle.marca.replace(/\s/g, '')} #${vehicle.modelo.replace(/\s/g, '')} #concessionaria #autoelite`

    const res = await fetch('/api/instagram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: vehicle.fotos[0], caption }),
    })

    const data = await res.json()
    if (res.ok) {
      await fetch(`/api/veiculos/${vehicle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postado_instagram: true }),
      })
      toast.success('Publicado no Instagram!')
      fetchVehicles()
    } else {
      toast.error(data.error || 'Erro ao publicar no Instagram')
    }
  }

  const stats = {
    total: vehicles.length,
    disponiveis: vehicles.filter(v => v.status === 'disponivel').length,
    vendidos: vehicles.filter(v => v.status === 'vendido').length,
    carros: vehicles.filter(v => v.tipo === 'carro').length,
    motos: vehicles.filter(v => v.tipo === 'moto').length,
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Toaster position="top-right" />
      <AdminSidebar />

      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Gerencie seus veículos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <Package className="w-5 h-5 text-orange-400" />
              <span className="text-2xl font-bold text-white">{stats.total}</span>
            </div>
            <p className="text-sm text-gray-400">Total</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <Eye className="w-5 h-5 text-green-400" />
              <span className="text-2xl font-bold text-white">{stats.disponiveis}</span>
            </div>
            <p className="text-sm text-gray-400">Disponíveis</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-bold text-white">{stats.vendidos}</span>
            </div>
            <p className="text-sm text-gray-400">Vendidos</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <Car className="w-5 h-5 text-purple-400" />
              <span className="text-2xl font-bold text-white">{stats.carros} / {stats.motos}</span>
            </div>
            <p className="text-sm text-gray-400">Carros / Motos</p>
          </div>
        </div>

        {/* Vehicle List */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <h2 className="font-semibold text-white">Veículos</h2>
            <Link
              href="/admin/veiculos/novo"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-xl transition"
            >
              + Novo Veículo
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400">Carregando...</div>
          ) : vehicles.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum veículo cadastrado</p>
              <Link href="/admin/veiculos/novo" className="text-orange-400 text-sm mt-2 inline-block hover:underline">
                Cadastrar primeiro veículo
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-700">
                    <th className="px-6 py-3">Veículo</th>
                    <th className="px-6 py-3 hidden md:table-cell">Ano</th>
                    <th className="px-6 py-3">Preço</th>
                    <th className="px-6 py-3 hidden lg:table-cell">Status</th>
                    <th className="px-6 py-3 hidden lg:table-cell">Checklist</th>
                    <th className="px-6 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {vehicle.fotos?.[0] ? (
                            <img
                              src={vehicle.fotos[0]}
                              alt={vehicle.modelo}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                              {vehicle.tipo === 'carro' ? (
                                <Car className="w-5 h-5 text-gray-500" />
                              ) : (
                                <Bike className="w-5 h-5 text-gray-500" />
                              )}
                            </div>
                          )}
                          <div>
                            <p className="text-white font-medium text-sm">{vehicle.marca} {vehicle.modelo}</p>
                            <p className="text-gray-400 text-xs capitalize">{vehicle.tipo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm hidden md:table-cell">{vehicle.ano}</td>
                      <td className="px-6 py-4 text-green-400 font-medium text-sm">
                        R$ {vehicle.preco?.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            vehicle.status === 'disponivel'
                              ? 'bg-green-500/10 text-green-400'
                              : vehicle.status === 'vendido'
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-yellow-500/10 text-yellow-400'
                          }`}
                        >
                          {vehicle.status === 'disponivel' ? 'Disponível' : vehicle.status === 'vendido' ? 'Vendido' : 'Reservado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex gap-2">
                          <span className={`text-xs ${vehicle.checklist?.lavagem_feita ? 'text-green-400' : 'text-gray-500'}`}>
                            Lavagem {vehicle.checklist?.lavagem_feita ? '✓' : '✗'}
                          </span>
                          <span className={`text-xs ${vehicle.checklist?.revisao_realizada ? 'text-green-400' : 'text-gray-500'}`}>
                            Revisão {vehicle.checklist?.revisao_realizada ? '✓' : '✗'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/veiculos/editar?id=${vehicle.id}`}
                            className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-white"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleToggleStatus(vehicle)}
                            className={`p-2 hover:bg-gray-700 rounded-lg transition ${
                              vehicle.status === 'vendido' ? 'text-red-400' : 'text-gray-400 hover:text-green-400'
                            }`}
                            title={vehicle.status === 'vendido' ? 'Marcar disponível' : 'Marcar vendido'}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePostInstagram(vehicle)}
                            className={`p-2 hover:bg-gray-700 rounded-lg transition ${
                              vehicle.postado_instagram ? 'text-pink-400' : 'text-gray-400 hover:text-pink-400'
                            }`}
                            title="Publicar no Instagram"
                          >
                            <Instagram className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(vehicle.id)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-red-400"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
