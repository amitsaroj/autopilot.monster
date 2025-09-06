import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

interface ProductPageProps {
  params: { id: string }
}

export const metadata = {
  title: 'Product - Autopilot.monster',
  description: 'Explore AI agents and workflows in detail.',
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <>
      <Navigation />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-extrabold">Product #{params.id}</h1>
            <p className="text-lg" style={{ opacity: 0.8, marginTop: '12px' }}>
              Product detail view coming soon.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
