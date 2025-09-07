'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import styles from './MarketplaceFilters.module.scss'

const categories = [
  'All Categories',
  'AI Agents',
  'n8n Workflows', 
  'Data Processing',
  'Customer Support',
  'Marketing Automation',
  'DevOps Tools',
  'Analytics'
]

const priceRanges = [
  'All Prices',
  'Free',
  'Under $50',
  '$50 - $100',
  '$100 - $500',
  'Over $500'
]

export const MarketplaceFilters: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedPriceRange, setSelectedPriceRange] = useState('All Prices')
  const [selectedRating, setSelectedRating] = useState(0)

  return (
    <motion.aside 
      className={styles.filters}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.header}>
        <Filter size={20} />
        <h3>Filters</h3>
      </div>

      {/* Categories */}
      <div className={styles.filterSection}>
        <h4 className={styles.sectionTitle}>Category</h4>
        <div className={styles.filterOptions}>
          {categories.map((category) => (
            <motion.button
              key={category}
              className={`${styles.filterOption} ${
                selectedCategory === category ? styles.active : ''
              }`}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className={styles.filterSection}>
        <h4 className={styles.sectionTitle}>Price Range</h4>
        <div className={styles.filterOptions}>
          {priceRanges.map((range) => (
            <motion.button
              key={range}
              className={`${styles.filterOption} ${
                selectedPriceRange === range ? styles.active : ''
              }`}
              onClick={() => setSelectedPriceRange(range)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              {range}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className={styles.filterSection}>
        <h4 className={styles.sectionTitle}>Minimum Rating</h4>
        <div className={styles.ratingFilter}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <motion.button
              key={rating}
              className={`${styles.ratingOption} ${
                selectedRating === rating ? styles.active : ''
              }`}
              onClick={() => setSelectedRating(rating)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < rating ? styles.starFilled : styles.starEmpty}
                  />
                ))}
              </div>
              <span>& up</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        size="sm"
        fullWidth
        onClick={() => {
          setSelectedCategory('All Categories')
          setSelectedPriceRange('All Prices')
          setSelectedRating(0)
        }}
      >
        Clear All Filters
      </Button>
    </motion.aside>
  )
}
