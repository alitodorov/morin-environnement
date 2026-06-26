import { NextRequest, NextResponse } from 'next/server'

// Rate limiting en mémoire simple (reset au redémarrage — acceptable pour free tier)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const LIMIT = 5 // max soumissions par IP
const WINDOW_MS = 60 * 60 * 1000 // 1 heure

export function middleware(req: NextRequest) {
  // Protection page /stock — vérifier cookie Payload
  if (req.nextUrl.pathname.startsWith('/stock')) {
    const token =
      req.cookies.get('payload-token')?.value ??
      req.cookies.get('payload_token')?.value

    if (!token) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('redirect', '/stock')
      return NextResponse.redirect(loginUrl)
    }
  }

  // Appliquer uniquement sur la création de contacts
  if (req.nextUrl.pathname.startsWith('/api/contacts') && req.method === 'POST') {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown'

    const now = Date.now()
    const entry = rateLimitMap.get(ip)

    if (entry && now < entry.resetAt) {
      if (entry.count >= LIMIT) {
        return NextResponse.json(
          { errors: [{ message: 'Trop de tentatives. Réessayez dans une heure.' }] },
          {
            status: 429,
            headers: { 'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)) },
          },
        )
      }
      entry.count++
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/contacts', '/stock/:path*'],
}
