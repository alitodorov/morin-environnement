import { NextRequest, NextResponse } from 'next/server'

// GraphQL playground désactivé en production
export const GET = async (_req: NextRequest) => {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ errors: [{ message: 'Not found.' }] }, { status: 404 })
  }
  const config = (await import('@payload-config')).default
  const { GRAPHQL_PLAYGROUND_GET } = await import('@payloadcms/next/routes')
  return GRAPHQL_PLAYGROUND_GET(config)(_req)
}
