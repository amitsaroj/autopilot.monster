import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

export const metadata = {
  title: 'About - Autopilot.monster',
  description: 'Our vision, mission, and team building the future of automation.',
}

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-extrabold">About Us</h1>
            <p className="text-lg" style={{ opacity: 0.8, marginTop: '12px' }}>
              We are on a mission to democratize AI automation for everyone.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
