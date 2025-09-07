'use client'

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function GDPRRedirect() {
  useEffect(() => {
    // Redirect to main privacy page since GDPR is covered there
    redirect('/privacy')
  }, [])

  return null
}
