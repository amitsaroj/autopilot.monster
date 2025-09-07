'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Star,
  Download,
  TrendingUp,
  Clock,
  DollarSign,
  Tag,
  X,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import styles from './Search.module.scss'

// Metadata for search results page
// title: 'Search Results - Autopilot.monster'
// description: 'Find the perfect AI agents, workflows, and automation tools for your business.'

interface SearchResult {
  id: string
  name: string
  description: string
  type: 'agent' | 'workflow' | 'tool'
  category: string
  price: number
  rating: number
  downloads: number
  tags: string[]
  image: string
  vendor: string
  featured: boolean
}

// Mock search results
const mockResults: SearchResult[] = [
  {
    id: '1',
    name: 'AutoLeadGen Pro Agent',
    description: 'Advanced lead generation AI agent with ML-powered prospect scoring and automated outreach.',
    type: 'agent',
    category: 'Sales & Marketing',
    price: 149.99,
    rating: 4.8,
    downloads: 2847,
    tags: ['lead-generation', 'sales', 'automation', 'ai'],
    image: '/api/placeholder/300/200',
    vendor: 'TechFlow Solutions',
    featured: true
  },
  {
    id: '2',
    name: 'E-commerce Analytics Workflow',
    description: 'Comprehensive e-commerce data analysis and reporting workflow for n8n platform.',
    type: 'workflow',
    category: 'Analytics',
    price: 79.99,
    rating: 4.6,
    downloads: 1563,
    tags: ['ecommerce', 'analytics', 'reporting', 'n8n'],
    image: '/api/placeholder/300/200',
    vendor: 'DataBot Inc',
    featured: false
  },
  {
    id: '3',
    name: 'Social Media Automation Suite',
    description: 'Complete social media management and automation toolkit with AI-powered content generation.',
    type: 'tool',
    category: 'Social Media',
    price: 199.99,
    rating: 4.9,
    downloads: 3421,
    tags: ['social-media', 'automation', 'content', 'ai'],
    image: '/api/placeholder/300/200',
    vendor: 'SocialAI Pro',
    featured: true
  },
  {
    id: '4',
    name: 'Customer Support AI Agent',
    description: 'Intelligent customer support agent with natural language processing and automated ticket routing.',
    type: 'agent',
    category: 'Customer Service',
    price: 299.99,
    rating: 4.7,
    downloads: 1892,
    tags: ['support', 'ai', 'automation', 'nlp'],
    image: '/api/placeholder/300/200',
    vendor: 'SupportGenius',
    featured: false
  },
  {
    id: '5',
    name: 'Finance Data Processor',
    description: 'Automated financial data processing and analysis tool with real-time reporting capabilities.',
    type: 'tool',
    category: 'Finance',
    price: 0,
    rating: 4.5,
    downloads: 5632,
    tags: ['finance', 'data', 'automation', 'free'],
    image: '/api/placeholder/300/200',
    vendor: 'FinTech Labs',
    featured: false
  }
]

function SearchPageContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '')
  const [results, setResults] = useState<SearchResult[]>([])
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    price: 'all',
    rating: 0
  })
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate search
  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      if (searchQuery) {
        const filtered = mockResults.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        setResults(filtered)
      } else {
        setResults(mockResults)
      }
      setIsLoading(false)
    }, 800)
  }, [searchQuery])

  // Apply filters
  useEffect(() => {
    let filtered = [...results]

    if (filters.type !== 'all') {
      filtered = filtered.filter(item => item.type === filters.type)
    }
    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category)
    }
    if (filters.price === 'free') {
      filtered = filtered.filter(item => item.price === 0)
    } else if (filters.price === 'paid') {
      filtered = filtered.filter(item => item.price > 0)
    }
    if (filters.rating > 0) {
      filtered = filtered.filter(item => item.rating >= filters.rating)
    }

    // Sort results
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'downloads':
        filtered.sort((a, b) => b.downloads - a.downloads)
        break
      case 'newest':
        // Mock sorting by date
        break
      default: // relevance
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    setFilteredResults(filtered)
  }, [results, filters, sortBy])

  const clearFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      price: 'all',
      rating: 0
    })
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
    <div className={styles.searchPage}>
      <div className="container">
        {/* Search Header */}
        <motion.div
          className={styles.searchHeader}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.searchBox}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search AI agents, workflows, and tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </motion.div>

        {/* Search Results Header */}
        <motion.div
          className={styles.resultsHeader}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.resultsInfo}>
            {isLoading ? (
              <span>Searching...</span>
            ) : (
              <span>
                {filteredResults.length} results
                {searchQuery && ` for "${searchQuery}"`}
              </span>
            )}
          </div>

          <div className={styles.controlsGroup}>
            <button
              className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Filters
              <ChevronDown size={14} />
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Highest Rated</option>
              <option value="downloads">Most Downloads</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>

            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </motion.div>

        <div className={styles.searchContent}>
          {/* Filters Sidebar */}
          <motion.div
            className={`${styles.filtersSidebar} ${showFilters ? styles.visible : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: showFilters ? 1 : 0, x: showFilters ? 0 : -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.filtersHeader}>
              <h3>Filters</h3>
              <button onClick={clearFilters} className={styles.clearFilters}>
                <X size={16} />
                Clear All
              </button>
            </div>

            <div className={styles.filterGroup}>
              <h4>Type</h4>
              <div className={styles.filterOptions}>
                {['all', 'agent', 'workflow', 'tool'].map(type => (
                  <label key={type} className={styles.filterOption}>
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={filters.type === type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    />
                    <span>{type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <h4>Category</h4>
              <div className={styles.filterOptions}>
                {['all', 'Sales & Marketing', 'Analytics', 'Social Media', 'Customer Service', 'Finance'].map(category => (
                  <label key={category} className={styles.filterOption}>
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={filters.category === category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    />
                    <span>{category === 'all' ? 'All Categories' : category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <h4>Price</h4>
              <div className={styles.filterOptions}>
                {[
                  { value: 'all', label: 'All Prices' },
                  { value: 'free', label: 'Free' },
                  { value: 'paid', label: 'Paid' }
                ].map(option => (
                  <label key={option.value} className={styles.filterOption}>
                    <input
                      type="radio"
                      name="price"
                      value={option.value}
                      checked={filters.price === option.value}
                      onChange={(e) => setFilters(prev => ({ ...prev, price: e.target.value }))}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <h4>Minimum Rating</h4>
              <div className={styles.ratingFilter}>
                {[4, 3, 2, 1].map(rating => (
                  <button
                    key={rating}
                    className={`${styles.ratingButton} ${filters.rating === rating ? styles.active : ''}`}
                    onClick={() => setFilters(prev => ({ ...prev, rating: rating }))}
                  >
                    <Star size={16} />
                    {rating}+ Stars
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Search Results */}
          <div className={styles.resultsContainer}>
            {isLoading ? (
              <div className={styles.loadingState}>
                <motion.div
                  className={styles.loadingSpinner}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Search size={32} />
                </motion.div>
                <p>Searching for the perfect solutions...</p>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className={styles.emptyState}>
                <Search size={48} />
                <h3>No results found</h3>
                <p>Try adjusting your search terms or filters</p>
                <Button variant="primary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <motion.div
                className={`${styles.resultsGrid} ${viewMode === 'list' ? styles.listView : ''}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredResults.map((result) => (
                  <motion.div
                    key={result.id}
                    className={styles.resultCard}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {result.featured && (
                      <div className={styles.featuredBadge}>
                        <TrendingUp size={12} />
                        Featured
                      </div>
                    )}

                    <div className={styles.resultImage}>
                      <Image
                        src={result.image}
                        alt={result.name}
                        width={300}
                        height={200}
                        className={styles.image}
                      />
                      <div className={styles.typeBadge}>{result.type}</div>
                    </div>

                    <div className={styles.resultContent}>
                      <div className={styles.resultHeader}>
                        <h3 className={styles.resultTitle}>
                          <Link href={`/product/${result.id}`}>{result.name}</Link>
                        </h3>
                        <div className={styles.resultMeta}>
                          <span className={styles.vendor}>{result.vendor}</span>
                          <span className={styles.category}>{result.category}</span>
                        </div>
                      </div>

                      <p className={styles.resultDescription}>{result.description}</p>

                      <div className={styles.resultTags}>
                        {result.tags.slice(0, 3).map(tag => (
                          <span key={tag} className={styles.tag}>
                            <Tag size={12} />
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className={styles.resultFooter}>
                        <div className={styles.resultStats}>
                          <div className={styles.rating}>
                            <Star size={14} />
                            {result.rating}
                          </div>
                          <div className={styles.downloads}>
                            <Download size={14} />
                            {result.downloads.toLocaleString()}
                          </div>
                        </div>
                        <div className={styles.resultPrice}>
                          {result.price === 0 ? (
                            <span className={styles.freePrice}>Free</span>
                          ) : (
                            <span className={styles.paidPrice}>
                              <DollarSign size={16} />
                              {result.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}
