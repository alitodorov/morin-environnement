import type { CollectionConfig } from 'payload'

export const Sites: CollectionConfig = {
  slug: 'sites',
  admin: {
    useAsTitle: 'nom',
    description: 'Configuration des deux sites Morin Environnement',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'slug',
      type: 'select',
      required: true,
      // 'unique' non supporté nativement sur select en Payload 3 — unicité garantie par les 2 valeurs possibles
      options: [
        { label: "Berre-l'Étang", value: 'berre' },
        { label: 'Fos-sur-Mer', value: 'fos' },
      ],
    },
    { name: 'nom', type: 'text', required: true },
    { name: 'adresse', type: 'text', required: true },
    {
      name: 'telephones',
      type: 'array',
      fields: [{ name: 'numero', type: 'text', required: true }],
    },
    { name: 'email', type: 'email', required: true },
    {
      name: 'email_notifications',
      type: 'email',
      required: true,
      admin: { description: 'Email qui reçoit les notifications de formulaires' },
    },
    {
      name: 'horaires',
      type: 'group',
      fields: [
        { name: 'lundi_jeudi', type: 'text', admin: { description: 'Ex: 7h30–12h · 13h–15h30 · 16h30' } },
        { name: 'vendredi', type: 'text', admin: { description: 'Ex: 7h30–12h · 13h–15h30' } },
        { name: 'note', type: 'text', admin: { description: 'Fermetures exceptionnelles, horaires été...' } },
      ],
    },
    { name: 'maps_url', type: 'text', admin: { description: 'URL complète Google Maps embed' } },
  ],
}
