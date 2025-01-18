import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'picocolors'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import pkgJson from '../package.json'
import { build } from './commands/build'
import { resolveConfig } from './config'

function header(): void {
  console.log('\n')
  p.intro(`${c.green(`${pkgJson.name} `)}${c.dim(`v${pkgJson.version}`)}`)
}

const cli = yargs(hideBin(process.argv))
  .scriptName(pkgJson.name)
  .usage('')
  .version(pkgJson.version)
  .strict()
  .showHelpOnFail(false)
  .alias('h', 'help')
  .alias('v', 'version')

cli.command(
  '*',
  'Build',
  args => args
    .option('cwd', {
      alias: 'c',
      type: 'string',
    })
    .help(),
  async (options) => {
    header()
    try {
      await build(await resolveConfig(options))
    }
    catch (error) {
      p.log.error(c.inverse(c.red(' Failed to build registry ')))
      p.log.error(c.red(`✘ ${String(error)}`))
      process.exit(1)
    }
  },
)

cli
  .help()
  .parse()
