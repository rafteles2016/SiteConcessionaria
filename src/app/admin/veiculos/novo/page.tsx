'use client'

import AdminSidebar from '@/components/AdminSidebar'
import VehicleForm from '@/components/VehicleForm'
import { Toaster } from 'react-hot-toast'

export default function NovoVeiculoPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Toaster position="top-right" />
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold text-white mb-2">Novo Veículo</h1>
          <p className="text-gray-400 text-sm mb-8">Cadastre um novo veículo no sistema</p>
          <VehicleForm />
        </div>
      </main>
    </div>
  )
}
