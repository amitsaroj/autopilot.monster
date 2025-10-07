'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus,
  Upload,
  BarChart3,
  DollarSign,
  Package,
  TrendingUp,
  Eye,
  Download,
  Edit,
  Trash2,
  Calendar,
  Star,
  Search,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Users,
  Crown
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Vendor.module.scss'
import  vendorApi  from '@/lib/api/vendor.api'

interface Product {
  id: string
  name: string
  type: 'agent' | 'workflow' | 'tool'
  price: number
  status: 'active' | 'pending' | 'rejected' | 'draft'
  downloads: number
  revenue: number
  rating: number
  reviews: number
  uploadDate: string
  image: string
  description: string
}

// Mock data
const vendorProfile = {
  name: 'TechFlow Solutions',
  avatar: '/api/placeholder/100/100',
  joinDate: '2024-01-15',
  description: 'Leading provider of AI automation solutions for enterprise businesses.',
  verified: true
}

const vendorProducts: Product[] = [
  {
    id: '1',
    name: 'AutoLeadGen Pro Agent',
    type: 'agent',
    price: 149.99,
    status: 'active',
    downloads: 2847,
    revenue: 426553.53,
    rating: 4.8,
    reviews: 234,
    uploadDate: '2024-03-15',
    image: '/api/placeholder/300/200',
    description: 'Advanced lead generation AI agent with ML-powered prospect scoring and automated outreach.'
  },
  {
    id: '2',
    name: 'E-commerce Analytics Workflow',
    type: 'workflow',
    price: 79.99,
    status: 'active',
    downloads: 1563,
    revenue: 124984.37,
    rating: 4.6,
    reviews: 89,
    uploadDate: '2024-04-22',
    image: '/api/placeholder/300/200',
    description: 'Comprehensive e-commerce data analysis and reporting workflow for n8n platform.'
  },
  {
    id: '3',
    name: 'Social Media Automation Suite',
    type: 'tool',
    price: 199.99,
    status: 'pending',
    downloads: 0,
    revenue: 0,
    rating: 0,
    reviews: 0,
    uploadDate: '2024-11-30',
    image: '/api/placeholder/300/200',
    description: 'Complete social media management and automation toolkit with AI-powered content generation.'
  },
  {
    id: '4',
    name: 'Customer Support AI Agent',
    type: 'agent',
    price: 299.99,
    status: 'active',
    downloads: 834,
    revenue: 250191.66,
    rating: 4.9,
    reviews: 156,
    uploadDate: '2024-05-10',
    image: '/api/placeholder/300/200',
    description: 'Intelligent customer support agent with natural language processing and automated ticket routing.'
  }
]

const analytics = {
  totalRevenue: 801729.56,
  totalDownloads: 5244,
  totalProducts: 4,
  averageRating: 4.7
}

export default function VendorPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'analytics' | 'earnings'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'rejected' | 'draft'>('all')
  const [vendorProfileData, setVendorProfileData] = useState(vendorProfile)
  const [products, setProducts] = useState(vendorProducts)
  const [analyticsData, setAnalyticsData] = useState(analytics)
  const [loading, setLoading] = useState(true)

  // Load vendor data from API
  useEffect(() => {
    const loadVendorData = async () => {
      try {
        setLoading(true)
        const [profileResponse, productsResponse, analyticsResponse] = await Promise.all([
          vendorApi.getProfile(),
          vendorApi.getProducts(),
          vendorApi.getAnalytics()
        ])
        
        if (profileResponse.success && profileResponse.data) {
          setVendorProfileData(profileResponse.data)
        }
        
        if (productsResponse.success && productsResponse.products) {
          setProducts(productsResponse.products)
        }
        
        if (analyticsResponse.success && analyticsResponse.data) {
          setAnalyticsData(analyticsResponse.data)
        }
      } catch (error) {
        console.error('Failed to load vendor data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadVendorData()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'active': return '#10b981'
      case 'pending': return '#f59e0b'
      case 'rejected': return '#ef4444'
      case 'draft': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: Product['status']) => {
    switch (status) {
      case 'active': return <CheckCircle size={14} />
      case 'pending': return <Clock size={14} />
      case 'rejected': return <AlertCircle size={14} />
      case 'draft': return <FileText size={14} />
      default: return <FileText size={14} />
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className={styles.vendorPage}>
      <div className="container">
        <motion.div
          className={styles.vendorHeader}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.vendorInfo}>
            <div className={styles.vendorAvatar}>
              <Image
                src={vendorProfile.avatar}
                alt={vendorProfile.name}
                width={80}
                height={80}
                className={styles.avatarImage}
              />
              {vendorProfile.verified && (
                <div className={styles.verifiedBadge}>
                  <CheckCircle size={16} />
                </div>
              )}
            </div>
            <div className={styles.vendorDetails}>
              <h1 className={styles.vendorName}>{vendorProfileData.name}</h1>
              <p className={styles.vendorDescription}>{vendorProfileData.description}</p>
              <div className={styles.vendorMeta}>
                <span className={styles.joinDate}>
                  <Calendar size={14} />
                  Vendor since {new Date(vendorProfileData.joinDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </span>
                <span className={styles.totalProducts}>
                  <Package size={14} />
                  {analyticsData.totalProducts} Products
                </span>
              </div>
            </div>
          </div>
          <div className={styles.vendorActions}>
            <Button variant="primary" size="lg" leftIcon={<Plus size={20} />}>
              Upload New Product
            </Button>
            <Button variant="ghost" size="lg" leftIcon={<Edit size={20} />}>
              Edit Profile
            </Button>
          </div>
        </motion.div>

        <motion.div
          className={styles.statsGrid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className={styles.statCard} variants={itemVariants}>
            <div className={styles.statIcon}>
              <DollarSign size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>${analyticsData.totalRevenue.toLocaleString()}</div>
              <div className={styles.statLabel}>Total Revenue</div>
              <div className={styles.statTrend}>
                <TrendingUp size={12} />
                +23.5%
              </div>
            </div>
          </motion.div>

          <motion.div className={styles.statCard} variants={itemVariants}>
            <div className={styles.statIcon}>
              <Download size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{analyticsData.totalDownloads.toLocaleString()}</div>
              <div className={styles.statLabel}>Total Downloads</div>
              <div className={styles.statTrend}>
                <TrendingUp size={12} />
                +18.7%
              </div>
            </div>
          </motion.div>

          <motion.div className={styles.statCard} variants={itemVariants}>
            <div className={styles.statIcon}>
              <Package size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{analyticsData.totalProducts}</div>
              <div className={styles.statLabel}>Active Products</div>
              <div className={styles.statTrend}>
                <TrendingUp size={12} />
                +2
              </div>
            </div>
          </motion.div>

          <motion.div className={styles.statCard} variants={itemVariants}>
            <div className={styles.statIcon}>
              <Star size={24} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{analyticsData.averageRating}</div>
              <div className={styles.statLabel}>Average Rating</div>
              <div className={styles.statTrend}>
                <TrendingUp size={12} />
                +0.2
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className={styles.vendorContent}>
          <motion.div
            className={styles.tabNavigation}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button
              className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 size={20} />
              Overview
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'products' ? styles.active : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <Package size={20} />
              My Products
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'analytics' ? styles.active : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <TrendingUp size={20} />
              Analytics
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'earnings' ? styles.active : ''}`}
              onClick={() => setActiveTab('earnings')}
            >
              <DollarSign size={20} />
              Earnings
            </button>
          </motion.div>

          <motion.div
            className={styles.tabContent}
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'overview' && (
              <div className={styles.overviewContent}>
                <div className={styles.overviewGrid}>
                  <div className={styles.recentActivity}>
                    <h3 className={styles.sectionTitle}>Recent Performance</h3>
                    <div className={styles.performanceMetrics}>
                      <div className={styles.metric}>
                        <div className={styles.metricLabel}>This Month Revenue</div>
                        <div className={styles.metricValue}>$12,847</div>
                        <div className={styles.metricChange}>+15.3%</div>
                      </div>
                      <div className={styles.metric}>
                        <div className={styles.metricLabel}>This Month Downloads</div>
                        <div className={styles.metricValue}>745</div>
                        <div className={styles.metricChange}>+12.8%</div>
                      </div>
                      <div className={styles.metric}>
                        <div className={styles.metricLabel}>Avg. Rating</div>
                        <div className={styles.metricValue}>4.7</div>
                        <div className={styles.metricChange}>+0.1</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.topProducts}>
                    <h3 className={styles.sectionTitle}>Top Performing Products</h3>
                    <div className={styles.productList}>
                      {products
                        .filter(p => p.status === 'active')
                        .sort((a, b) => b.revenue - a.revenue)
                        .slice(0, 3)
                        .map((product, index) => (
                          <div key={product.id} className={styles.productItem}>
                            <div className={styles.productRank}>#{index + 1}</div>
                            <div className={styles.productInfo}>
                              <div className={styles.productName}>{product.name}</div>
                              <div className={styles.productStats}>
                                {product.downloads} downloads • ${product.revenue.toLocaleString()}
                              </div>
                            </div>
                            <div className={styles.productRating}>
                              <Star size={14} />
                              {product.rating}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className={styles.productsContent}>
                <div className={styles.productsHeader}>
                  <h3 className={styles.sectionTitle}>
                    My Products ({filteredProducts.length})
                  </h3>
                  <div className={styles.productsControls}>
                    <div className={styles.searchBox}>
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'pending' | 'rejected' | 'draft')}
                      className={styles.filterSelect}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="draft">Draft</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <Button variant="primary" size="md" leftIcon={<Plus size={16} />}>
                      Upload New
                    </Button>
                  </div>
                </div>

                <div className={styles.productsList}>
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      className={styles.productCard}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.01, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={styles.productImage}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={120}
                          height={80}
                          className={styles.productImg}
                        />
                        <div className={styles.productType}>{product.type}</div>
                      </div>

                      <div className={styles.productDetails}>
                        <div className={styles.productHeader}>
                          <h4 className={styles.productName}>{product.name}</h4>
                          <div 
                            className={styles.productStatus}
                            style={{ color: getStatusColor(product.status) }}
                          >
                            {getStatusIcon(product.status)}
                            {product.status}
                          </div>
                        </div>
                        <p className={styles.productDescription}>{product.description}</p>
                        <div className={styles.productMeta}>
                          <span className={styles.productPrice}>${product.price}</span>
                          <span className={styles.productDownloads}>
                            <Download size={14} />
                            {product.downloads}
                          </span>
                          {product.rating > 0 && (
                            <span className={styles.productRating}>
                              <Star size={14} />
                              {product.rating} ({product.reviews})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={styles.productActions}>
                        <Button variant="ghost" size="sm" leftIcon={<Eye size={16} />}>
                          View
                        </Button>
                        <Button variant="ghost" size="sm" leftIcon={<Edit size={16} />}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" leftIcon={<Trash2 size={16} />}>
                          Delete
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className={styles.analyticsContent}>
                <h3 className={styles.sectionTitle}>Performance Analytics</h3>
                <div className={styles.analyticsGrid}>
                  <div className={styles.chartCard}>
                    <h4>Revenue Trend</h4>
                    <div className={styles.chartPlaceholder}>
                      <BarChart3 size={48} />
                      <p>Revenue chart visualization would go here</p>
                    </div>
                  </div>
                  <div className={styles.chartCard}>
                    <h4>Download Trend</h4>
                    <div className={styles.chartPlaceholder}>
                      <TrendingUp size={48} />
                      <p>Downloads chart visualization would go here</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className={styles.earningsContent}>
                <div className={styles.earningsHeader}>
                  <h3 className={styles.sectionTitle}>Earnings Summary</h3>
                  <Button variant="primary" size="md" rightIcon={<ArrowRight size={16} />}>
                    Request Payout
                  </Button>
                </div>
                <div className={styles.earningsCards}>
                  <div className={styles.earningCard}>
                    <div className={styles.earningLabel}>Available for Payout</div>
                    <div className={styles.earningValue}>$45,892.34</div>
                  </div>
                  <div className={styles.earningCard}>
                    <div className={styles.earningLabel}>Pending Clearance</div>
                    <div className={styles.earningValue}>$12,847.56</div>
                  </div>
                  <div className={styles.earningCard}>
                    <div className={styles.earningLabel}>Total Lifetime Earnings</div>
                    <div className={styles.earningValue}>${analyticsData.totalRevenue.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
