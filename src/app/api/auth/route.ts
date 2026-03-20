import { NextRequest, NextResponse } from 'next/server'
import { createToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@concessionaria.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  if (email === adminEmail && password === adminPassword) {
    const token = await createToken()
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })
    return response
  }

  return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('admin_token')
  return response
}
