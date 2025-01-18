import process from 'node:process'

import * as p from '@clack/prompts'
import { createConfigLoader } from 'unconfig'
import * as v from 'valibot'
import { registryCnConfigSchema, type RegistryOutput } from './types'

export async function resolveConfig(options: { cwd?: string }): Promise<RegistryOutput> {
  const loader = createConfigLoader<RegistryOutput>({
    sources: [
      {
        files: ['registry.config'],
      },
    ],
    cwd: options.cwd || process.cwd(),
    merge: false,
  })

  const config = await loader.load()

  if (!config.sources.length) {
    p.log.error('No config file found')
    process.exit(1)
  }

  const result = v.safeParse(registryCnConfigSchema, config.config)

  if (!result.success) {
    p.log.error(`Invalid registry configuration: ${result.issues.join(', ')}`)
    process.exit(1)
  }

  return result.output
}
