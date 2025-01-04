import type { CommonOptions } from './types'

import process from 'node:process'
import deepmerge from 'deepmerge'
import { createConfigLoader } from 'unconfig'

import { DEFAULT_OPTIONS } from './constants'

export async function resolveConfig<T extends CommonOptions>(options: T & { _?: (string | number)[] }): Promise<T> {
  const defaults = DEFAULT_OPTIONS
  const loader = createConfigLoader<CommonOptions>({
    sources: [
      {
        files: ['registry.config'],
      },
    ],
    cwd: options.cwd || process.cwd(),
    merge: false,
  })

  const config = await loader.load()

  if (!config.sources.length)
    return deepmerge(defaults, options as T) as T

  return deepmerge(deepmerge(defaults, config.config), options as T) as T
}
