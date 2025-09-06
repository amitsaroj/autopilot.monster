import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

export const metadata = {
  title: 'Login - Autopilot.monster',
  description: 'Access your Autopilot.monster account.',
}

export default function LoginPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-extrabold">Login</h1>
            <p className="text-lg" style={{ opacity: 0.8, marginTop: '12px' }}>
              Welcome back.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
