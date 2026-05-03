'use server'

import config from '@payload-config'
import { handleServerFunctions } from '@payloadcms/next/layouts'
import { importMap } from '../admin/importMap'

export const serverFunctions = async (args: Parameters<typeof handleServerFunctions>[0]) => {
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}
