import { Navigation } from '@/components/layout/Navigation/Navigation'
import { MarketplaceHero } from '@/components/sections/MarketplaceHero/MarketplaceHero'
import { ProductGrid } from '@/components/features/ProductGrid/ProductGrid'
import { MarketplaceFilters } from '@/components/features/MarketplaceFilters/MarketplaceFilters'
import { Footer } from '@/components/layout/Footer/Footer'

export const metadata = {
  title: 'Marketplace - Autopilot.monster',
  description: 'Discover and purchase AI agents and automation workflows from top creators.',
}

export default function MarketplacePage() {
  return (
    <>
      <Navigation />
      <main>
        <MarketplaceHero />
        <section className="section">
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
              <MarketplaceFilters />
              <ProductGrid />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
