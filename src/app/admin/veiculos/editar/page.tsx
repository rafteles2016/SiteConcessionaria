'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import VehicleForm from '@/components/VehicleForm'
import { Vehicle } from '@/lib/types'
import { Toaster } from 'react-hot-toast'

function EditarVeiculoContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id')
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      router.push('/admin')
      return
    }
    fetch(`/api/veiculos/${id}`)
      .then(res => res.json())
      .then(data => {
        setVehicle(data)
        setLoading(false)
      })
      .catch(() => {
        router.push('/admin')
      })
  }, [id, router])

  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-gray-400">Carregando...</div>
  }

  if (!vehicle) {
    return <div className="flex-1 flex items-center justify-center text-gray-400">Veículo não encontrado</div>
  }

  return (
    <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-white mb-2">Editar Veículo</h1>
        <p className="text-gray-400 text-sm mb-8">{vehicle.marca} {vehicle.modelo} {vehicle.ano}</p>
        <VehicleForm vehicle={vehicle} />
      </div>
    </main>
  )
}

export default function EditarVeiculoPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Toaster position="top-right" />
      <AdminSidebar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-gray-400">Carregando...</div>}>
        <EditarVeiculoContent />
      </Suspense>
    </div>
  )
}
