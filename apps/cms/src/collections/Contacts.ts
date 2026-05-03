import type { CollectionConfig } from 'payload'

export const Contacts: CollectionConfig = {
  slug: 'contacts',
  admin: {
    useAsTitle: 'nom',
    description: 'Formulaires de contact reçus',
    defaultColumns: ['nom', 'societe', 'site', 'type_besoin', 'statut', 'createdAt'],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === 'create') {
          // Bloquer les bots qui remplissent le honeypot
          if (data.website) {
            throw new Error('Bot detected')
          }
          // Capturer l'IP réelle (Railway passe via x-forwarded-for)
          const ip =
            req.headers?.get?.('x-forwarded-for')?.split(',')[0]?.trim() ??
            req.headers?.get?.('x-real-ip') ??
            'unknown'
          return { ...data, ip }
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'site', type: 'relationship', relationTo: 'sites', required: true },
    { name: 'nom', type: 'text', required: true },
    { name: 'societe', type: 'text' },
    { name: 'telephone', type: 'text' },
    {
      name: 'email',
      type: 'email',
      admin: { description: "Email de l'expéditeur (optionnel)" },
    },
    {
      name: 'type_besoin',
      type: 'select',
      required: true,
      options: [
        { label: 'Devis granulats recyclés', value: 'devis-granulats' },
        { label: 'Transport et logistique', value: 'transport' },
        { label: 'Renseignement général', value: 'information' },
        { label: 'Autre', value: 'autre' },
      ],
    },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'statut',
      type: 'select',
      defaultValue: 'en_attente',
      options: [
        { label: '⏳ En attente', value: 'en_attente' },
        { label: '✅ Traité', value: 'traite' },
      ],
    },
    // Honeypot — jamais visible par l'humain
    {
      name: 'website',
      type: 'text',
      admin: { hidden: true },
      access: {
        read: () => false,
        create: () => true, // le client peut l'envoyer (pour qu'on puisse le détecter)
        update: () => false,
      },
    },
    // IP capturée server-side uniquement
    {
      name: 'ip',
      type: 'text',
      admin: { hidden: true },
      access: {
        read: ({ req }) => Boolean(req.user),
        create: () => false, // jamais settable par le client
        update: () => false,
      },
    },
  ],
  timestamps: true,
}
