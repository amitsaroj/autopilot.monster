import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

export const metadata = {
  title: 'Services - Autopilot.monster',
  description: 'Explore AI agents and automation services for every skill level.',
}

export default function ServicesPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-extrabold">Services</h1>
            <p className="text-lg" style={{ opacity: 0.8, marginTop: '12px' }}>
              No-code, Low-code, and Developer-focused AI solutions.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
