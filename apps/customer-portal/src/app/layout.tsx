import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/main.scss'
import { Providers } from './providers'
import { AIBackground } from '@/components/animations/AIBackground'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Autopilot.monster - AI Agents & Automation Marketplace',
  description: 'Discover, purchase, and deploy AI agents and automation workflows from the world\'s most innovative creators.',
  keywords: ['AI agents', 'automation', 'n8n workflows', 'marketplace', 'artificial intelligence'],
  authors: [{ name: 'Autopilot.monster Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Autopilot.monster - Your Monster of Automation',
    description: 'The ultimate marketplace for AI agents and automation workflows',
    type: 'website',
    locale: 'en_US',
    siteName: 'Autopilot.monster',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Autopilot.monster - AI Agents & Automation Marketplace',
    description: 'Discover, purchase, and deploy AI agents and automation workflows',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <Providers>
          <AIBackground />
          <div className="relative z-10">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}