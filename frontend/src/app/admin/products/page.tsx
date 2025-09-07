'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash, 
  Eye,
  Star,
  Download,
  DollarSign,
  TrendingUp,
  Plus,
  Upload,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import { Container } from '@/components/ui/Container/Container'
import styles from './AdminProducts.module.scss'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const products = [
  {
    id: 1,
    title: 'AI Customer Service Agent',
    category: 'AI Agents',
    vendor: 'TechCorp Solutions',
    price: '$299',
    type: 'paid',
    status: 'published',
    rating: 4.8,
    downloads: 1250,
    revenue: '$373,750',
    publishedDate: '2024-01-15',
    lastUpdated: '2024-02-01',
    image: '/products/ai-customer-service.jpg',
    tags: ['AI', 'Customer Service', 'Automation']
  },
  {
    id: 2,
    title: 'E-commerce Automation Workflow',
    category: 'N8N Workflows',
    vendor: 'Automation Pro',
    price: 'Free',
    type: 'free',
    status: 'published',
    rating: 4.6,
    downloads: 3420,
    revenue: '$0',
    publishedDate: '2024-01-08',
    lastUpdated: '2024-01-28',
    image: '/products/ecommerce-workflow.jpg',
    tags: ['E-commerce', 'N8N', 'Free']
  },
  {
    id: 3,
    title: 'Advanced Analytics Dashboard',
    category: 'Templates',
    vendor: 'DataViz Masters',
    price: '$149',
    type: 'paid',
    status: 'pending',
    rating: 0,
    downloads: 0,
    revenue: '$0',
    publishedDate: null,
    lastUpdated: '2024-02-05',
    image: '/products/analytics-dashboard.jpg',
    tags: ['Analytics', 'Dashboard', 'Templates']
  },
  {
    id: 4,
    title: 'Social Media Manager Bot',
    category: 'AI Agents',
    vendor: 'Social Automation Inc',
    price: '$199',
    type: 'paid',
    status: 'rejected',
    rating: 0,
    downloads: 0,
    revenue: '$0',
    publishedDate: null,
    lastUpdated: '2024-02-03',
    image: '/products/social-media-bot.jpg',
    tags: ['Social Media', 'AI', 'Marketing']
  },
  {
    id: 5,
    title: 'Email Marketing Automation',
    category: 'N8N Workflows',
    vendor: 'Marketing Masters',
    price: '$79',
    type: 'paid',
    status: 'published',
    rating: 4.9,
    downloads: 890,
    revenue: '$70,310',
    publishedDate: '2024-01-20',
    lastUpdated: '2024-01-30',
    image: '/products/email-marketing.jpg',
    tags: ['Email', 'Marketing', 'Automation']
  }
]

const stats = [
  {
    label: 'Total Products',
    value: '1,247',
    change: '+23.1%',
    icon: Package,
    color: 'blue'
  },
  {
    label: 'Published',
    value: '1,089',
    change: '+18.5%',
    icon: CheckCircle,
    color: 'green'
  },
  {
    label: 'Pending Review',
    value: '127',
    change: '+45.2%',
    icon: Clock,
    color: 'orange'
  },
  {
    label: 'Total Revenue',
    value: '$2.4M',
    change: '+31.7%',
    icon: DollarSign,
    color: 'purple'
  }
]

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedProducts, setSelectedProducts] = React.useState<number[]>([])

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAll = () => {
    setSelectedProducts(selectedProducts.length === products.length ? [] : products.map(p => p.id))
  }

  return (
    <div className={styles.adminProductsPage}>
      <Container>
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          {/* Header */}
          <motion.div className={styles.header} variants={fadeInUp}>
            <div className={styles.headerContent}>
              <div className={styles.headerText}>
                <h1>Product Management</h1>
                <p>Manage marketplace products, reviews, and vendor submissions</p>
              </div>
              <div className={styles.headerActions}>
                <Button variant="outline" size="sm">
                  <Upload size={16} />
                  Import
                </Button>
                <Button variant="primary" size="sm">
                  <Plus size={16} />
                  Add Product
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div className={styles.stats} variants={fadeInUp}>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`${styles.statCard} ${styles[stat.color]}`}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.statIcon}>
                  <stat.icon size={24} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                  <div className={styles.statChange}>{stat.change}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div className={styles.filters} variants={fadeInUp}>
            <div className={styles.searchBox}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search products by title, vendor, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.filterButtons}>
              <Button variant="outline" size="sm">
                <Filter size={16} />
                All Products
              </Button>
              <Button variant="outline" size="sm">
                <CheckCircle size={16} />
                Published
              </Button>
              <Button variant="outline" size="sm">
                <Clock size={16} />
                Pending
              </Button>
              <Button variant="outline" size="sm">
                <XCircle size={16} />
                Rejected
              </Button>
            </div>
          </motion.div>

          {/* Products Grid */}
          <motion.div className={styles.productsGrid} variants={fadeInUp}>
            {products.map((product) => (
              <motion.div
                key={product.id}
                className={styles.productCard}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.productImage}>
                  <img src={product.image} alt={product.title} />
                  <div className={styles.productBadges}>
                    <span className={`${styles.typeBadge} ${styles[product.type]}`}>
                      {product.type === 'free' ? 'Free' : product.price}
                    </span>
                    <span className={`${styles.statusBadge} ${styles[product.status]}`}>
                      {product.status === 'published' && <CheckCircle size={12} />}
                      {product.status === 'pending' && <Clock size={12} />}
                      {product.status === 'rejected' && <XCircle size={12} />}
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </div>
                  <div className={styles.productActions}>
                    <Button variant="ghost" size="sm">
                      <Eye size={16} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className={styles.productContent}>
                  <div className={styles.productHeader}>
                    <h3>{product.title}</h3>
                    <span className={styles.category}>{product.category}</span>
                  </div>
                  
                  <div className={styles.productVendor}>
                    <span>by {product.vendor}</span>
                  </div>
                  
                  <div className={styles.productTags}>
                    {product.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className={styles.productStats}>
                    <div className={styles.statGroup}>
                      <div className={styles.stat}>
                        <Star size={14} />
                        <span>{product.rating > 0 ? product.rating : 'N/A'}</span>
                      </div>
                      <div className={styles.stat}>
                        <Download size={14} />
                        <span>{product.downloads.toLocaleString()}</span>
                      </div>
                      <div className={styles.stat}>
                        <DollarSign size={14} />
                        <span>{product.revenue}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.productDates}>
                    {product.publishedDate && (
                      <div className={styles.date}>
                        Published: {product.publishedDate}
                      </div>
                    )}
                    <div className={styles.date}>
                      Updated: {product.lastUpdated}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </div>
  )
}
