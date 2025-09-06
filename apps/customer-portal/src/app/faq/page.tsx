import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

export const metadata = {
  title: 'FAQ - Autopilot.monster',
  description: 'Frequently asked questions about the marketplace.',
}

export default function FAQPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-extrabold">FAQ</h1>
            <p className="text-lg" style={{ opacity: 0.8, marginTop: '12px' }}>
              Common questions and answers.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
