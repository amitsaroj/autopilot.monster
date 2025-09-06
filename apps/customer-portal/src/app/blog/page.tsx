import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

export const metadata = {
  title: 'Blog - Autopilot.monster',
  description: 'Insights, tutorials, and updates from Autopilot.monster.',
}

export default function BlogPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-extrabold">Blog</h1>
            <p className="text-lg" style={{ opacity: 0.8, marginTop: '12px' }}>
              Latest announcements and technical deep-dives.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
