import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

export const metadata = {
  title: 'Pricing - Autopilot.monster',
  description: 'Flexible pricing for individuals, teams, and enterprises.',
}

export default function PricingPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-extrabold">Pricing</h1>
            <p className="text-lg" style={{ opacity: 0.8, marginTop: '12px' }}>
              Choose a plan that fits your growth.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
