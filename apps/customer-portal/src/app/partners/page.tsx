'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Handshake, 
  Globe, 
  TrendingUp, 
  Users, 
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  Building,
  Zap,
  Shield,
  Target,
  Mail,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import styles from './Partners.module.scss'

// Partner categories
const partnerCategories = [
  {
    title: 'Technology Partners',
    description: 'Leading tech companies building the future of automation',
    icon: Zap,
    color: '#4F46E5',
    partners: [
      { name: 'Microsoft', description: 'Azure cloud infrastructure and AI services', logo: '/api/placeholder/120/60', tier: 'Strategic' },
      { name: 'Google Cloud', description: 'AI/ML platform and cloud services', logo: '/api/placeholder/120/60', tier: 'Strategic' },
      { name: 'AWS', description: 'Cloud infrastructure and serverless computing', logo: '/api/placeholder/120/60', tier: 'Strategic' },
      { name: 'OpenAI', description: 'Advanced AI models and API integration', logo: '/api/placeholder/120/60', tier: 'Technology' }
    ]
  },
  {
    title: 'Integration Partners',
    description: 'Platform integrations that extend our capabilities',
    icon: Globe,
    color: '#059669',
    partners: [
      { name: 'Stripe', description: 'Payment processing and financial services', logo: '/api/placeholder/120/60', tier: 'Integration' },
      { name: 'Salesforce', description: 'CRM and customer relationship management', logo: '/api/placeholder/120/60', tier: 'Integration' },
      { name: 'Slack', description: 'Team communication and collaboration', logo: '/api/placeholder/120/60', tier: 'Integration' },
      { name: 'Zapier', description: 'Workflow automation and app connections', logo: '/api/placeholder/120/60', tier: 'Integration' }
    ]
  },
  {
    title: 'Solution Partners',
    description: 'Consulting firms and agencies delivering automation solutions',
    icon: Users,
    color: '#DC2626',
    partners: [
      { name: 'Deloitte Digital', description: 'Enterprise automation consulting', logo: '/api/placeholder/120/60', tier: 'Consulting' },
      { name: 'Accenture', description: 'Digital transformation and automation', logo: '/api/placeholder/120/60', tier: 'Consulting' },
      { name: 'KPMG', description: 'Business process automation advisory', logo: '/api/placeholder/120/60', tier: 'Consulting' },
      { name: 'PwC', description: 'Strategic automation implementations', logo: '/api/placeholder/120/60', tier: 'Consulting' }
    ]
  }
]

// Success stories
const successStories = [
  {
    partner: 'Microsoft',
    title: 'Enterprise AI Transformation',
    description: 'Collaborated to deliver enterprise-grade AI automation solutions to Fortune 500 companies, resulting in 40% operational efficiency gains.',
    metrics: [
      { label: 'Efficiency Gain', value: '40%' },
      { label: 'Deployment Time', value: '50% Faster' },
      { label: 'Enterprise Clients', value: '250+' }
    ],
    image: '/api/placeholder/400/250'
  },
  {
    partner: 'Salesforce',
    title: 'CRM Automation Revolution',
    description: 'Integrated AI agents with Salesforce CRM to automate lead qualification and customer support, reducing response times by 75%.',
    metrics: [
      { label: 'Response Time', value: '75% Faster' },
      { label: 'Lead Qualification', value: '85% Automated' },
      { label: 'Customer Satisfaction', value: '95%' }
    ],
    image: '/api/placeholder/400/250'
  }
]

// Partner benefits
const partnerBenefits = [
  {
    icon: TrendingUp,
    title: 'Revenue Growth',
    description: 'Access new markets and revenue streams through our growing ecosystem'
  },
  {
    icon: Shield,
    title: 'Technical Support',
    description: '24/7 technical support and dedicated partner success managers'
  },
  {
    icon: Award,
    title: 'Co-Marketing',
    description: 'Joint marketing opportunities and case study development'
  },
  {
    icon: Users,
    title: 'Community Access',
    description: 'Exclusive partner events, training, and certification programs'
  }
]

// Partner application process
const applicationSteps = [
  {
    step: 1,
    title: 'Initial Application',
    description: 'Submit your partnership application with company details and integration plans'
  },
  {
    step: 2,
    title: 'Technical Review',
    description: 'Our technical team reviews your capabilities and integration requirements'
  },
  {
    step: 3,
    title: 'Partnership Agreement',
    description: 'Finalize partnership terms and sign the formal agreement'
  },
  {
    step: 4,
    title: 'Integration & Launch',
    description: 'Complete technical integration and launch your partnership'
  }
]

export default function PartnersPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const storiesRef = useRef<HTMLDivElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)
  const processRef = useRef<HTMLDivElement>(null)
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const categoriesInView = useInView(categoriesRef, { once: true, amount: 0.2 })
  const storiesInView = useInView(storiesRef, { once: true, amount: 0.2 })
  const benefitsInView = useInView(benefitsRef, { once: true, amount: 0.2 })
  const processInView = useInView(processRef, { once: true, amount: 0.2 })

  return (
    <div className={styles.partnersPage}>
      {/* Hero Section */}
      <section className={styles.hero} ref={heroRef}>
        <div className="container">
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 60 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
          >
            <div className={styles.badge}>
              <Handshake size={16} />
              <span>Strategic Partnerships</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              Partner with the
              <span className={styles.gradient}> Future of Automation</span>
            </h1>
            
            <p className={styles.heroDescription}>
              Join our ecosystem of leading technology companies, integration partners, and solution providers. 
              Together, we&apos;re building the next generation of AI-powered business automation that transforms 
              how organizations operate worldwide.
            </p>
            
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>200+</div>
                <div className={styles.statLabel}>Active Partners</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>50M+</div>
                <div className={styles.statLabel}>Joint Customers</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>$2B+</div>
                <div className={styles.statLabel}>Partner Revenue</div>
              </div>
            </div>
            
            <div className={styles.heroActions}>
              <Button size="lg" variant="primary">
                Become a Partner
                <ArrowRight size={20} />
              </Button>
              <Button size="lg" variant="outline">
                View Partner Portal
                <ExternalLink size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partner Categories */}
      <section className={styles.categories} ref={categoriesRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={categoriesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Our Partner Ecosystem</h2>
            <p>Collaborate with industry leaders across technology, integrations, and solutions</p>
          </motion.div>

          <div className={styles.categoriesGrid}>
            {partnerCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                className={styles.categoryCard}
                initial={{ opacity: 0, y: 40 }}
                animate={categoriesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
              >
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryIcon} style={{ backgroundColor: category.color }}>
                    <category.icon size={28} />
                  </div>
                  <div>
                    <h3>{category.title}</h3>
                    <p>{category.description}</p>
                  </div>
                </div>
                
                <div className={styles.partnersList}>
                  {category.partners.map((partner, index) => (
                    <motion.div
                      key={partner.name}
                      className={styles.partnerItem}
                      initial={{ opacity: 0, x: -20 }}
                      animate={categoriesInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, delay: categoryIndex * 0.2 + index * 0.1 }}
                    >
                      <div className={styles.partnerLogo}>
                        <img src={partner.logo} alt={`${partner.name} logo`} />
                      </div>
                      <div className={styles.partnerInfo}>
                        <div className={styles.partnerHeader}>
                          <h4>{partner.name}</h4>
                          <span className={styles.partnerTier}>{partner.tier}</span>
                        </div>
                        <p>{partner.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className={styles.stories} ref={storiesRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={storiesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Partnership Success Stories</h2>
            <p>Real results from our strategic collaborations</p>
          </motion.div>

          <div className={styles.storiesGrid}>
            {successStories.map((story, index) => (
              <motion.div
                key={story.partner}
                className={styles.storyCard}
                initial={{ opacity: 0, y: 40 }}
                animate={storiesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className={styles.storyImage}>
                  <img src={story.image} alt={story.title} />
                </div>
                <div className={styles.storyContent}>
                  <div className={styles.storyPartner}>{story.partner}</div>
                  <h3>{story.title}</h3>
                  <p>{story.description}</p>
                  <div className={styles.storyMetrics}>
                    {story.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className={styles.metric}>
                        <div className={styles.metricValue}>{metric.value}</div>
                        <div className={styles.metricLabel}>{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Benefits */}
      <section className={styles.benefits} ref={benefitsRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Why Partner with Us</h2>
            <p>Unlock new opportunities and accelerate your growth</p>
          </motion.div>

          <div className={styles.benefitsGrid}>
            {partnerBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className={styles.benefitCard}
                initial={{ opacity: 0, y: 40 }}
                animate={benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={styles.benefitIcon}>
                  <benefit.icon size={24} />
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className={styles.process} ref={processRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Partnership Process</h2>
            <p>Simple steps to join our partner ecosystem</p>
          </motion.div>

          <div className={styles.processSteps}>
            {applicationSteps.map((step, index) => (
              <motion.div
                key={step.step}
                className={styles.processStep}
                initial={{ opacity: 0, y: 40 }}
                animate={processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className={styles.stepNumber}>{step.step}</div>
                <div className={styles.stepContent}>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                {index < applicationSteps.length - 1 && (
                  <ArrowRight className={styles.stepArrow} size={20} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <motion.div
            className={styles.ctaContent}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={processInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2>Ready to Partner with Us?</h2>
            <p>
              Join leading companies already transforming their business through our partnership program. 
              Let&apos;s build the future of automation together.
            </p>
            <div className={styles.ctaActions}>
              <Button size="lg" variant="primary">
                Apply for Partnership
                <ArrowRight size={20} />
              </Button>
              <Button size="lg" variant="outline">
                Contact Partnership Team
                <Mail size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
