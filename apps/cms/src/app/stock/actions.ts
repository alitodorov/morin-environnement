'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

type Statut = 'en_stock' | 'quantite_limitee' | 'rupture'

export async function updateStatut(id: number, statut: Statut) {
  const payload = await getPayload({ config })

  // Re-vérifier l'auth côté serveur avant toute modification
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) throw new Error('Non autorisé')

  await payload.update({
    collection: 'granulats',
    id,
    data: { statut },
    user,
  })

  revalidatePath('/stock')
}
