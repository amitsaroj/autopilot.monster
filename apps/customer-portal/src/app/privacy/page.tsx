import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

export const metadata = {
  title: 'Privacy Policy - Autopilot.monster',
  description: 'Privacy Policy for Autopilot.monster AI agents and automation platform.',
}

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-extrabold">Privacy Policy</h1>
            <p className="text-lg" style={{ opacity: 0.8, marginTop: '12px' }}>
              Complete Privacy Policy documentation coming soon.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
