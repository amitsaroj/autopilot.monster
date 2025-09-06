import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

export const metadata = {
  title: 'Forgot Password - Autopilot.monster',
  description: 'Reset access to your account.',
}

export default function ForgotPasswordPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-extrabold">Forgot Password</h1>
            <p className="text-lg" style={{ opacity: 0.8, marginTop: '12px' }}>
              Enter your email to receive reset instructions.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
