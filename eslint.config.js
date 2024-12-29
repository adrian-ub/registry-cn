import adrianub from '@adrianub/eslint-config'

export default adrianub({
  type: 'lib',
  formatters: true,
  astro: true,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
})
