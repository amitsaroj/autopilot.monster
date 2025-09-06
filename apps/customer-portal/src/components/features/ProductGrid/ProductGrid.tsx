'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star, Download, Eye, Bot, Workflow, Zap, Heart, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import styles from './ProductGrid.module.scss'

const mockProducts = [
  {
    id: 1,
    title: 'Customer Support AI Agent',
    description: 'Intelligent customer support automation with natural language processing',
    price: 49,
    rating: 4.9,
    downloads: 2150,
    category: 'AI Agent',
    tags: ['Customer Support', 'NLP', 'Automation'],
    thumbnail: '/api/placeholder/300/200',
    badge: '🔥 Trending',
    type: 'ai-agent'
  },
  {
    id: 2,
    title: 'Data Pipeline Workflow',
    description: 'Complete ETL pipeline for data processing and analytics',
    price: 0,
    rating: 4.8,
    downloads: 5420,
    category: 'n8n Workflow',
    tags: ['Data', 'ETL', 'Analytics'],
    thumbnail: '/api/placeholder/300/200',
    badge: '⚡ Free',
    type: 'workflow'
  },
  {
    id: 3,
    title: 'Email Marketing Automation',
    description: 'Automated email campaigns with advanced segmentation',
    price: 29,
    rating: 5.0,
    downloads: 1820,
    category: 'Marketing',
    tags: ['Email', 'Marketing', 'Automation'],
    thumbnail: '/api/placeholder/300/200',
    badge: '⭐ Top Rated',
    type: 'workflow'
  },
  {
    id: 4,
    title: 'Code Review Assistant',
    description: 'AI-powered code review and suggestion system',
    price: 79,
    rating: 4.7,
    downloads: 980,
    category: 'DevOps',
    tags: ['Code Review', 'AI', 'Development'],
    thumbnail: '/api/placeholder/300/200',
    type: 'ai-agent'
  },
  {
    id: 5,
    title: 'Social Media Manager',
    description: 'Automated social media posting and engagement tracking',
    price: 39,
    rating: 4.6,
    downloads: 3250,
    category: 'Marketing',
    tags: ['Social Media', 'Content', 'Analytics'],
    thumbnail: '/api/placeholder/300/200',
    type: 'workflow'
  },
  {
    id: 6,
    title: 'Document Processing Bot',
    description: 'Extract and process data from various document formats',
    price: 59,
    rating: 4.8,
    downloads: 1650,
    category: 'AI Agent',
    tags: ['Documents', 'OCR', 'Processing'],
    thumbnail: '/api/placeholder/300/200',
    type: 'ai-agent'
  }
]

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.2, 0, 0, 1] }
}

export const ProductGrid: React.FC = () => {
  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price}`
  }

  const formatDownloads = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
    return count.toString()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ai-agent':
        return <Bot size={16} />
      case 'workflow':
        return <Workflow size={16} />
      default:
        return <Zap size={16} />
    }
  }

  return (
    <div className={styles.productGrid}>
      <div className={styles.header}>
        <h2 className={styles.title}>Featured Products</h2>
        <div className={styles.sortOptions}>
          <select className={styles.sortSelect}>
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="rating">Highest Rated</option>
            <option value="downloads">Most Downloaded</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <motion.div 
        className={styles.grid}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {mockProducts.map((product) => (
          <motion.div
            key={product.id}
            className={styles.productCard}
            variants={staggerItem}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            {/* Product Image */}
            <div className={styles.imageContainer}>
              <div className={styles.productImage}>
                <div className={styles.placeholderImage}>
                  {getTypeIcon(product.type)}
                  <span>{product.category}</span>
                </div>
              </div>
              
              {/* Badge */}
              {product.badge && (
                <div className={styles.badge}>
                  {product.badge}
                </div>
              )}

              {/* Overlay Actions */}
              <div className={styles.overlay}>
                <Button variant="ghost" size="sm">
                  <Eye size={16} />
                  Preview
                </Button>
              </div>

              {/* Quick Actions */}
              <div className={styles.quickActions}>
                <motion.button
                  className={styles.quickAction}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart size={16} />
                </motion.button>
              </div>
            </div>

            {/* Product Info */}
            <div className={styles.productInfo}>
              <div className={styles.productHeader}>
                <h3 className={styles.productTitle}>{product.title}</h3>
                <div className={styles.productPrice}>
                  {formatPrice(product.price)}
                </div>
              </div>

              <p className={styles.productDescription}>
                {product.description}
              </p>

              {/* Tags */}
              <div className={styles.tags}>
                {product.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
                {product.tags.length > 2 && (
                  <span className={styles.tagMore}>
                    +{product.tags.length - 2}
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <Star size={14} />
                  <span>{product.rating}</span>
                </div>
                <div className={styles.stat}>
                  <Download size={14} />
                  <span>{formatDownloads(product.downloads)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                <Button 
                  variant={product.price === 0 ? 'neural' : 'primary'}
                  fullWidth
                  leftIcon={product.price === 0 ? <Download size={16} /> : <ShoppingCart size={16} />}
                >
                  {product.price === 0 ? 'Download' : 'Add to Cart'}
                </Button>
              </div>
            </div>

            {/* Glow effect */}
            <div className={styles.cardGlow} />
          </motion.div>
        ))}
      </motion.div>

      {/* Load More */}
      <div className={styles.loadMore}>
        <Button variant="outline" size="lg">
          Load More Products
        </Button>
      </div>
    </div>
  )
}
