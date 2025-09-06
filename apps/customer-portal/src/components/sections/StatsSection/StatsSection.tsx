'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import styles from './StatsSection.module.scss'

const stats = [
  {
    number: '10,000+',
    label: 'AI Agents Deployed',
    description: 'Across 50+ countries'
  },
  {
    number: '25,000+',
    label: 'n8n Workflows',
    description: 'Ready to automate'
  },
  {
    number: '500+',
    label: 'Active Creators',
    description: 'Building the future'
  },
  {
    number: '99.9%',
    label: 'Uptime Guarantee',
    description: 'Enterprise reliability'
  }
]

export function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className={styles.statsSection} ref={ref}>
      <div className="container">
        <motion.div
          className={styles.statsGrid}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={styles.statCard}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className={styles.statNumber}>
                {stat.number}
              </div>
              <div className={styles.statLabel}>
                {stat.label}
              </div>
              <div className={styles.statDescription}>
                {stat.description}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
