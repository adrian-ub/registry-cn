import starlight from '@astrojs/starlight'

import { defineConfig } from 'astro/config'
import starlightThemeBlack from 'starlight-theme-black'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Registry cn',
      plugins: [
        starlightThemeBlack({
          navLinks: [
            {
              text: 'Docs',
              slug: '/docs',
            },
          ],
        }),
      ],
      sidebar: [
        {
          label: 'Start Here',
          items: [
            { slug: 'docs' },
          ],
        },
      ],
      social: {
        github: 'https://github.com/adrian-ub/registry-cn',
      },
    }),
  ],
})
