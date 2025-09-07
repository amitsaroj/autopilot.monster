'use client'

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function ApiDocsRedirect() {
  useEffect(() => {
    // Redirect to the main API docs page
    redirect('/api-docs')
  }, [])

  return null
}
