import type { CollectionConfig } from 'payload'

export const Photos: CollectionConfig = {
  slug: 'photos',
  admin: { useAsTitle: 'legende', description: 'Galerie photos des sites' },
  access: { read: () => true },
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  }, // Cloudinary adapter configuré dans payload.config.ts
  fields: [
    { name: 'site', type: 'relationship', relationTo: 'sites', required: true },
    { name: 'legende', type: 'text' },
    {
      name: 'ordre',
      type: 'number',
      defaultValue: 0,
      admin: { description: "Ordre d'affichage (0 = premier)" },
    },
    {
      name: 'section',
      type: 'select',
      required: true,
      options: [
        { label: 'Hero (image principale)', value: 'hero' },
        { label: 'Galerie', value: 'galerie' },
        { label: 'Services', value: 'services' },
      ],
    },
  ],
}
