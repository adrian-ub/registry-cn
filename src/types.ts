import * as v from 'valibot'
import { registrySchema } from './registry'

export const registryCnConfigSchema = v.object({
  root: v.optional(v.string(), '.'),
  outDir: v.optional(v.string(), './public/r'),
  clean: v.optional(v.boolean(), true),
  styles: v.array(registrySchema),
})

export type RegistryInput = v.InferInput<typeof registryCnConfigSchema>
export type RegistryOutput = v.InferOutput<typeof registryCnConfigSchema>
