import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

export const metadata = {
  title: 'Dashboard - Autopilot.monster',
  description: 'Your purchases, downloads, and activity.',
}

export default function DashboardPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-extrabold">Your Dashboard</h1>
            <p className="text-lg" style={{ opacity: 0.8, marginTop: '12px' }}>
              Welcome back! Here’s your activity and purchases.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
