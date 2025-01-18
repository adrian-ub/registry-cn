import type { RegistryOutput } from '../types'

import fs from 'node:fs'
import path from 'node:path'

import process from 'node:process'
import * as p from '@clack/prompts'

import c from 'picocolors'
import * as v from 'valibot'

import { registryItemSchema, registrySchema } from '../registry'

export async function build(config: RegistryOutput) {
  if (config.clean) {
    fs.rmSync(config.outDir, { recursive: true, force: true })
  }

  buildStyles(config)
  buildIndexJson(config)
}

function buildStyles(config: RegistryOutput) {
  for (const style of config.styles) {
    const result = v.safeParse(registrySchema, style)

    if (!result.success) {
      p.log.error(`Invalid registry configuration: ${result.issues.join(', ')}`)
      process.exit(1)
    }

    const buildSpinner = p.spinner()
    buildSpinner.start(`Building ${c.bold(style.name)} registry`)

    for (const registryItem of result.output.items) {
      if (!registryItem.files?.length) {
        continue
      }

      buildSpinner.message(`Building ${c.bold(registryItem.name)} registry item`)

      for (const file of registryItem.files) {
        file.content = fs.readFileSync(
          path.resolve(config.root, style.name, file.path),
          'utf-8',
        )
      }

      const result = v.safeParse(registryItemSchema, registryItem)

      if (!result.success) {
        p.log.error(
          `Invalid registry item found for ${c.blue(registryItem.name)}.`,
        )

        continue
      }

      const outputFile = path.resolve(config.outDir, 'styles', style.name, `${result.output.name}.json`)

      fs.mkdirSync(path.dirname(outputFile), { recursive: true })

      fs.writeFileSync(
        outputFile,
        JSON.stringify(result.output, null, 2),
      )
    }

    fs.writeFileSync(
      path.resolve(config.outDir, 'styles', style.name, 'index.json'),
      JSON.stringify({ ...result.output, items: undefined }, null, 2),
    )

    buildSpinner.stop(`Building ${c.bold(style.name)} registry`)
  }

  const styles = config.styles.map(({ name, label }) => ({ name, label }))
  fs.writeFileSync(
    path.resolve(config.outDir, 'styles', 'index.json'),
    JSON.stringify(styles, null, 2),
  )
}

function buildIndexJson(config: RegistryOutput) {
  const mergedItems = new Map<string, any>()

  config.styles.forEach((style) => {
    style.items.forEach((item) => {
      if (!mergedItems.has(item.name)) {
        mergedItems.set(item.name, item)
      }
    })
  })

  const itemsArray = Array.from(mergedItems.values())

  fs.writeFileSync(
    path.resolve(config.outDir, 'index.json'),
    JSON.stringify(itemsArray, null, 2),
  )
}
