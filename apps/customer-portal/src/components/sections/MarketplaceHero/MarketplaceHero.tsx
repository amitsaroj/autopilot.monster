'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, TrendingUp, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import styles from './MarketplaceHero.module.scss'

export const MarketplaceHero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.title}>
            AI Marketplace
            <span className={styles.highlight}>Reimagined</span>
          </h1>
          
          <p className={styles.subtitle}>
            Discover thousands of AI agents and automation workflows. 
            From simple chatbots to complex data processing pipelines.
          </p>

          {/* Search Bar */}
          <motion.div
            className={styles.searchSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.searchBar}>
              <Search className={styles.searchIcon} size={20} />
              <input 
                type="text" 
                placeholder="Search AI agents, workflows, or categories..."
                className={styles.searchInput}
              />
              <Button variant="primary" size="md">
                Search
              </Button>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            className={styles.stats}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className={styles.stat}>
              <TrendingUp className={styles.statIcon} size={16} />
              <span>10,000+ Products</span>
            </div>
            <div className={styles.stat}>
              <Star className={styles.statIcon} size={16} />
              <span>4.9 Avg Rating</span>
            </div>
            <div className={styles.stat}>
              <Filter className={styles.statIcon} size={16} />
              <span>50+ Categories</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Marketplace Cards */}
        <div className={styles.floatingCards}>
          {[
            { title: 'Customer Support Bot', price: '$49', rating: 4.9, category: 'AI Agent' },
            { title: 'Data Pipeline Workflow', price: 'Free', rating: 4.8, category: 'n8n Flow' },
            { title: 'Email Automation', price: '$29', rating: 5.0, category: 'Workflow' },
          ].map((card, index) => (
            <motion.div
              key={card.title}
              className={styles.floatingCard}
              initial={{ opacity: 0, y: 50, rotateY: -30 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.6 + index * 0.2,
                ease: [0.2, 0, 0, 1]
              }}
              whileHover={{ 
                y: -10, 
                rotateY: 5,
                scale: 1.05
              }}
              style={{
                '--delay': `${index * 0.5}s`
              } as React.CSSProperties}
            >
              <div className={styles.cardCategory}>{card.category}</div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <div className={styles.cardMeta}>
                <span className={styles.cardPrice}>{card.price}</span>
                <div className={styles.cardRating}>
                  <Star size={12} />
                  {card.rating}
                </div>
              </div>
              <div className={styles.cardGlow} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
