'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Button } from '@/components/ui/Button/Button'
import { ArrowRight, Zap, Users, TrendingUp } from 'lucide-react'
import styles from './CTASection.module.scss'

export function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className={styles.ctaSection} ref={ref}>
      <div className="container">
        <motion.div
          className={styles.ctaContent}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.ctaText}>
            <motion.h2
              className={styles.ctaTitle}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Ready to Transform Your Business with AI?
            </motion.h2>
            <motion.p
              className={styles.ctaDescription}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Join thousands of businesses already automating their workflows with our AI agents and n8n workflows. Start your automation journey today.
            </motion.p>
            
            <motion.div
              className={styles.ctaButtons}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                variant="holographic"
                size="lg"
                className={styles.primaryButton}
              >
                Start Free Trial
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className={styles.secondaryButton}
              >
                View Marketplace
              </Button>
            </motion.div>
          </div>

          <motion.div
            className={styles.ctaFeatures}
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <Zap size={24} />
              </div>
              <div className={styles.featureText}>
                <h4>Instant Setup</h4>
                <p>Deploy in minutes, not months</p>
              </div>
            </div>
            
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <Users size={24} />
              </div>
              <div className={styles.featureText}>
                <h4>24/7 Support</h4>
                <p>Expert help when you need it</p>
              </div>
            </div>
            
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <TrendingUp size={24} />
              </div>
              <div className={styles.featureText}>
                <h4>Scale Fast</h4>
                <p>Grow with enterprise features</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
