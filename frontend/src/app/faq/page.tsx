import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

export const metadata = {
  title: 'FAQ - Help Center - Autopilot.monster',
  description: 'Find answers to common questions about AI agents, workflows, and automation tools.',
}

export default function FAQPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-extrabold">Help Center & FAQ</h1>
            <p className="text-lg" style={{ opacity: 0.8, marginTop: '12px' }}>
              Comprehensive help center with frequently asked questions coming soon.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}