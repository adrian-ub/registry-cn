import type { RegistryItem } from './schemas'

export type { RegistryItem } from './schemas'

export interface CommonOptions {
  cwd?: string
  registry?: string
  fileExtensions?: string[]
  output?: string
  styles: RegistryItem[]
}

export interface RegistryOptions extends CommonOptions {

}
