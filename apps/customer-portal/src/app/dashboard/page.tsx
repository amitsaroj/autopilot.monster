import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

export const metadata = {
  title: 'Dashboard - Autopilot.monster',
  description: 'Your personal dashboard for managing AI agents and workflows.',
}

export default function DashboardPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-extrabold">User Dashboard</h1>
            <p className="text-lg" style={{ opacity: 0.8, marginTop: '12px' }}>
              User dashboard with analytics and management coming soon.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}