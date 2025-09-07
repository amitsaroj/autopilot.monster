'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/Button/Button'
import { 
  Check,
  X,
  Zap,
  Star,
  Crown,
  Rocket,
  Shield,
  Users,
  Bot,
  Workflow,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Globe,
  Lock
} from 'lucide-react'
import styles from './Pricing.module.scss'

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started with AI automation',
    price: 0,
    period: 'forever',
    icon: Zap,
    color: 'primary',
    popular: false,
    features: [
      { name: '5 AI Agents', included: true },
      { name: '10 n8n Workflows', included: true },
      { name: 'Basic Templates', included: true },
      { name: 'Community Support', included: true },
      { name: '1GB Storage', included: true },
      { name: 'API Access', included: false },
      { name: 'Priority Support', included: false },
      { name: 'Custom Integrations', included: false },
      { name: 'Advanced Analytics', included: false },
      { name: 'White-label Options', included: false }
    ],
    cta: 'Get Started Free',
    ctaVariant: 'ghost' as const
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing businesses and teams',
    price: 29,
    period: 'month',
    icon: Star,
    color: 'neural',
    popular: true,
    features: [
      { name: '50 AI Agents', included: true },
      { name: '100 n8n Workflows', included: true },
      { name: 'Premium Templates', included: true },
      { name: 'Email Support', included: true },
      { name: '10GB Storage', included: true },
      { name: 'API Access', included: true },
      { name: 'Priority Support', included: true },
      { name: 'Custom Integrations', included: false },
      { name: 'Advanced Analytics', included: false },
      { name: 'White-label Options', included: false }
    ],
    cta: 'Start Pro Trial',
    ctaVariant: 'primary' as const
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For established companies and enterprises',
    price: 99,
    period: 'month',
    icon: Crown,
    color: 'cyber',
    popular: false,
    features: [
      { name: 'Unlimited AI Agents', included: true },
      { name: 'Unlimited n8n Workflows', included: true },
      { name: 'All Templates', included: true },
      { name: '24/7 Phone Support', included: true },
      { name: '100GB Storage', included: true },
      { name: 'Full API Access', included: true },
      { name: 'Priority Support', included: true },
      { name: 'Custom Integrations', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'White-label Options', included: false }
    ],
    cta: 'Start Business Trial',
    ctaVariant: 'primary' as const
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price: 'Custom',
    period: 'contact',
    icon: Rocket,
    color: 'accent',
    popular: false,
    features: [
      { name: 'Everything in Business', included: true },
      { name: 'Dedicated Account Manager', included: true },
      { name: 'Custom Development', included: true },
      { name: 'On-premise Deployment', included: true },
      { name: 'Unlimited Storage', included: true },
      { name: 'SLA Guarantee', included: true },
      { name: 'Training & Onboarding', included: true },
      { name: 'Custom Integrations', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'White-label Options', included: true }
    ],
    cta: 'Contact Sales',
    ctaVariant: 'ghost' as const
  }
]

const features = [
  {
    category: 'AI Agents',
    icon: Bot,
    items: [
      'Natural Language Processing',
      'Sentiment Analysis',
      'Multi-language Support',
      'Custom Training',
      'API Integrations'
    ]
  },
  {
    category: 'n8n Workflows',
    icon: Workflow,
    items: [
      'Visual Workflow Builder',
      'Pre-built Templates',
      'Custom Nodes',
      'Webhook Support',
      'Error Handling'
    ]
  },
  {
    category: 'Analytics',
    icon: TrendingUp,
    items: [
      'Performance Metrics',
      'Usage Statistics',
      'Cost Tracking',
      'Custom Dashboards',
      'Export Reports'
    ]
  },
  {
    category: 'Support',
    icon: Shield,
    items: [
      '24/7 Support',
      'Documentation',
      'Video Tutorials',
      'Community Forum',
      'Expert Training'
    ]
  }
]

const faqs = [
  {
    question: 'Can I change plans anytime?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing differences.'
  },
  {
    question: 'What happens to my data if I cancel?',
    answer: 'Your data remains accessible for 30 days after cancellation. You can export all your workflows and agent configurations during this period.'
  },
  {
    question: 'Do you offer custom pricing?',
    answer: 'Yes, we offer custom pricing for enterprise customers with specific requirements. Contact our sales team to discuss your needs.'
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes, all paid plans come with a 14-day free trial. No credit card required to start your trial.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers for annual subscriptions. Enterprise customers can also pay via invoice.'
  }
]

export default function PricingPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const getPrice = (plan: typeof pricingPlans[0]) => {
    if (plan.price === 'Custom') return 'Custom'
    if (billingPeriod === 'yearly' && typeof plan.price === 'number') {
      return Math.round(plan.price * 12 * 0.8) // 20% discount for yearly
    }
    return plan.price
  }

  const getPeriod = (plan: typeof pricingPlans[0]) => {
    if (plan.price === 'Custom') return 'contact'
    return billingPeriod === 'yearly' ? 'year' : plan.period
  }

  return (
      <main className={styles.pricingPage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className="container">
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className={styles.badge}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Sparkles size={16} />
                <span>Simple, Transparent Pricing</span>
              </motion.div>

              <h1 className={styles.heroTitle}>
                Choose Your <span className={styles.gradientText}>Automation</span> Plan
              </h1>
              
              <p className={styles.heroDescription}>
                Start free and scale as you grow. All plans include access to our marketplace 
                and community. No hidden fees, no surprises.
              </p>

              {/* Billing Toggle */}
              <motion.div
                className={styles.billingToggle}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <span className={billingPeriod === 'monthly' ? styles.active : ''}>Monthly</span>
                <button
                  className={styles.toggle}
                  onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                >
                  <div className={`${styles.toggleSlider} ${billingPeriod === 'yearly' ? styles.yearly : ''}`} />
                </button>
                <span className={billingPeriod === 'yearly' ? styles.active : ''}>
                  Yearly
                  <span className={styles.discount}>Save 20%</span>
                </span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className={styles.pricingSection} ref={ref}>
          <div className="container">
            <motion.div
              className={styles.pricingGrid}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  className={`${styles.pricingCard} ${styles[plan.color]} ${plan.popular ? styles.popular : ''}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -8 }}
                >
                  {plan.popular && (
                    <div className={styles.popularBadge}>
                      <Star size={16} />
                      <span>Most Popular</span>
                    </div>
                  )}

                  <div className={styles.planHeader}>
                    <div className={styles.planIcon}>
                      <plan.icon size={32} />
                    </div>
                    <h3 className={styles.planName}>{plan.name}</h3>
                    <p className={styles.planDescription}>{plan.description}</p>
                  </div>

                  <div className={styles.planPricing}>
                    <div className={styles.price}>
                      {typeof getPrice(plan) === 'number' ? (
                        <>
                          <span className={styles.currency}>$</span>
                          <span className={styles.amount}>{getPrice(plan)}</span>
                        </>
                      ) : (
                        <span className={styles.customPrice}>{getPrice(plan)}</span>
                      )}
                    </div>
                    <div className={styles.period}>per {getPeriod(plan)}</div>
                  </div>

                  <div className={styles.planFeatures}>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className={styles.feature}>
                        {feature.included ? (
                          <Check size={16} className={styles.checkIcon} />
                        ) : (
                          <X size={16} className={styles.xIcon} />
                        )}
                        <span className={feature.included ? '' : styles.disabled}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant={plan.ctaVariant}
                    size="lg"
                    className={styles.planCta}
                  >
                    {plan.cta}
                    <ArrowRight size={20} />
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <div className="container">
            <motion.div
              className={styles.sectionHeader}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={styles.sectionTitle}>Everything You Need to Automate</h2>
              <p className={styles.sectionDescription}>
                Powerful features included in every plan to help you build, deploy, and scale your automation.
              </p>
            </motion.div>

            <motion.div
              className={styles.featuresGrid}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.category}
                  className={styles.featureCard}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -8 }}
                >
                  <div className={styles.featureIcon}>
                    <feature.icon size={32} />
                  </div>
                  <h3 className={styles.featureTitle}>{feature.category}</h3>
                  <ul className={styles.featureList}>
                    {feature.items.map((item, idx) => (
                      <li key={idx} className={styles.featureItem}>
                        <Check size={14} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={styles.faqSection}>
          <div className="container">
            <motion.div
              className={styles.sectionHeader}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
              <p className={styles.sectionDescription}>
                Got questions? We&apos;ve got answers. Can&apos;t find what you&apos;re looking for? 
                <a href="/contact" className={styles.contactLink}>Contact our support team</a>.
              </p>
            </motion.div>

            <motion.div
              className={styles.faqGrid}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className={styles.faqItem}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <h3 className={styles.faqQuestion}>{faq.question}</h3>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className="container">
            <motion.div
              className={styles.ctaContent}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className={styles.ctaTitle}>Ready to Start Automating?</h2>
              <p className={styles.ctaDescription}>
                Join thousands of businesses already using Autopilot.monster to streamline their operations.
              </p>
              <div className={styles.ctaButtons}>
                <Button variant="primary" size="lg">
                  Start Free Trial
                  <ArrowRight size={20} />
                </Button>
                <Button variant="ghost" size="lg">
                  Contact Sales
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
  )
}