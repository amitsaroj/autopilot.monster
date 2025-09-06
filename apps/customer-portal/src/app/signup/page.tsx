import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

export const metadata = {
  title: 'Sign Up - Autopilot.monster',
  description: 'Create your Autopilot.monster account to start using AI agents and workflows.',
}

export default function SignupPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-extrabold">Sign Up</h1>
            <p className="text-lg" style={{ opacity: 0.8, marginTop: '12px' }}>
              Animated signup page with registration coming soon.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
