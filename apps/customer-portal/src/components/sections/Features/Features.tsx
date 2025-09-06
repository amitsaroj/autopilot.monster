'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Bot, Zap, Shield, Cpu, Brain, Workflow } from 'lucide-react'
import styles from './Features.module.scss'

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Agents',
    description: 'Deploy intelligent agents that learn and adapt to your business needs.',
    color: 'primary'
  },
  {
    icon: Workflow,
    title: 'n8n Workflows',
    description: 'Automate complex processes with visual workflow builder integration.',
    color: 'neural'
  },
  {
    icon: Brain,
    title: 'Machine Learning',
    description: 'Advanced ML models that continuously improve performance.',
    color: 'cyber'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade security with end-to-end encryption and compliance.',
    color: 'accent'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Sub-second response times with global edge deployment.',
    color: 'primary'
  },
  {
    icon: Cpu,
    title: 'Scalable Infrastructure',
    description: 'Handle millions of requests with auto-scaling architecture.',
    color: 'neural'
  }
]

export const Features: React.FC = () => {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.title}>
            Unleash the Power of{' '}
            <span className={styles.highlight}>AI Automation</span>
          </h2>
          <p className={styles.subtitle}>
            Transform your business with cutting-edge AI agents and workflows
          </p>
        </motion.div>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`${styles.feature} ${styles[feature.color]}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: [0.2, 0, 0, 1]
              }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className={styles.featureIcon}>
                <feature.icon size={32} />
                <div className={styles.iconGlow} />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
