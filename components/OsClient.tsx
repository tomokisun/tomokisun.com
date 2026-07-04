'use client'

import { useEffect } from 'react'
import { initOS } from '@/lib/os'

export default function OsClient() {
  useEffect(() => {
    initOS()
  }, [])
  return null
}
