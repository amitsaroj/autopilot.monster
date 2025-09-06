'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, Quote } from 'lucide-react'
import styles from './Testimonials.module.scss'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    title: 'CTO',
    company: 'TechFlow Solutions',
    avatar: '/api/placeholder/80/80',
    rating: 5,
    text: 'Autopilot.monster has revolutionized our automation strategy. We deployed 15 AI agents in the first month and saw a 300% increase in productivity. The n8n workflows are incredibly powerful and easy to customize.',
    industry: 'Technology'
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    title: 'Operations Director',
    company: 'Global Retail Co.',
    avatar: '/api/placeholder/80/80',
    rating: 5,
    text: 'The customer support AI agent we purchased has reduced our response time from 4 hours to 15 minutes. Our customer satisfaction scores have never been higher. This platform is a game-changer.',
    industry: 'Retail'
  },
  {
    id: 3,
    name: 'Dr. Emily Watson',
    title: 'Founder',
    company: 'HealthTech Innovations',
    avatar: '/api/placeholder/80/80',
    rating: 5,
    text: 'As a healthcare startup, we needed reliable automation without compromising security. Autopilot.monster delivered exactly what we needed. The compliance features and data protection are outstanding.',
    industry: 'Healthcare'
  },
  {
    id: 4,
    name: 'James Thompson',
    title: 'Marketing Director',
    company: 'Growth Marketing Agency',
    avatar: '/api/placeholder/80/80',
    rating: 5,
    text: 'The content creation AI agents have transformed our workflow. We can now produce 10x more content with the same team. The quality is consistently high and the ROI is incredible.',
    industry: 'Marketing'
  },
  {
    id: 5,
    name: 'Lisa Park',
    title: 'Finance Manager',
    company: 'FinTech Dynamics',
    avatar: '/api/placeholder/80/80',
    rating: 5,
    text: 'Our finance automation workflows have eliminated 90% of manual data entry. The accuracy is perfect and we save 20 hours per week. The support team is also incredibly responsive.',
    industry: 'Finance'
  },
  {
    id: 6,
    name: 'David Kumar',
    title: 'CEO',
    company: 'E-commerce Plus',
    avatar: '/api/placeholder/80/80',
    rating: 5,
    text: 'The inventory management AI agent has optimized our stock levels perfectly. We reduced overstock by 40% and increased sales by 25%. The predictive analytics are spot-on.',
    industry: 'E-commerce'
  }
]

export const Testimonials: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className={styles.testimonials} ref={ref}>
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
              <Star size={16} />
              <span>4.9/5 Customer Rating</span>
            </motion.div>
          </div>
          
          <h2 className={styles.sectionTitle}>
            What Our <span className={styles.gradientText}>Customers</span> Say
          </h2>
          <p className={styles.sectionDescription}>
            Don&apos;t just take our word for it. Here&apos;s what our customers have to say about their experience with Autopilot.monster. 
            Join thousands of satisfied businesses already automating their workflows.
          </p>
        </motion.div>

        <motion.div
          className={styles.testimonialsGrid}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className={styles.testimonialCard}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ scale: 1.02, y: -8 }}
            >
              <div className={styles.quoteIcon}>
                <Quote size={24} />
              </div>
              
              <div className={styles.testimonialContent}>
                <div className={styles.rating}>
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={16} className={styles.star} />
                  ))}
                </div>
                <p className={styles.testimonialText}>
                  &quot;{testimonial.text}&quot;
                </p>
              </div>
              
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>
                  <div className={styles.avatarPlaceholder}>
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className={styles.authorInfo}>
                  <h4 className={styles.authorName}>{testimonial.name}</h4>
                  <p className={styles.authorTitle}>{testimonial.title}, {testimonial.company}</p>
                  <p className={styles.authorIndustry}>{testimonial.industry}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.statsRow}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className={styles.statItem}>
            <div className={styles.statNumber}>10,000+</div>
            <div className={styles.statLabel}>Happy Customers</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>4.9/5</div>
            <div className={styles.statLabel}>Average Rating</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>99.9%</div>
            <div className={styles.statLabel}>Uptime</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>24/7</div>
            <div className={styles.statLabel}>Support</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
