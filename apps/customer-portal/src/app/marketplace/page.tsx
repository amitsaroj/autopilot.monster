'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/Button/Button'
import { 
  Search,
  Filter,
  Grid,
  List,
  Star,
  Download,
  Eye,
  Heart,
  Bot,
  Workflow,
  Code,
  Database,
  Zap,
  TrendingUp,
  Clock,
  Users,
  ArrowRight,
  SlidersHorizontal,
  SortAsc,
  SortDesc
} from 'lucide-react'
import styles from './Marketplace.module.scss'

const categories = [
  { id: 'all', name: 'All Products', count: 5840, icon: Grid },
  { id: 'ai-agents', name: 'AI Agents', count: 1250, icon: Bot },
  { id: 'workflows', name: 'n8n Workflows', count: 890, icon: Workflow },
  { id: 'templates', name: 'Templates', count: 450, icon: Code },
  { id: 'integrations', name: 'Integrations', count: 1200, icon: Database }
]

const sortOptions = [
  { id: 'popular', name: 'Most Popular', icon: TrendingUp },
  { id: 'newest', name: 'Newest', icon: Clock },
  { id: 'rating', name: 'Highest Rated', icon: Star },
  { id: 'downloads', name: 'Most Downloaded', icon: Download },
  { id: 'price-low', name: 'Price: Low to High', icon: SortAsc },
  { id: 'price-high', name: 'Price: High to Low', icon: SortDesc }
]

const products = [
  {
    id: 1,
    name: 'Customer Support AI Agent',
    category: 'AI Agents',
    description: 'Advanced AI agent that handles customer inquiries with natural language processing and sentiment analysis.',
    image: '/api/placeholder/400/300',
    rating: 4.9,
    reviews: 1247,
    downloads: 15420,
    price: 199,
    isFree: false,
    isPopular: true,
    isTrending: true,
    tags: ['Customer Service', 'NLP', 'Sentiment Analysis'],
    vendor: 'AI Solutions Inc.',
    lastUpdated: '2 days ago'
  },
  {
    id: 2,
    name: 'Email Marketing Automation',
    category: 'n8n Workflows',
    description: 'Complete email marketing automation workflow with segmentation, personalization, and analytics.',
    image: '/api/placeholder/400/300',
    rating: 4.8,
    reviews: 892,
    downloads: 12850,
    price: 0,
    isFree: true,
    isPopular: false,
    isTrending: true,
    tags: ['Email Marketing', 'Automation', 'Analytics'],
    vendor: 'Marketing Pro',
    lastUpdated: '1 week ago'
  },
  {
    id: 3,
    name: 'Sales Lead Processing Bot',
    category: 'AI Agents',
    description: 'Intelligent lead qualification and processing agent that scores and routes leads automatically.',
    image: '/api/placeholder/400/300',
    rating: 4.7,
    reviews: 634,
    downloads: 9650,
    price: 149,
    isFree: false,
    isPopular: false,
    isTrending: false,
    tags: ['Sales', 'Lead Generation', 'CRM'],
    vendor: 'SalesTech',
    lastUpdated: '3 days ago'
  },
  {
    id: 4,
    name: 'Social Media Manager',
    category: 'n8n Workflows',
    description: 'Automated social media posting, engagement tracking, and content scheduling across platforms.',
    image: '/api/placeholder/400/300',
    rating: 4.6,
    reviews: 1156,
    downloads: 22100,
    price: 0,
    isFree: true,
    isPopular: true,
    isTrending: false,
    tags: ['Social Media', 'Content', 'Scheduling'],
    vendor: 'SocialFlow',
    lastUpdated: '5 days ago'
  },
  {
    id: 5,
    name: 'Invoice Processing AI',
    category: 'AI Agents',
    description: 'AI-powered invoice processing with OCR, data extraction, and automated approval workflows.',
    image: '/api/placeholder/400/300',
    rating: 4.8,
    reviews: 423,
    downloads: 8750,
    price: 299,
    isFree: false,
    isPopular: false,
    isTrending: true,
    tags: ['Finance', 'OCR', 'Automation'],
    vendor: 'FinanceAI',
    lastUpdated: '1 day ago'
  },
  {
    id: 6,
    name: 'Data Sync & Backup',
    category: 'n8n Workflows',
    description: 'Automated data synchronization and backup workflows for business-critical information.',
    image: '/api/placeholder/400/300',
    rating: 4.9,
    reviews: 789,
    downloads: 12300,
    price: 0,
    isFree: true,
    isPopular: false,
    isTrending: false,
    tags: ['Data', 'Backup', 'Sync'],
    vendor: 'DataFlow',
    lastUpdated: '4 days ago'
  },
  {
    id: 7,
    name: 'Content Generation AI',
    category: 'AI Agents',
    description: 'AI-powered content generation for blogs, social media, and marketing materials.',
    image: '/api/placeholder/400/300',
    rating: 4.5,
    reviews: 567,
    downloads: 11200,
    price: 179,
    isFree: false,
    isPopular: true,
    isTrending: true,
    tags: ['Content', 'Writing', 'Marketing'],
    vendor: 'ContentAI',
    lastUpdated: '6 days ago'
  },
  {
    id: 8,
    name: 'HR Recruitment Workflow',
    category: 'n8n Workflows',
    description: 'Automated recruitment workflow with candidate screening, interview scheduling, and feedback collection.',
    image: '/api/placeholder/400/300',
    rating: 4.7,
    reviews: 334,
    downloads: 6800,
    price: 0,
    isFree: true,
    isPopular: false,
    isTrending: false,
    tags: ['HR', 'Recruitment', 'Automation'],
    vendor: 'HRTech',
    lastUpdated: '1 week ago'
  }
]

export default function MarketplacePage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category.toLowerCase().includes(activeCategory.replace('-', ' '))
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads
      case 'newest':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      case 'rating':
        return b.rating - a.rating
      case 'downloads':
        return b.downloads - a.downloads
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      default:
        return 0
    }
  })

  return (
    <div className={styles.marketplacePage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className="container">
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className={styles.badge}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Zap size={16} />
                <span>5,840+ Products Available</span>
              </motion.div>

              <h1 className={styles.heroTitle}>
                Discover <span className={styles.gradientText}>AI Solutions</span> That Transform Your Business
              </h1>
              
              <p className={styles.heroDescription}>
                Browse our comprehensive marketplace of AI agents, n8n workflows, and automation templates. 
                Find the perfect solution to streamline your operations and boost productivity.
              </p>

              {/* Search Bar */}
              <motion.div
                className={styles.searchContainer}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className={styles.searchBar}>
                  <Search size={20} className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search for AI agents, workflows, or templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                  <Button variant="primary" size="sm">
                    Search
                  </Button>
                </div>
              </motion.div>

              <div className={styles.heroStats}>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>5,840+</div>
                  <div className={styles.statLabel}>Total Products</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>2,100+</div>
                  <div className={styles.statLabel}>Free Products</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>50,000+</div>
                  <div className={styles.statLabel}>Downloads</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>4.8</div>
                  <div className={styles.statLabel}>Avg Rating</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters and Categories */}
        <section className={styles.filtersSection} ref={ref}>
          <div className="container">
            <motion.div
              className={styles.filtersHeader}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.filtersLeft}>
                <h2 className={styles.filtersTitle}>Browse Products</h2>
                <p className={styles.filtersDescription}>
                  {sortedProducts.length} products found
                </p>
              </div>

              <div className={styles.filtersRight}>
                <button
                  className={styles.filterToggle}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal size={20} />
                  <span>Filters</span>
                </button>

                <div className={styles.viewControls}>
                  <button
                    className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div
              className={styles.categories}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`${styles.categoryButton} ${activeCategory === category.id ? styles.active : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <category.icon size={20} />
                  <span>{category.name}</span>
                  <span className={styles.categoryCount}>({category.count})</span>
                </button>
              ))}
            </motion.div>

            {/* Sort Options */}
            <motion.div
              className={styles.sortSection}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className={styles.sortLabel}>Sort by:</div>
              <div className={styles.sortOptions}>
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`${styles.sortOption} ${sortBy === option.id ? styles.active : ''}`}
                    onClick={() => setSortBy(option.id)}
                  >
                    <option.icon size={16} />
                    <span>{option.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Products Grid */}
        <section className={styles.productsSection}>
          <div className="container">
            <motion.div
              className={`${styles.productsGrid} ${viewMode === 'list' ? styles.listView : ''}`}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {sortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className={styles.productCard}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -8 }}
                >
                  <div className={styles.productImage}>
                    <div className={styles.imagePlaceholder}>
                      {product.category === 'AI Agents' ? <Bot size={40} /> : <Workflow size={40} />}
                    </div>
                    
                    <div className={styles.productBadges}>
                      {product.isPopular && (
                        <div className={styles.popularBadge}>
                          <TrendingUp size={12} />
                          <span>Popular</span>
                        </div>
                      )}
                      {product.isTrending && (
                        <div className={styles.trendingBadge}>
                          <Zap size={12} />
                          <span>Trending</span>
                        </div>
                      )}
                      {product.isFree && (
                        <div className={styles.freeBadge}>
                          <span>Free</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.productActions}>
                      <button className={styles.actionButton}>
                        <Heart size={16} />
                      </button>
                      <button className={styles.actionButton}>
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>

                  <div className={styles.productContent}>
                    <div className={styles.productCategory}>{product.category}</div>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productDescription}>{product.description}</p>

                    <div className={styles.productTags}>
                      {product.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className={styles.productStats}>
                      <div className={styles.stat}>
                        <Star size={16} />
                        <span>{product.rating}</span>
                        <span className={styles.statLabel}>({product.reviews})</span>
                      </div>
                      <div className={styles.stat}>
                        <Download size={16} />
                        <span>{product.downloads.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className={styles.productFooter}>
                      <div className={styles.vendorInfo}>
                        <span className={styles.vendorName}>{product.vendor}</span>
                        <span className={styles.lastUpdated}>{product.lastUpdated}</span>
                      </div>
                      <div className={styles.productPricing}>
                        {product.isFree ? (
                          <div className={styles.freePrice}>Free</div>
                        ) : (
                          <div className={styles.paidPrice}>${product.price}/mo</div>
                        )}
                      </div>
                    </div>

                    <div className={styles.productActions}>
                      <Button variant="primary" size="sm" className={styles.downloadButton}>
                        {product.isFree ? 'Download' : 'Get Started'}
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {sortedProducts.length === 0 && (
              <motion.div
                className={styles.noResults}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className={styles.noResultsIcon}>
                  <Search size={48} />
                </div>
                <h3>No products found</h3>
                <p>Try adjusting your search criteria or browse our categories</p>
                <Button variant="ghost" onClick={() => {
                  setSearchQuery('')
                  setActiveCategory('all')
                }}>
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>
        </section>
    </div>
  )
}