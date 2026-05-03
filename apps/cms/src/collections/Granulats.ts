import type { CollectionConfig } from 'payload'

export const Granulats: CollectionConfig = {
  slug: 'granulats',
  admin: { useAsTitle: 'nom', description: 'Catalogue des granulats recyclés et naturels' },
  access: { read: () => true },
  fields: [
    { name: 'site', type: 'relationship', relationTo: 'sites', required: true },
    { name: 'reference', type: 'text', required: true, admin: { description: 'Ex: GR-04' } },
    { name: 'nom', type: 'text', required: true },
    { name: 'calibre', type: 'text', required: true, admin: { description: 'Ex: 0/4 mm' } },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Recyclé', value: 'recycle' },
        { label: 'Naturel', value: 'naturel' },
      ],
    },
    { name: 'usage', type: 'text', required: true },
    { name: 'note_commerciale', type: 'textarea' },
    {
      name: 'statut',
      type: 'select',
      required: true,
      defaultValue: 'en_stock',
      options: [
        { label: 'En stock', value: 'en_stock' },
        { label: 'Quantité limitée', value: 'quantite_limitee' },
        { label: 'Rupture', value: 'rupture' },
      ],
    },
    { name: 'disponibilite_sur_demande', type: 'checkbox', defaultValue: false },
  ],
}
