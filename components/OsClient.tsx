'use client'

import { useEffect } from 'react'
import type { DeepLink } from '@/lib/deeplink'
import { initOS } from '@/lib/os'

export default function OsClient({ deepLink }: { deepLink?: DeepLink }) {
  useEffect(() => {
    initOS({ deepLink })
  }, [deepLink])
  return null
}
