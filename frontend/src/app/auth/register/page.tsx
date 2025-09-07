import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

export const metadata = {
  title: 'Register - Autopilot.monster',
  description: 'Create your Autopilot.monster account.',
}

export default function RegisterPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-extrabold">Create Account</h1>
            <p className="text-lg" style={{ opacity: 0.8, marginTop: '12px' }}>
              Start your AI automation journey.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
