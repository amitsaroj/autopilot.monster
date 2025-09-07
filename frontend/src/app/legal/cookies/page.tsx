'use client'

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function CookiesRedirect() {
  useEffect(() => {
    // Redirect to main privacy page since cookies are covered there
    redirect('/privacy')
  }, [])

  return null
}
