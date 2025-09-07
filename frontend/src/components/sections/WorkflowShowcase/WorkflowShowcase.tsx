'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Button } from '@/components/ui/Button/Button'
import { 
  Workflow, 
  Download, 
  Clock, 
  ArrowRight,
  Zap,
  Database,
  Mail,
  Calendar,
  FileText,
  TrendingUp
} from 'lucide-react'
import styles from './WorkflowShowcase.module.scss'

const workflows = [
  {
    id: 1,
    name: 'Email Marketing Automation',
    category: 'Marketing',
    description: 'Automatically send personalized emails based on user behavior, segment lists, and track engagement metrics.',
    price: 0,
    downloads: 28450,
    nodes: 12,
    isPopular: true,
    features: ['Email Segmentation', 'Behavioral Triggers', 'A/B Testing', 'Analytics Integration'],
    image: '/api/placeholder/300/200',
    icon: Mail
  },
  {
    id: 2,
    name: 'CRM Lead Processing',
    category: 'Sales',
    description: 'Automatically capture leads from multiple sources, enrich data, and assign to sales reps.',
    price: 0,
    downloads: 19200,
    nodes: 18,
    isPopular: false,
    features: ['Lead Enrichment', 'Auto Assignment', 'Follow-up Scheduling', 'Pipeline Updates'],
    image: '/api/placeholder/300/200',
    icon: Database
  },
  {
    id: 3,
    name: 'Social Media Scheduler',
    category: 'Social Media',
    description: 'Schedule posts across multiple platforms, monitor mentions, and engage with your audience automatically.',
    price: 0,
    downloads: 35600,
    nodes: 15,
    isPopular: true,
    features: ['Multi-platform Posting', 'Content Calendar', 'Engagement Tracking', 'Hashtag Optimization'],
    image: '/api/placeholder/300/200',
    icon: Calendar
  },
  {
    id: 4,
    name: 'Invoice Processing Bot',
    category: 'Finance',
    description: 'Extract data from invoices, validate information, and automatically update accounting systems.',
    price: 0,
    downloads: 12800,
    nodes: 22,
    isPopular: false,
    features: ['OCR Processing', 'Data Validation', 'Approval Workflows', 'ERP Integration'],
    image: '/api/placeholder/300/200',
    icon: FileText
  },
  {
    id: 5,
    name: 'Customer Onboarding Flow',
    category: 'Customer Success',
    description: 'Welcome new customers with personalized sequences, setup guides, and milestone tracking.',
    price: 0,
    downloads: 22100,
    nodes: 16,
    isPopular: true,
    features: ['Welcome Sequences', 'Progress Tracking', 'Milestone Notifications', 'Success Metrics'],
    image: '/api/placeholder/300/200',
    icon: TrendingUp
  },
  {
    id: 6,
    name: 'Data Sync & Backup',
    category: 'Data Management',
    description: 'Automatically sync data between systems, create backups, and maintain data integrity.',
    price: 0,
    downloads: 15700,
    nodes: 20,
    isPopular: false,
    features: ['Real-time Sync', 'Automated Backups', 'Data Validation', 'Error Handling'],
    image: '/api/placeholder/300/200',
    icon: Database
  }
]

export const WorkflowShowcase: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className={styles.workflowShowcase} ref={ref}>
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
              <Workflow size={16} />
              <span>n8n Workflows</span>
            </motion.div>
          </div>
          
          <h2 className={styles.sectionTitle}>
            <span className={styles.gradientText}>n8n Workflow</span> Showcase
          </h2>
          <p className={styles.sectionDescription}>
            Explore powerful automation workflows built with n8n. From simple integrations to complex business processes. 
            All workflows are free to download and customize.
          </p>
        </motion.div>

        <motion.div
          className={styles.workflowsGrid}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {workflows.map((workflow, index) => (
            <motion.div
              key={workflow.id}
              className={styles.workflowCard}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ scale: 1.02, y: -8 }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.workflowImage}>
                  <div className={styles.imagePlaceholder}>
                    <workflow.icon size={32} />
                  </div>
                  {workflow.isPopular && (
                    <div className={styles.popularBadge}>
                      <TrendingUp size={14} />
                      <span>Popular</span>
                    </div>
                  )}
                </div>
                
                <div className={styles.workflowInfo}>
                  <div className={styles.category}>{workflow.category}</div>
                  <h3 className={styles.workflowTitle}>{workflow.name}</h3>
                  <p className={styles.workflowDescription}>{workflow.description}</p>
                </div>
              </div>

              <div className={styles.workflowFeatures}>
                {workflow.features.slice(0, 2).map((feature, idx) => (
                  <div key={idx} className={styles.feature}>
                    <div className={styles.featureDot} />
                    <span>{feature}</span>
                  </div>
                ))}
                {workflow.features.length > 2 && (
                  <div className={styles.moreFeatures}>
                    +{workflow.features.length - 2} more features
                  </div>
                )}
              </div>

              <div className={styles.workflowStats}>
                <div className={styles.stat}>
                  <Download size={16} />
                  <span>{workflow.downloads.toLocaleString()}</span>
                </div>
                <div className={styles.stat}>
                  <Zap size={16} />
                  <span>{workflow.nodes} nodes</span>
                </div>
                <div className={styles.stat}>
                  <Clock size={16} />
                  <span>5 min setup</span>
                </div>
              </div>

              <div className={styles.workflowFooter}>
                <div className={styles.pricing}>
                  <div className={styles.price}>Free</div>
                  <div className={styles.priceSubtext}>Download & Use</div>
                </div>
                <Button variant="primary" size="sm">
                  Download
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
            Browse All Workflows
            <ArrowRight size={20} />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
