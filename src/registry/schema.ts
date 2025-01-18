import * as v from 'valibot'

export const registryItemTypeSchema = v.picklist([
  'registry:lib',
  'registry:block',
  'registry:component',
  'registry:ui',
  'registry:hook',
  'registry:page',
  'registry:file',

  // Internal use only
  'registry:theme',
  'registry:example',
  'registry:style',
  'registry:internal',
])

export const registryItemFileSchema = v.variant('type', [
  v.object({
    path: v.string(),
    content: v.optional(v.string()),
    type: v.picklist(['registry:file', 'registry:page']),
    target: v.string(),
  }),
  v.object({
    path: v.string(),
    content: v.optional(v.string()),
    type: v.pipe(
      registryItemTypeSchema,
      v.excludes('registry:file'),
      v.excludes('registry:page'),
    ),
    target: v.optional(v.string()),
  }),
])

export const registryItemTailwindSchema = v.object({
  config: v.optional(
    v.object({
      content: v.optional(v.array(v.string())),
      theme: v.optional(v.record(v.string(), v.any())),
      plugins: v.optional(v.array(v.string())),
    }),
  ),
})

export const registryItemCssVarsSchema = v.object({
  light: v.optional(v.record(v.string(), v.string())),
  dark: v.optional(v.record(v.string(), v.string())),
})

export const registryItemSchema = v.object({
  $schema: v.optional(v.string()),
  name: v.string(),
  type: registryItemTypeSchema,
  title: v.optional(v.string()),
  author: v.optional(v.string()),
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

export const registrySchema = v.object({
  name: v.string(),
  label: v.string(),
  homepage: v.string(),
  items: v.array(registryItemSchema),
  dependencies: v.optional(v.array(v.string())),
  devDependencies: v.optional(v.array(v.string())),
  registryDependencies: v.optional(v.array(v.string())),
  tailwind: v.optional(registryItemTailwindSchema),
  cssVars: v.optional(registryItemCssVarsSchema),
})

export type Registry = v.InferOutput<typeof registrySchema>

export const registryIndexSchema = v.array(registryItemSchema)

export const stylesSchema = v.array(
  v.object({
    name: v.string(),
    label: v.string(),
  }),
)

export const iconsSchema = v.record(
  v.string(),
  v.record(v.string(), v.string()),
)

export const registryBaseColorSchema = v.object({
  inlineColors: v.object({
    light: v.record(v.string(), v.string()),
    dark: v.record(v.string(), v.string()),
  }),
  cssVars: v.object({
    light: v.record(v.string(), v.string()),
    dark: v.record(v.string(), v.string()),
  }),
  inlineColorsTemplate: v.string(),
  cssVarsTemplate: v.string(),
})

export const registryResolvedItemsTreeSchema = v.pick(registryItemSchema, [
  'dependencies',
  'devDependencies',
  'files',
  'tailwind',
  'cssVars',
  'docs',
])
