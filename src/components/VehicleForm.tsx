'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Vehicle, VehicleFormData, MARCAS_CARRO, MARCAS_MOTO, COMBUSTIVEIS, CAMBIOS } from '@/lib/types'
import { Upload, X, Instagram, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  vehicle?: Vehicle
}

export default function VehicleForm({ vehicle }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState<VehicleFormData>({
    tipo: vehicle?.tipo || 'carro',
    marca: vehicle?.marca || '',
    modelo: vehicle?.modelo || '',
    ano: vehicle?.ano || new Date().getFullYear(),
    preco: vehicle?.preco || 0,
    quilometragem: vehicle?.quilometragem || 0,
    combustivel: vehicle?.combustivel || 'Flex',
    cambio: vehicle?.cambio || 'Manual',
    cor: vehicle?.cor || '',
    descricao: vehicle?.descricao || '',
    fotos: vehicle?.fotos || [],
    status: vehicle?.status || 'disponivel',
    checklist: vehicle?.checklist || { lavagem_feita: false, revisao_realizada: false },
    destaque: vehicle?.destaque || false,
    publicado: vehicle?.publicado || false,
    postar_instagram: false,
  })

  const marcas = form.tipo === 'carro' ? MARCAS_CARRO : MARCAS_MOTO

  function updateField<K extends keyof VehicleFormData>(key: K, value: VehicleFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleUpload(files: FileList) {
    setUploading(true)
    const formData = new FormData()
    Array.from(files).forEach(file => formData.append('files', file))

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) {
        updateField('fotos', [...form.fotos, ...data.urls])
        toast.success(`${data.urls.length} foto(s) enviada(s)!`)
      } else {
        toast.error(data.error || 'Erro ao enviar fotos')
      }
    } catch {
      toast.error('Erro ao enviar fotos')
    }
    setUploading(false)
  }

  function removePhoto(index: number) {
    updateField('fotos', form.fotos.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const url = vehicle ? `/api/veiculos/${vehicle.id}` : '/api/veiculos'
      const method = vehicle ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Erro ao salvar')
        setSaving(false)
        return
      }

      // Postar no Instagram se marcado
      if (form.postar_instagram && form.fotos.length > 0) {
        const caption = `🚗 ${form.marca} ${form.modelo} ${form.ano}\n\n💰 R$ ${form.preco.toLocaleString('pt-BR')}\n📍 Venha conferir!\n\n#${form.marca.replace(/\s/g, '')} #${form.modelo.replace(/\s/g, '')} #concessionaria #autoelite`

        const igRes = await fetch('/api/instagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: form.fotos[0], caption }),
        })

        if (igRes.ok) {
          await fetch(`/api/veiculos/${data.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postado_instagram: true }),
          })
          toast.success('Publicado no Instagram!')
        } else {
          const igData = await igRes.json()
          toast.error(`Instagram: ${igData.error}`)
        }
      }

      toast.success(vehicle ? 'Veículo atualizado!' : 'Veículo cadastrado!')
      router.push('/admin')
    } catch {
      toast.error('Erro ao salvar veículo')
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Tipo */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Tipo de Veículo</h3>
        <div className="flex gap-4">
          {(['carro', 'moto'] as const).map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => { updateField('tipo', tipo); updateField('marca', '') }}
              className={`flex-1 py-4 rounded-xl font-medium text-sm transition border ${
                form.tipo === tipo
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
            >
              {tipo === 'carro' ? '🚗 Carro' : '🏍️ Moto'}
            </button>
          ))}
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Informações do Veículo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Marca *</label>
            <select
              value={form.marca}
              onChange={(e) => updateField('marca', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              required
            >
              <option value="">Selecione a marca</option>
              {marcas.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Modelo *</label>
            <input
              type="text"
              value={form.modelo}
              onChange={(e) => updateField('modelo', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              placeholder="Ex: Civic, Onix, CB 500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ano *</label>
            <input
              type="number"
              value={form.ano}
              onChange={(e) => updateField('ano', parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              min={1990}
              max={2027}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Preço (R$) *</label>
            <input
              type="number"
              value={form.preco}
              onChange={(e) => updateField('preco', parseFloat(e.target.value))}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              min={0}
              step={100}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Quilometragem</label>
            <input
              type="number"
              value={form.quilometragem}
              onChange={(e) => updateField('quilometragem', parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Cor</label>
            <input
              type="text"
              value={form.cor}
              onChange={(e) => updateField('cor', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              placeholder="Ex: Preto, Branco, Prata"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Combustível</label>
            <select
              value={form.combustivel}
              onChange={(e) => updateField('combustivel', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            >
              {COMBUSTIVEIS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Câmbio</label>
            <select
              value={form.cambio}
              onChange={(e) => updateField('cambio', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            >
              {CAMBIOS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
          <textarea
            value={form.descricao}
            onChange={(e) => updateField('descricao', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition resize-none"
            rows={4}
            placeholder="Descreva os detalhes do veículo..."
          />
        </div>
      </div>

      {/* Fotos */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Fotos</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {form.fotos.map((url, i) => (
            <div key={i} className="relative group aspect-square">
              <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover rounded-xl" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-orange-500 hover:text-orange-400 transition"
          >
            {uploading ? (
              <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full" />
            ) : (
              <>
                <Upload className="w-6 h-6 mb-2" />
                <span className="text-xs">Adicionar</span>
              </>
            )}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
          className="hidden"
        />

        {form.fotos.length === 0 && (
          <p className="text-gray-500 text-sm flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Nenhuma foto adicionada ainda
          </p>
        )}
      </div>

      {/* Checklist */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Checklist</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.checklist.lavagem_feita}
              onChange={(e) => updateField('checklist', { ...form.checklist, lavagem_feita: e.target.checked })}
              className="w-5 h-5 rounded-md bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-gray-300 group-hover:text-white transition">Lavagem Feita</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.checklist.revisao_realizada}
              onChange={(e) => updateField('checklist', { ...form.checklist, revisao_realizada: e.target.checked })}
              className="w-5 h-5 rounded-md bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-gray-300 group-hover:text-white transition">Revisão Realizada</span>
          </label>
        </div>
      </div>

      {/* Publicação */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Publicação</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.publicado}
              onChange={(e) => updateField('publicado', e.target.checked)}
              className="w-5 h-5 rounded-md bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-gray-300 group-hover:text-white transition">Publicar no site</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.destaque}
              onChange={(e) => updateField('destaque', e.target.checked)}
              className="w-5 h-5 rounded-md bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-gray-300 group-hover:text-white transition">Destacar na página inicial</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.postar_instagram}
              onChange={(e) => updateField('postar_instagram', e.target.checked)}
              className="w-5 h-5 rounded-md bg-gray-700 border-gray-600 text-pink-500 focus:ring-pink-500 focus:ring-offset-0 cursor-pointer"
            />
            <div className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-400" />
              <span className="text-gray-300 group-hover:text-white transition">Postar no Instagram</span>
            </div>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition disabled:opacity-50"
        >
          {saving ? 'Salvando...' : vehicle ? 'Atualizar Veículo' : 'Cadastrar Veículo'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
