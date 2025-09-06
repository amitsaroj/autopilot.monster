'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/Button/Button'
import { 
  Check, 
  Star, 
  Zap, 
  Crown,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import styles from './PricingTeaser.module.scss'

const pricingPlans = [
  {
    id: 1,
    name: 'Starter',
    description: 'Perfect for individuals and small teams getting started with AI automation.',
    price: 29,
    originalPrice: 49,
    period: 'month',
    isPopular: false,
    features: [
      '5 AI Agents',
      '10 n8n Workflows',
      'Basic Analytics',
      'Email Support',
      'Community Access',
      '1 Team Member'
    ],
    limitations: [
      'Limited API calls',
      'Basic integrations'
    ],
    cta: 'Start Free Trial',
    color: 'primary'
  },
  {
    id: 2,
    name: 'Professional',
    description: 'Ideal for growing businesses that need advanced automation capabilities.',
    price: 99,
    originalPrice: 149,
    period: 'month',
    isPopular: true,
    features: [
      '25 AI Agents',
      '50 n8n Workflows',
      'Advanced Analytics',
      'Priority Support',
      'Custom Integrations',
      '5 Team Members',
      'API Access',
      'White-label Options'
    ],
    limitations: [],
    cta: 'Start Free Trial',
    color: 'neural'
  },
  {
    id: 3,
    name: 'Enterprise',
    description: 'For large organizations requiring unlimited scale and enterprise features.',
    price: 299,
    originalPrice: 399,
    period: 'month',
    isPopular: false,
    features: [
      'Unlimited AI Agents',
      'Unlimited Workflows',
      'Enterprise Analytics',
      '24/7 Phone Support',
      'Custom Development',
      'Unlimited Team Members',
      'Advanced Security',
      'SLA Guarantee',
      'Dedicated Account Manager'
    ],
    limitations: [],
    cta: 'Contact Sales',
    color: 'cyber'
  }
]

export const PricingTeaser: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const getPrice = (plan: typeof pricingPlans[0]) => {
    if (billingPeriod === 'yearly') {
      return {
        price: Math.round(plan.price * 10), // 10 months for yearly
        originalPrice: plan.originalPrice ? Math.round(plan.originalPrice * 10) : null
      }
    }
    return {
      price: plan.price,
      originalPrice: plan.originalPrice
    }
  }

  return (
    <section className={styles.pricingTeaser} ref={ref}>
      <div className="container">
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.headerTop}>
            <motion.div
              className={styles.badge}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Sparkles size={16} />
              <span>Simple, Transparent Pricing</span>
            </motion.div>
          </div>
          
          <h2 className={styles.sectionTitle}>
            Choose Your <span className={styles.gradientText}>Automation</span> Plan
          </h2>
          <p className={styles.sectionDescription}>
            Start free and scale as you grow. All plans include our core AI agents and n8n workflows. 
            No hidden fees, cancel anytime.
          </p>

          <motion.div
            className={styles.billingToggle}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
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
              <span className={styles.savings}>Save 20%</span>
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.pricingGrid}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {pricingPlans.map((plan, index) => {
            const pricing = getPrice(plan)
            return (
              <motion.div
                key={plan.id}
                className={`${styles.pricingCard} ${plan.isPopular ? styles.popular : ''} ${styles[plan.color]}`}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: 1.02, y: -8 }}
              >
                {plan.isPopular && (
                  <div className={styles.popularBadge}>
                    <Star size={16} />
                    <span>Most Popular</span>
                  </div>
                )}

                <div className={styles.planHeader}>
                  <div className={styles.planIcon}>
                    {plan.name === 'Starter' && <Zap size={24} />}
                    {plan.name === 'Professional' && <Crown size={24} />}
                    {plan.name === 'Enterprise' && <Sparkles size={24} />}
                  </div>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <p className={styles.planDescription}>{plan.description}</p>
                  
                  <div className={styles.planPricing}>
                    <div className={styles.priceContainer}>
                      <span className={styles.currency}>$</span>
                      <span className={styles.price}>{pricing.price}</span>
                      <span className={styles.period}>/{billingPeriod === 'yearly' ? 'year' : 'month'}</span>
                    </div>
                    {pricing.originalPrice && (
                      <div className={styles.originalPrice}>
                        ${pricing.originalPrice}/{billingPeriod === 'yearly' ? 'year' : 'month'}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.planFeatures}>
                  <ul className={styles.featuresList}>
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className={styles.feature}>
                        <Check size={16} className={styles.checkIcon} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.planFooter}>
                  <Button
                    variant={plan.isPopular ? 'holographic' : 'primary'}
                    size="lg"
                    className={styles.planButton}
                  >
                    {plan.cta}
                    <ArrowRight size={16} />
                  </Button>
                  <p className={styles.planNote}>
                    {billingPeriod === 'yearly' ? 'Billed annually' : 'Billed monthly'}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          className={styles.sectionFooter}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className={styles.footerText}>
            All plans include a 14-day free trial. No credit card required.
          </p>
          <Button variant="ghost" size="lg">
            Compare All Features
            <ArrowRight size={20} />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
