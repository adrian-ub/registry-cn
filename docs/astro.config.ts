import starlight from '@astrojs/starlight'

import { defineConfig } from 'astro/config'
import starlightThemeBlack from 'starlight-theme-black'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Registry cn',
      plugins: [starlightThemeBlack()],
      sidebar: [
        {
          label: 'Start Here',
          items: [
            { slug: 'docs' },
          ],
        },
      ],
    }),
  ],
})
