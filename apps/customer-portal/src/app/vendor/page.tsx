import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

export const metadata = {
  title: 'Vendor Dashboard - Autopilot.monster',
  description: 'Vendor dashboard for managing your AI agents and workflows listings.',
}

export default function VendorPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-extrabold">Vendor Dashboard</h1>
            <p className="text-lg" style={{ opacity: 0.8, marginTop: '12px' }}>
              Vendor dashboard with sales analytics and product management coming soon.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}