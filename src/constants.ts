import type { CommonOptions, RegistryOptions } from './types'

export const DEFAULT_COMMON_OPTIONS: CommonOptions = {
  cwd: '',
  registry: 'registry',
  fileExtensions: ['ts', 'tsx'],
  output: 'dist',
  styles: [],
}

export const DEFAULT_OPTIONS: RegistryOptions = {
  ...DEFAULT_COMMON_OPTIONS,
}
