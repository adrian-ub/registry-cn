import type { RegistryItem } from 'registry-cn'
import { type ClassValue, clsx } from 'clsx'

import { twMerge } from 'tailwind-merge'

export const metaRegistry: RegistryItem = {
  name: 'utils',
  type: 'registry:lib',
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
