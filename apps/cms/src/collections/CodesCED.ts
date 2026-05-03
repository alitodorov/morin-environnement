import type { CollectionConfig } from 'payload'

export const CodesCED: CollectionConfig = {
  slug: 'codes-ced',
  admin: { useAsTitle: 'code', description: 'Codes européens des déchets acceptés' },
  access: { read: () => true },
  fields: [
    { name: 'site', type: 'relationship', relationTo: 'sites', required: true },
    { name: 'code', type: 'text', required: true, admin: { description: 'Ex: 17 01 01' } },
    { name: 'libelle', type: 'text', required: true },
    { name: 'conditions', type: 'text' },
    { name: 'analyses_requises', type: 'checkbox', defaultValue: false },
    {
      name: 'detail_analyses',
      type: 'textarea',
      admin: { condition: (data) => Boolean(data?.analyses_requises) },
    },
  ],
}
