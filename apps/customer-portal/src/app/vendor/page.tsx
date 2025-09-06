import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

export const metadata = {
  title: 'Vendor - Autopilot.monster',
  description: 'Manage your products and sales.',
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
              Upload products, view analytics, and manage orders.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
