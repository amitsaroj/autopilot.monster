'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Zap, 
  Globe, 
  Database, 
  CreditCard, 
  Bot, 
  Workflow,
  ArrowRight,
  Check,
  Link,
  Play,
  Clock,
  Users,
  Shield,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import styles from './Integrations.module.scss'

// Metadata for this page - should be handled by layout or metadata API
// export const metadata = {
//   title: 'Integrations | Autopilot.monster - Connect Everything',
//   description: 'Seamlessly integrate with 200+ platforms including Stripe, Razorpay, OpenAI, n8n, Zapier, and more. Build powerful automation workflows that connect your entire business ecosystem.',
//   keywords: ['integrations', 'API connections', 'workflow automation', 'third-party platforms', 'enterprise integrations'],
// }

// Integration categories data
const integrationCategories = [
  {
    title: 'Payment Processors',
    description: 'Secure payment processing with global reach',
    icon: CreditCard,
    color: '#00D4AA',
    integrations: [
      { name: 'Stripe', description: 'Global payment processing', logo: '/api/placeholder/80/40', users: '2.8M+', setupTime: '5 min' },
      { name: 'Razorpay', description: 'Indian payment gateway', logo: '/api/placeholder/80/40', users: '500K+', setupTime: '10 min' },
      { name: 'PayPal', description: 'Worldwide payments', logo: '/api/placeholder/80/40', users: '1.2M+', setupTime: '8 min' },
      { name: 'Square', description: 'Point of sale solutions', logo: '/api/placeholder/80/40', users: '400K+', setupTime: '12 min' }
    ]
  },
  {
    title: 'AI & Machine Learning',
    description: 'Cutting-edge AI capabilities and models',
    icon: Bot,
    color: '#FF6B6B',
    integrations: [
      { name: 'OpenAI', description: 'GPT models and AI tools', logo: '/api/placeholder/80/40', users: '1.5M+', setupTime: '3 min' },
      { name: 'Anthropic', description: 'Claude AI assistant', logo: '/api/placeholder/80/40', users: '800K+', setupTime: '5 min' },
      { name: 'Google AI', description: 'Vertex AI and Bard', logo: '/api/placeholder/80/40', users: '950K+', setupTime: '7 min' },
      { name: 'Hugging Face', description: 'Open-source AI models', logo: '/api/placeholder/80/40', users: '600K+', setupTime: '6 min' }
    ]
  },
  {
    title: 'Workflow Automation',
    description: 'No-code automation platforms',
    icon: Workflow,
    color: '#4ECDC4',
    integrations: [
      { name: 'n8n', description: 'Fair-code automation', logo: '/api/placeholder/80/40', users: '350K+', setupTime: '15 min' },
      { name: 'Zapier', description: 'App automation platform', logo: '/api/placeholder/80/40', users: '5M+', setupTime: '8 min' },
      { name: 'Make', description: 'Visual automation builder', logo: '/api/placeholder/80/40', users: '400K+', setupTime: '12 min' },
      { name: 'Microsoft Power Automate', description: 'Enterprise workflows', logo: '/api/placeholder/80/40', users: '1.8M+', setupTime: '20 min' }
    ]
  },
  {
    title: 'Cloud Storage',
    description: 'Secure file storage and management',
    icon: Database,
    color: '#45B7D1',
    integrations: [
      { name: 'AWS S3', description: 'Object storage service', logo: '/api/placeholder/80/40', users: '2.2M+', setupTime: '10 min' },
      { name: 'Google Drive', description: 'Cloud file storage', logo: '/api/placeholder/80/40', users: '3.5M+', setupTime: '5 min' },
      { name: 'Dropbox', description: 'File synchronization', logo: '/api/placeholder/80/40', users: '1.1M+', setupTime: '7 min' },
      { name: 'Azure Blob', description: 'Microsoft cloud storage', logo: '/api/placeholder/80/40', users: '800K+', setupTime: '12 min' }
    ]
  },
  {
    title: 'Communication',
    description: 'Connect with your team and customers',
    icon: Users,
    color: '#96CEB4',
    integrations: [
      { name: 'Slack', description: 'Team communication', logo: '/api/placeholder/80/40', users: '4.2M+', setupTime: '3 min' },
      { name: 'Discord', description: 'Community platform', logo: '/api/placeholder/80/40', users: '2.8M+', setupTime: '5 min' },
      { name: 'Telegram', description: 'Messaging platform', logo: '/api/placeholder/80/40', users: '1.9M+', setupTime: '4 min' },
      { name: 'Microsoft Teams', description: 'Enterprise collaboration', logo: '/api/placeholder/80/40', users: '3.1M+', setupTime: '8 min' }
    ]
  },
  {
    title: 'Security & Compliance',
    description: 'Enterprise-grade security solutions',
    icon: Shield,
    color: '#F7931E',
    integrations: [
      { name: 'Auth0', description: 'Identity management', logo: '/api/placeholder/80/40', users: '600K+', setupTime: '15 min' },
      { name: 'Okta', description: 'SSO and identity', logo: '/api/placeholder/80/40', users: '450K+', setupTime: '20 min' },
      { name: 'OneLogin', description: 'Identity platform', logo: '/api/placeholder/80/40', users: '300K+', setupTime: '18 min' },
      { name: 'Ping Identity', description: 'Enterprise identity', logo: '/api/placeholder/80/40', users: '200K+', setupTime: '25 min' }
    ]
  }
]

// Popular workflow examples
const workflowExamples = [
  {
    title: 'AI-Powered Customer Support',
    description: 'Automatically categorize support tickets using OpenAI, route to appropriate teams via Slack, and update CRM records.',
    steps: ['Ticket received', 'AI categorization', 'Team notification', 'CRM update'],
    integrations: ['OpenAI', 'Slack', 'Salesforce'],
    savings: '67% faster resolution'
  },
  {
    title: 'Automated Payment Processing',
    description: 'Process payments through Stripe, send receipts via email, update customer records, and trigger fulfillment workflows.',
    steps: ['Payment received', 'Receipt generation', 'Customer update', 'Fulfillment trigger'],
    integrations: ['Stripe', 'SendGrid', 'PostgreSQL'],
    savings: '89% error reduction'
  },
  {
    title: 'Content Moderation Pipeline',
    description: 'Analyze user-generated content with AI, flag inappropriate material, and notify moderators for review.',
    steps: ['Content submission', 'AI analysis', 'Risk assessment', 'Moderation queue'],
    integrations: ['Google AI', 'Discord', 'Airtable'],
    savings: '92% automation rate'
  }
]

export default function IntegrationsPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const workflowsRef = useRef<HTMLDivElement>(null)
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const categoriesInView = useInView(categoriesRef, { once: true, amount: 0.2 })
  const workflowsInView = useInView(workflowsRef, { once: true, amount: 0.2 })

  return (
    <div className={styles.integrationsPage}>
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
              <Zap size={16} />
              <span>200+ Integrations Available</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              Connect Everything.
              <span className={styles.gradient}> Automate Anything.</span>
            </h1>
            
            <p className={styles.heroDescription}>
              Build powerful automation workflows by connecting AI agents with your favorite tools. 
              From payment processing to AI-powered analytics, integrate with enterprise-grade platforms 
              trusted by Fortune 500 companies worldwide.
            </p>
            
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>200+</div>
                <div className={styles.statLabel}>Integrations</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>99.9%</div>
                <div className={styles.statLabel}>Uptime</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>24/7</div>
                <div className={styles.statLabel}>Monitoring</div>
              </div>
            </div>
            
            <div className={styles.heroActions}>
              <Button size="lg" variant="primary">
                Browse Integrations
                <ArrowRight size={20} />
              </Button>
              <Button size="lg" variant="outline">
                <Play size={18} />
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Integration Categories */}
      <section className={styles.categories} ref={categoriesRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={categoriesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Integration Categories</h2>
            <p>Connect with the world&apos;s most trusted platforms and services</p>
          </motion.div>

          <div className={styles.categoriesGrid}>
            {integrationCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                className={styles.categoryCard}
                initial={{ opacity: 0, y: 40 }}
                animate={categoriesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryIcon} style={{ backgroundColor: category.color }}>
                    <category.icon size={24} />
                  </div>
                  <div>
                    <h3 className={styles.categoryTitle}>{category.title}</h3>
                    <p className={styles.categoryDescription}>{category.description}</p>
                  </div>
                </div>

                <div className={styles.integrationsList}>
                  {category.integrations.map((integration, index) => (
                    <motion.div
                      key={integration.name}
                      className={styles.integrationItem}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={styles.integrationLogo}>
                        <img src={integration.logo} alt={`${integration.name} logo`} />
                      </div>
                      <div className={styles.integrationInfo}>
                        <h4>{integration.name}</h4>
                        <p>{integration.description}</p>
                        <div className={styles.integrationMeta}>
                          <span className={styles.users}>{integration.users} users</span>
                          <span className={styles.setupTime}>
                            <Clock size={12} />
                            {integration.setupTime} setup
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Link size={16} />
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <div className={styles.categoryFooter}>
                  <Button variant="outline" size="sm">
                    View All {category.title}
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Examples */}
      <section className={styles.workflows} ref={workflowsRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={workflowsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Popular Workflow Examples</h2>
            <p>See how leading companies are automating their operations</p>
          </motion.div>

          <div className={styles.workflowsGrid}>
            {workflowExamples.map((workflow, index) => (
              <motion.div
                key={workflow.title}
                className={styles.workflowCard}
                initial={{ opacity: 0, y: 40 }}
                animate={workflowsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className={styles.workflowHeader}>
                  <h3>{workflow.title}</h3>
                  <div className={styles.savings}>{workflow.savings}</div>
                </div>
                
                <p className={styles.workflowDescription}>{workflow.description}</p>
                
                <div className={styles.workflowSteps}>
                  {workflow.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className={styles.step}>
                      <div className={styles.stepNumber}>{stepIndex + 1}</div>
                      <span>{step}</span>
                      {stepIndex < workflow.steps.length - 1 && (
                        <ArrowRight size={16} className={styles.stepArrow} />
                      )}
                    </div>
                  ))}
                </div>
                
                <div className={styles.workflowIntegrations}>
                  <span className={styles.integrationsLabel}>Uses:</span>
                  {workflow.integrations.map((integration, intIndex) => (
                    <span key={intIndex} className={styles.integrationTag}>
                      {integration}
                    </span>
                  ))}
                </div>
                
                <Button variant="outline" size="sm" className={styles.workflowCta}>
                  Build This Workflow
                  <ArrowRight size={16} />
                </Button>
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
            animate={workflowsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2>Ready to Connect Your Stack?</h2>
            <p>
              Join 50,000+ businesses automating their workflows with our enterprise-grade integrations. 
              Start building your first automation in under 5 minutes.
            </p>
            <div className={styles.ctaActions}>
              <Button size="lg" variant="primary">
                Start Free Trial
                <ArrowRight size={20} />
              </Button>
              <Button size="lg" variant="outline">
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
