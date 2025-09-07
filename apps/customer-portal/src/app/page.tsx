import { Hero } from '@/components/sections/Hero/Hero'
import { Features } from '@/components/sections/Features/Features'
import { PopularAgents } from '@/components/sections/PopularAgents/PopularAgents'
import { WorkflowShowcase } from '@/components/sections/WorkflowShowcase/WorkflowShowcase'
import { Testimonials } from '@/components/sections/Testimonials/Testimonials'
import { PricingTeaser } from '@/components/sections/PricingTeaser/PricingTeaser'
import { StatsSection } from '@/components/sections/StatsSection/StatsSection'
import { CTASection } from '@/components/sections/CTASection/CTASection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <Features />
      <PopularAgents />
      <WorkflowShowcase />
      <Testimonials />
      <PricingTeaser />
      <CTASection />
    </>
  )
}