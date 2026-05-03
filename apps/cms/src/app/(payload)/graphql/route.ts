import { NextRequest, NextResponse } from 'next/server'

// GraphQL désactivé en production (surface d'attaque inutile)
export const POST = async (_req: NextRequest) => {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ errors: [{ message: 'GraphQL is disabled.' }] }, { status: 404 })
  }
  const config = (await import('@payload-config')).default
  const { GRAPHQL_POST } = await import('@payloadcms/next/routes')
  return GRAPHQL_POST(config)(_req)
}
