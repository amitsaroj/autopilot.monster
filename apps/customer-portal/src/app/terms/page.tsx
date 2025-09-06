import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

export const metadata = {
  title: 'Terms of Service - Autopilot.monster',
  description: 'Terms of Service for using Autopilot.monster AI agents and automation platform.',
}

export default function TermsPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-extrabold">Terms of Service</h1>
            <p className="text-lg" style={{ opacity: 0.8, marginTop: '12px' }}>
              Complete Terms of Service documentation coming soon.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
