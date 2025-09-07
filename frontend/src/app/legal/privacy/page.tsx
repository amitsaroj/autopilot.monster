'use client'

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function LegalPrivacyRedirect() {
  useEffect(() => {
    // Redirect to main privacy page
    redirect('/privacy')
  }, [])

  return null
}
