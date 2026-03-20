import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'

// GET - listar veículos (público: só publicados, admin: todos)
export async function GET(request: NextRequest) {
  const supabase = getServiceSupabase()
  const { searchParams } = new URL(request.url)

  const admin = searchParams.get('admin') === 'true'
  const tipo = searchParams.get('tipo')
  const marca = searchParams.get('marca')
  const modelo = searchParams.get('modelo')
  const status = searchParams.get('status')

  let query = supabase.from('vehicles').select('*')

  if (admin) {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
  } else {
    query = query.eq('publicado', true)
  }

  if (tipo) query = query.eq('tipo', tipo)
  if (marca) query = query.eq('marca', marca)
  if (modelo) query = query.ilike('modelo', `%${modelo}%`)
  if (status) query = query.eq('status', status)

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST - criar veículo
export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const supabase = getServiceSupabase()
  const body = await request.json()

  const { data, error } = await supabase
    .from('vehicles')
    .insert([{
      tipo: body.tipo,
      marca: body.marca,
      modelo: body.modelo,
      ano: body.ano,
      preco: body.preco,
      quilometragem: body.quilometragem,
      combustivel: body.combustivel,
      cambio: body.cambio,
      cor: body.cor,
      descricao: body.descricao,
      fotos: body.fotos || [],
      status: body.status || 'disponivel',
      checklist: body.checklist || { lavagem_feita: false, revisao_realizada: false },
      destaque: body.destaque || false,
      publicado: body.publicado || false,
      postado_instagram: false,
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
