import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

export const metadata = {
  title: 'Admin - Autopilot.monster',
  description: 'Administrative controls and monitoring.',
}

export default function AdminPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-extrabold">Admin Panel</h1>
            <p className="text-lg" style={{ opacity: 0.8, marginTop: '12px' }}>
              Manage users, products, and system settings.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
