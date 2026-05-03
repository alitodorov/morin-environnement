import path from 'path'
import { fileURLToPath } from 'url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Sites } from './collections/Sites'
import { Granulats } from './collections/Granulats'
import { Photos } from './collections/Photos'
import { CodesCED } from './collections/CodesCED'
import { Contacts } from './collections/Contacts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Sites, Granulats, Photos, CodesCED, Contacts],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? 'YOUR_SECRET_HERE',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? '',
    },
    push: true,
  }),
  // Plugin Cloudinary temporairement désactivé — à réactiver après stabilisation
  plugins: [],
  sharp,
  serverURL: process.env.SERVER_URL ?? 'http://localhost:3001',
})
