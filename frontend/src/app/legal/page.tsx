import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

export const metadata = {
  title: 'Legal - Autopilot.monster',
  description: 'Terms of Service and Privacy Policy.',
}

export default function LegalPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-extrabold">Legal</h1>
            <p className="text-lg" style={{ opacity: 0.8, marginTop: '12px' }}>
              Terms of Service and Privacy Policy will be published here.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
