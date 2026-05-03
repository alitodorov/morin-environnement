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
  fields: [
    { name: 'site', type: 'relationship', relationTo: 'sites', required: true },
    { name: 'nom', type: 'text', required: true },
    { name: 'societe', type: 'text' },
    { name: 'telephone', type: 'text' },
    { name: 'email', type: 'email', admin: { description: "Email de l'expéditeur (optionnel)" } },
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
    { name: 'ip', type: 'text', admin: { hidden: true } },
  ],
  timestamps: true,
}
