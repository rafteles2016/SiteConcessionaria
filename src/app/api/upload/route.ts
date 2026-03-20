import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const formData = await request.formData()
  const files = formData.getAll('files') as File[]

  if (!files.length) {
    return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
  }

  const supabase = getServiceSupabase()
  const urls: string[] = []

  for (const file of files) {
    const ext = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error } = await supabase.storage
      .from('veiculos')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      return NextResponse.json({ error: `Erro ao enviar ${file.name}: ${error.message}` }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from('veiculos')
      .getPublicUrl(fileName)

    urls.push(urlData.publicUrl)
  }

  return NextResponse.json({ urls })
}
