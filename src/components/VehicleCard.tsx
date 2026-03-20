'use client'

import Link from 'next/link'
import { Vehicle } from '@/lib/types'
import { Calendar, Fuel, Gauge, Car, Bike } from 'lucide-react'

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      href={`/veiculo/${vehicle.id}`}
      className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/5"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {vehicle.fotos?.[0] ? (
          <img
            src={vehicle.fotos[0]}
            alt={`${vehicle.marca} ${vehicle.modelo}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            {vehicle.tipo === 'carro' ? (
              <Car className="w-16 h-16 text-gray-600" />
            ) : (
              <Bike className="w-16 h-16 text-gray-600" />
            )}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {vehicle.destaque && (
            <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
              DESTAQUE
            </span>
          )}
          {vehicle.status === 'vendido' && (
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              VENDIDO
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-gray-900/80 backdrop-blur text-white text-xs font-medium rounded-full capitalize">
            {vehicle.tipo}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{vehicle.marca}</p>
          <h3 className="text-white font-bold text-lg mt-1 group-hover:text-orange-400 transition">
            {vehicle.modelo}
          </h3>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <span className="flex items-center gap-1.5 text-gray-400 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            {vehicle.ano}
          </span>
          {vehicle.quilometragem > 0 && (
            <span className="flex items-center gap-1.5 text-gray-400 text-xs">
              <Gauge className="w-3.5 h-3.5" />
              {vehicle.quilometragem.toLocaleString('pt-BR')} km
            </span>
          )}
          {vehicle.combustivel && (
            <span className="flex items-center gap-1.5 text-gray-400 text-xs">
              <Fuel className="w-3.5 h-3.5" />
              {vehicle.combustivel}
            </span>
          )}
        </div>

        <div className="pt-3 border-t border-gray-700">
          <p className="text-orange-400 font-bold text-xl">
            R$ {vehicle.preco?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </Link>
  )
}
