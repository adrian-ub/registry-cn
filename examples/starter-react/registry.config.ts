import { defineConfig } from 'registry-cn'

export default defineConfig({
  root: 'registry',
  outDir: 'dist/r',
  styles: [
    {
      name: 'new-york',
      label: 'New York',
      homepage: 'https://registry-cn.vercel.app',
      dependencies: [
        'tailwindcss-animate',
        'class-variance-authority',
        'lucide-react',
        '@radix-ui/react-icons',
      ],
      registryDependencies: [
        'utils',
      ],
      tailwind: {
        config: {
          plugins: [
            'require("tailwindcss-animate")',
          ],
        },
      },
      items: [
        {
          name: 'utils',
          type: 'registry:lib',
          files: [
            {
              path: 'lib/utils.ts',
              type: 'registry:lib',
            },
          ],
        },
        {
          name: 'accordion',
          type: 'registry:ui',
          files: [
            {
              path: 'ui/accordion.tsx',
              type: 'registry:ui',
            },
          ],
          dependencies: [
            '@radix-ui/react-accordion',
          ],
          tailwind: {
            config: {
              theme: {
                extend: {
                  keyframes: {
                    'accordion-down': {
                      from: {
                        height: '0',
                      },
                      to: {
                        height: 'var(--radix-accordion-content-height)',
                      },
                    },
                    'accordion-up': {
                      from: {
                        height: 'var(--radix-accordion-content-height)',
                      },
                      to: {
                        height: '0',
                      },
                    },
                  },
                  animation: {
                    'accordion-down': 'accordion-down 0.2s ease-out',
                    'accordion-up': 'accordion-up 0.2s ease-out',
                  },
                },
              },
            },
          },
        },
      ],
    },
    {
      name: 'default',
      label: 'Default',
      homepage: 'https://registry-cn.vercel.app',
      dependencies: [
        'tailwindcss-animate',
        'class-variance-authority',
        'lucide-react',
      ],
      registryDependencies: [
        'utils',
      ],
      tailwind: {
        config: {
          plugins: [
            'require("tailwindcss-animate")',
          ],
        },
      },
      items: [
        {
          name: 'utils',
          type: 'registry:lib',
          files: [
            {
              path: 'lib/utils.ts',
              type: 'registry:lib',
            },
          ],
        },
        {
          name: 'accordion',
          type: 'registry:ui',
          files: [
            {
              path: 'ui/accordion.tsx',
              type: 'registry:ui',
            },
          ],
          dependencies: [
            '@radix-ui/react-accordion',
          ],
          tailwind: {
            config: {
              theme: {
                extend: {
                  keyframes: {
                    'accordion-down': {
                      from: {
                        height: '0',
                      },
                      to: {
                        height: 'var(--radix-accordion-content-height)',
                      },
                    },
                    'accordion-up': {
                      from: {
                        height: 'var(--radix-accordion-content-height)',
                      },
                      to: {
                        height: '0',
                      },
                    },
                  },
                  animation: {
                    'accordion-down': 'accordion-down 0.2s ease-out',
                    'accordion-up': 'accordion-up 0.2s ease-out',
                  },
                },
              },
            },
          },
        },
      ],
    },
  ],
})
