import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

export const metadata = {
  title: 'Contact - Autopilot.monster',
  description: 'Contact the team behind Autopilot.monster.',
}

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-extrabold">Contact Us</h1>
            <p className="text-lg" style={{ opacity: 0.8, marginTop: '12px' }}>
              We typically respond within 24–48 hours.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
