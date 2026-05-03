import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  description: 'Morin Environnement CMS',
  title: 'Morin CMS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
