'use client'

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function LegalTermsRedirect() {
  useEffect(() => {
    // Redirect to main terms page
    redirect('/terms')
  }, [])

  return null
}
