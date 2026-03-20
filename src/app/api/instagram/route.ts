import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'

// POST - publicar no Instagram
export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { imageUrl, caption } = await request.json()

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID

  if (!accessToken || !accountId) {
    return NextResponse.json(
      { error: 'Instagram não configurado. Configure INSTAGRAM_ACCESS_TOKEN e INSTAGRAM_BUSINESS_ACCOUNT_ID no .env.local' },
      { status: 400 }
    )
  }

  try {
    // Step 1: Criar container de mídia
    const createResponse = await fetch(
      `https://graph.facebook.com/v18.0/${accountId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: caption,
          access_token: accessToken,
        }),
      }
    )

    const createData = await createResponse.json()

    if (createData.error) {
      return NextResponse.json(
        { error: `Erro Instagram: ${createData.error.message}` },
        { status: 400 }
      )
    }

    // Step 2: Publicar o container
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${accountId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: createData.id,
          access_token: accessToken,
        }),
      }
    )

    const publishData = await publishResponse.json()

    if (publishData.error) {
      return NextResponse.json(
        { error: `Erro ao publicar: ${publishData.error.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, id: publishData.id })
  } catch (error) {
    return NextResponse.json(
      { error: `Erro de conexão: ${error instanceof Error ? error.message : 'Desconhecido'}` },
      { status: 500 }
    )
  }
}
