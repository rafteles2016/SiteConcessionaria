export type VehicleType = 'carro' | 'moto'

export type VehicleStatus = 'disponivel' | 'vendido' | 'reservado'

export interface VehicleChecklist {
  lavagem_feita: boolean
  revisao_realizada: boolean
}

export interface Vehicle {
  id: string
  tipo: VehicleType
  marca: string
  modelo: string
  ano: number
  preco: number
  quilometragem: number
  combustivel: string
  cambio: string
  cor: string
  descricao: string
  fotos: string[]
  status: VehicleStatus
  checklist: VehicleChecklist
  destaque: boolean
  publicado: boolean
  postado_instagram: boolean
  created_at: string
  updated_at: string
}

export interface VehicleFormData {
  tipo: VehicleType
  marca: string
  modelo: string
  ano: number
  preco: number
  quilometragem: number
  combustivel: string
  cambio: string
  cor: string
  descricao: string
  fotos: string[]
  status: VehicleStatus
  checklist: VehicleChecklist
  destaque: boolean
  publicado: boolean
  postar_instagram: boolean
}

export const MARCAS_CARRO = [
  'Chevrolet', 'Fiat', 'Ford', 'Honda', 'Hyundai', 'Jeep', 'Nissan',
  'Peugeot', 'Renault', 'Toyota', 'Volkswagen', 'BMW', 'Mercedes-Benz',
  'Audi', 'Mitsubishi', 'Kia', 'Citroën', 'Caoa Chery', 'BYD', 'GWM'
]

export const MARCAS_MOTO = [
  'Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'BMW', 'Ducati', 'Harley-Davidson',
  'Triumph', 'Royal Enfield', 'Dafra', 'Shineray'
]

export const COMBUSTIVEIS = ['Flex', 'Gasolina', 'Etanol', 'Diesel', 'Elétrico', 'Híbrido']

export const CAMBIOS = ['Manual', 'Automático', 'CVT', 'Automatizado']
