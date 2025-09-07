'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Button } from '@/components/ui/Button/Button'
import { 
  Star, 
  Download, 
  Users, 
  Zap, 
  ArrowRight,
  Crown,
  TrendingUp
} from 'lucide-react'
import styles from './PopularAgents.module.scss'

const popularAgents = [
  {
    id: 1,
    name: 'SalesGPT Pro',
    category: 'Sales & Marketing',
    description: 'Advanced AI sales assistant that handles lead qualification, follow-ups, and closes deals automatically.',
    price: 199,
    originalPrice: 299,
    rating: 4.9,
    downloads: 15420,
    isPremium: true,
    isTrending: true,
    features: ['Lead Qualification', 'Email Automation', 'CRM Integration', 'Analytics Dashboard'],
    image: '/api/placeholder/300/200'
  },
  {
    id: 2,
    name: 'CustomerCare Bot',
    category: 'Customer Support',
    description: '24/7 customer support agent that resolves 80% of queries without human intervention.',
    price: 149,
    originalPrice: null,
    rating: 4.8,
    downloads: 12850,
    isPremium: false,
    isTrending: false,
    features: ['Multi-language Support', 'Ticket Management', 'Knowledge Base', 'Escalation Rules'],
    image: '/api/placeholder/300/200'
  },
  {
    id: 3,
    name: 'Content Creator AI',
    category: 'Content Marketing',
    description: 'Generate high-quality blog posts, social media content, and marketing copy in seconds.',
    price: 99,
    originalPrice: 149,
    rating: 4.7,
    downloads: 22100,
    isPremium: false,
    isTrending: true,
    features: ['SEO Optimization', 'Brand Voice', 'Multi-format Output', 'Plagiarism Check'],
    image: '/api/placeholder/300/200'
  },
  {
    id: 4,
    name: 'Data Analyst Pro',
    category: 'Analytics & BI',
    description: 'Transform raw data into actionable insights with automated reporting and visualization.',
    price: 249,
    originalPrice: 349,
    rating: 4.9,
    downloads: 8750,
    isPremium: true,
    isTrending: false,
    features: ['Real-time Analytics', 'Custom Dashboards', 'Predictive Modeling', 'API Integration'],
    image: '/api/placeholder/300/200'
  },
  {
    id: 5,
    name: 'HR Assistant',
    category: 'Human Resources',
    description: 'Streamline recruitment, onboarding, and employee management with intelligent automation.',
    price: 179,
    originalPrice: null,
    rating: 4.6,
    downloads: 9650,
    isPremium: false,
    isTrending: false,
    features: ['Resume Screening', 'Interview Scheduling', 'Onboarding Workflows', 'Performance Tracking'],
    image: '/api/placeholder/300/200'
  },
  {
    id: 6,
    name: 'Finance Optimizer',
    category: 'Finance & Accounting',
    description: 'Automate invoice processing, expense tracking, and financial reporting with AI precision.',
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    downloads: 12300,
    isPremium: true,
    isTrending: true,
    features: ['Invoice Processing', 'Expense Categorization', 'Financial Forecasting', 'Compliance Reporting'],
    image: '/api/placeholder/300/200'
  }
]

export const PopularAgents: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className={styles.popularAgents} ref={ref}>
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
              <TrendingUp size={16} />
              <span>Most Popular</span>
            </motion.div>
          </div>
          
          <h2 className={styles.sectionTitle}>
            Popular <span className={styles.gradientText}>AI Agents</span>
          </h2>
          <p className={styles.sectionDescription}>
            Discover the most downloaded and highly-rated AI agents from our marketplace. 
            Trusted by thousands of businesses worldwide.
          </p>
        </motion.div>

        <motion.div
          className={styles.agentsGrid}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {popularAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              className={styles.agentCard}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ scale: 1.02, y: -8 }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.agentImage}>
                  <div className={styles.imagePlaceholder}>
                    <Zap size={32} />
                  </div>
                  {agent.isPremium && (
                    <div className={styles.premiumBadge}>
                      <Crown size={16} />
                    </div>
                  )}
                  {agent.isTrending && (
                    <div className={styles.trendingBadge}>
                      <TrendingUp size={14} />
                      <span>Trending</span>
                    </div>
                  )}
                </div>
                
                <div className={styles.agentInfo}>
                  <div className={styles.category}>{agent.category}</div>
                  <h3 className={styles.agentTitle}>{agent.name}</h3>
                  <p className={styles.agentDescription}>{agent.description}</p>
                </div>
              </div>

              <div className={styles.agentFeatures}>
                {agent.features.slice(0, 2).map((feature, idx) => (
                  <div key={idx} className={styles.feature}>
                    <div className={styles.featureDot} />
                    <span>{feature}</span>
                  </div>
                ))}
                {agent.features.length > 2 && (
                  <div className={styles.moreFeatures}>
                    +{agent.features.length - 2} more features
                  </div>
                )}
              </div>

              <div className={styles.agentStats}>
                <div className={styles.stat}>
                  <Star size={16} />
                  <span>{agent.rating}</span>
                </div>
                <div className={styles.stat}>
                  <Download size={16} />
                  <span>{agent.downloads.toLocaleString()}</span>
                </div>
                <div className={styles.stat}>
                  <Users size={16} />
                  <span>Active</span>
                </div>
              </div>

              <div className={styles.agentFooter}>
                <div className={styles.pricing}>
                  <div className={styles.currentPrice}>${agent.price}/mo</div>
                  {agent.originalPrice && (
                    <div className={styles.originalPrice}>${agent.originalPrice}/mo</div>
                  )}
                </div>
                <Button variant="primary" size="sm">
                  Get Started
                  <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.sectionFooter}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button variant="ghost" size="lg">
            View All AI Agents
            <ArrowRight size={20} />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
