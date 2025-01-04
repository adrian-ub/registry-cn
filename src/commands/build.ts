import type { SourceFile, VariableDeclaration } from 'ts-morph'
import type { RegistryItem, RegistryOptions } from '../types'

import fs from 'node:fs'
import path from 'node:path'
import * as p from '@clack/prompts'
import { safeDestr } from 'destr'
import fg from 'fast-glob'
import JSON5 from 'json5'
import c from 'picocolors'
import { Project } from 'ts-morph'

import pkgJson from '../../package.json'

export async function build(options: RegistryOptions) {
  const registryDirectory = path.join(options.cwd!, options.registry!)
  const registryOutput = path.join(options.cwd!, options.output!)
  const registryOutputStyles = path.join(registryOutput, 'styles')

  const styles = options.styles
  const components: { [key: string]: RegistryItem[] } = {}

  const project = new Project()

  for (const style of styles) {
    createStyleDirectory(registryOutputStyles, style.name)
    p.log.info(`Building ${c.green(style.name)} style`)
    writeStyleIndexFile(registryOutputStyles, style)

    components[style.name] = processStyle(style.name, registryDirectory, options, project)
  }

  writeRegistryStyleIndexFile(registryOutputStyles, styles)
  writeRegistryIndexFile(registryOutput, components)

  Object.entries(components).forEach(([styleName, registryComponents]) => {
    registryComponents.forEach((component) => {
      writeRegistryFile(registryOutput, styleName, component.name, component)
    })
  })

  p.outro(c.green(`Build registry completed`))
}

function createStyleDirectory(registryOutputStyles: string, styleName: string) {
  const styleDirectory = path.join(registryOutputStyles, styleName)
  if (!fs.existsSync(styleDirectory)) {
    fs.mkdirSync(styleDirectory, { recursive: true })
  }
}

function writeStyleIndexFile(registryOutputStyles: string, style: any) {
  const styleIndexFile = path.join(registryOutputStyles, style.name, 'index.json')
  fs.writeFileSync(styleIndexFile, JSON.stringify(style, null, 2))
}

function writeRegistryStyleIndexFile(registryOutputStyles: string, styles: any[]) {
  const registryStyleIndex = styles.map(style => ({
    name: style.name,
    label: style.label || style.name,
  }))
  const registryStyleIndexContent = JSON.stringify(registryStyleIndex, null, 2)
  fs.writeFileSync(path.join(registryOutputStyles, 'index.json'), registryStyleIndexContent)
}

function writeRegistryIndexFile(registryOutput: string, arrayComponents: { [key: string]: RegistryItem[] }) {
  const registryComponentsByName = Object.values(arrayComponents).flat().reduce((acc: { [key: string]: RegistryItem }, component) => {
    acc[component.name] = component
    return acc
  }, {})

  const registryComponentsArray = Object.values(registryComponentsByName).map(component => ({
    ...component,
    files: component.files?.map(file => ({
      path: file.path,
      type: file.type,
    })),
  }))

  const registryUiFilter = registryComponentsArray.filter(component => component.type === 'registry:ui')
  const registryIndexContent = JSON.stringify(registryUiFilter, null, 2)
  fs.writeFileSync(path.join(registryOutput, 'index.json'), registryIndexContent)
}

function processStyle(style: string, registryDirectory: string, options: RegistryOptions, project: Project): RegistryItem[] {
  const registryDirectoryWithStyle = path.join(registryDirectory, style)
  const files = fg.sync(`**/*.{${options.fileExtensions!.join(',')}}`, { cwd: registryDirectoryWithStyle })
  const arrayComponents: RegistryItem[] = []

  for (const file of files) {
    const sourceFile = getSourceFile(project, registryDirectoryWithStyle, file)
    const metaRegistryVariable = getMetaRegistryVariable(sourceFile)

    if (!metaRegistryVariable) {
      continue
    }

    const metaRegistryValue = getMetaRegistryValue(metaRegistryVariable)

    if (!metaRegistryValue) {
      continue
    }

    updateMetaRegistryValue(metaRegistryValue, file, sourceFile)
    arrayComponents.push(metaRegistryValue)
  }

  return arrayComponents
}

function updateMetaRegistryValue(metaRegistryValue: RegistryItem, file: string, sourceFile: SourceFile) {
  const metaRegistryVariable = getMetaRegistryVariable(sourceFile)
  if (metaRegistryVariable) {
    removeMetaRegistryVariable(metaRegistryVariable)
  }
  removeRegistryImportDeclaration(sourceFile)

  const modifiedContent = sourceFile.getFullText()

  if (!metaRegistryValue.files?.length) {
    metaRegistryValue.files = [
      {
        path: file,
        content: modifiedContent,
        type: metaRegistryValue.type,
      },
    ]
  }
  else {
    metaRegistryValue.files.map((fileRegistry) => {
      if (fileRegistry.path === file) {
        fileRegistry.content = modifiedContent
      }
      return fileRegistry
    })
  }
}

function writeRegistryFile(registryOutput: string, style: string, fileName: string, metaRegistryValue: RegistryItem) {
  const registryStyleDirectory = path.join(registryOutput, 'styles', style)
  const registryFile = path.join(registryStyleDirectory, `${fileName}.json`)
  const registryContent = JSON.stringify(metaRegistryValue, null, 2)

  if (!fs.existsSync(registryStyleDirectory)) {
    fs.mkdirSync(registryStyleDirectory, { recursive: true })
  }

  fs.writeFileSync(registryFile, registryContent)
}

function getSourceFile(project: Project, registryDirectoryWithStyle: string, file: string): SourceFile {
  return project.addSourceFileAtPath(path.join(registryDirectoryWithStyle, file))
}

function getMetaRegistryValue(metaRegistryVariable: VariableDeclaration): RegistryItem | undefined {
  const initializer = metaRegistryVariable.getInitializer()

  if (!initializer) {
    return
  }

  const content = initializer.getText()
  const parsedContent = JSON5.parse(content)

  return safeDestr<RegistryItem>(parsedContent)
}

function removeMetaRegistryVariable(metaRegistryVariable: VariableDeclaration) {
  metaRegistryVariable.remove()
}

function removeRegistryImportDeclaration(sourceFile: SourceFile) {
  sourceFile.getImportDeclarations().forEach((importDeclaration) => {
    if (importDeclaration.getModuleSpecifierValue() === pkgJson.name) {
      importDeclaration.remove()
    }
  })
}

function getMetaRegistryVariable(sourceFile: SourceFile): VariableDeclaration | undefined {
  return sourceFile.getVariableDeclaration('metaRegistry')
}
