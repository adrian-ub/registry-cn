import { defineConfig } from 'registry-cn'

const DEPENDENCIES_COMMON = [
  'tailwindcss-animate',
  'class-variance-authority',
  'lucide-react',
]

const REGISTRY_DEPENDENCIES_COMMON = [
  'utils',
]

const TAILWIND_CONFIG_COMMON = {
  config: {
    plugins: [
      'require("tailwindcss-animate")',
    ],
  },
}

export default defineConfig({
  styles: [
    {
      name: 'default',
      label: 'Default',
      type: 'registry:style',
      dependencies: [
        ...DEPENDENCIES_COMMON,
      ],
      registryDependencies: [
        ...REGISTRY_DEPENDENCIES_COMMON,
      ],
      tailwind: {
        ...TAILWIND_CONFIG_COMMON,
      },
    },
    {
      name: 'new-york',
      label: 'New York',
      type: 'registry:style',
      dependencies: [
        ...DEPENDENCIES_COMMON,
        '@radix-ui/react-icons',
      ],
      registryDependencies: [
        ...REGISTRY_DEPENDENCIES_COMMON,
      ],
      tailwind: {
        ...TAILWIND_CONFIG_COMMON,
      },
    },
  ],
})
