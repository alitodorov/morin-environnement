import type { Adapter, GeneratedAdapter } from '@payloadcms/plugin-cloud-storage/types'
import { v2 as cloudinary } from 'cloudinary'

function getCloudinaryConfig() {
  return {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  }
}

export function cloudinaryAdapter(): Adapter {
  return ({ collection }): GeneratedAdapter => {
    return {
      name: 'cloudinary',

      handleUpload: async ({ file }) => {
        cloudinary.config(getCloudinaryConfig())

        const result = await new Promise<{ secure_url: string; public_id: string }>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: `morin/${collection.slug}`, resource_type: 'auto' },
              (error, result) => {
                if (error) reject(error)
                else resolve(result as { secure_url: string; public_id: string })
              },
            )
            uploadStream.end(file.buffer)
          },
        )

        return { url: result.secure_url, filename: file.filename }
      },

      handleDelete: async ({ filename }) => {
        cloudinary.config(getCloudinaryConfig())
        const publicId = `morin/${collection.slug}/${filename.replace(/\.[^/.]+$/, '')}`
        try {
          await cloudinary.uploader.destroy(publicId)
        } catch {
          // Ignore delete errors
        }
      },

      generateURL: ({ filename }) => {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME!
        return `https://res.cloudinary.com/${cloudName}/image/upload/morin/${collection.slug}/${filename}`
      },

      staticHandler: async (_req, { params }) => {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME!
        const url = `https://res.cloudinary.com/${cloudName}/image/upload/morin/${params.collection}/${params.filename}`
        const response = await fetch(url)
        return new Response(response.body, {
          status: response.status,
          headers: response.headers,
        })
      },
    }
  }
}
