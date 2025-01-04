import * as v from 'valibot'

export const registryItemTypeSchema = v.custom<`registry:${string}`>(input => typeof input === 'string' && /^registry:[a-z].*$/.test(input))

export const registryItemFileSchema = v.object({
  path: v.string(),
  content: v.optional(v.string()),
  type: registryItemTypeSchema,
  target: v.optional(v.string()),
})

export const registryItemTailwindSchema = v.object({
  config: v.object({
    content: v.optional(v.array(v.string())),
    theme: v.optional(v.record(v.string(), v.any())),
    plugins: v.optional(v.array(v.string())),
  }),
})

export const registryItemCssVarsSchema = v.object({
  light: v.optional(v.record(v.string(), v.string())),
  dark: v.optional(v.record(v.string(), v.string())),
})

export const registryItemSchema = v.object({
  name: v.string(),
  type: registryItemTypeSchema,
  description: v.optional(v.string()),
  dependencies: v.optional(v.array(v.string())),
  devDependencies: v.optional(v.array(v.string())),
  registryDependencies: v.optional(v.array(v.string())),
  files: v.optional(v.array(registryItemFileSchema)),
  tailwind: v.optional(registryItemTailwindSchema),
  cssVars: v.optional(registryItemCssVarsSchema),
  meta: v.optional(v.record(v.string(), v.any())),
  docs: v.optional(v.string()),
  categories: v.optional(v.array(v.string())),
})

export type RegistryItem = v.InferOutput<typeof registryItemSchema>
