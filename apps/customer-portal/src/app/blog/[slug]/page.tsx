import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'

interface BlogPageProps {
  params: { slug: string }
}

export const metadata = {
  title: 'Blog Post - Autopilot.monster',
  description: 'Read the latest from Autopilot.monster.',
}

export default function BlogPostPage({ params }: BlogPageProps) {
  return (
    <>
      <Navigation />
      <main>
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-extrabold">{params.slug.replace(/-/g, ' ')}</h1>
            <p className="text-lg" style={{ opacity: 0.8, marginTop: '12px' }}>
              Blog content coming soon.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
