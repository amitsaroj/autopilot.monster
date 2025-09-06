'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'
import { Button } from '@/components/ui/Button/Button'
import { 
  Bot, 
  Workflow, 
  Zap, 
  Code, 
  Database, 
  Shield,
  ArrowRight,
  Check,
  Star,
  Users,
  TrendingUp,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react'
import styles from './Services.module.scss'

const serviceCategories = [
  {
    id: 'ai-agents',
    name: 'AI Agents',
    icon: Bot,
    description: 'Intelligent agents that automate complex tasks and decision-making processes.',
    color: 'primary',
    count: 1250
  },
  {
    id: 'workflows',
    name: 'n8n Workflows',
    icon: Workflow,
    description: 'Visual automation workflows that connect apps and services seamlessly.',
    color: 'neural',
    count: 890
  },
  {
    id: 'templates',
    name: 'Templates',
    icon: Code,
    description: 'Pre-built automation templates for common business processes.',
    color: 'cyber',
    count: 450
  },
  {
    id: 'integrations',
    name: 'Integrations',
    icon: Database,
    description: 'Connect with 1000+ apps and services through our integration library.',
    color: 'accent',
    count: 1200
  }
]

const featuredServices = [
  {
    id: 1,
    name: 'Customer Support AI',
    category: 'AI Agents',
    description: 'Advanced AI agent that handles customer inquiries, provides instant responses, and escalates complex issues to human agents.',
    features: ['24/7 Availability', 'Multi-language Support', 'Sentiment Analysis', 'CRM Integration'],
    rating: 4.9,
    downloads: 15420,
    price: 199,
    isPopular: true,
    image: '/api/placeholder/400/300'
  },
  {
    id: 2,
    name: 'Email Marketing Automation',
    category: 'n8n Workflows',
    description: 'Complete email marketing automation workflow with segmentation, personalization, and analytics.',
    features: ['List Segmentation', 'A/B Testing', 'Analytics Dashboard', 'Template Library'],
    rating: 4.8,
    downloads: 12850,
    price: 0,
    isPopular: false,
    image: '/api/placeholder/400/300'
  },
  {
    id: 3,
    name: 'Sales Lead Processing',
    category: 'AI Agents',
    description: 'Intelligent lead qualification and processing agent that scores and routes leads automatically.',
    features: ['Lead Scoring', 'Auto Assignment', 'Follow-up Scheduling', 'Pipeline Updates'],
    rating: 4.7,
    downloads: 9650,
    price: 149,
    isPopular: false,
    image: '/api/placeholder/400/300'
  },
  {
    id: 4,
    name: 'Social Media Manager',
    category: 'n8n Workflows',
    description: 'Automated social media posting, engagement tracking, and content scheduling across platforms.',
    features: ['Multi-platform Posting', 'Content Calendar', 'Engagement Tracking', 'Hashtag Optimization'],
    rating: 4.6,
    downloads: 22100,
    price: 0,
    isPopular: true,
    image: '/api/placeholder/400/300'
  },
  {
    id: 5,
    name: 'Invoice Processing Bot',
    category: 'AI Agents',
    description: 'AI-powered invoice processing with OCR, data extraction, and automated approval workflows.',
    features: ['OCR Processing', 'Data Validation', 'Approval Workflows', 'ERP Integration'],
    rating: 4.8,
    downloads: 8750,
    price: 299,
    isPopular: false,
    image: '/api/placeholder/400/300'
  },
  {
    id: 6,
    name: 'Data Sync & Backup',
    category: 'n8n Workflows',
    description: 'Automated data synchronization and backup workflows for business-critical information.',
    features: ['Real-time Sync', 'Automated Backups', 'Data Validation', 'Error Handling'],
    rating: 4.9,
    downloads: 12300,
    price: 0,
    isPopular: false,
    image: '/api/placeholder/400/300'
  }
]

const filters = [
  { id: 'all', name: 'All Services', count: 5840 },
  { id: 'ai-agents', name: 'AI Agents', count: 1250 },
  { id: 'workflows', name: 'n8n Workflows', count: 890 },
  { id: 'templates', name: 'Templates', count: 450 },
  { id: 'integrations', name: 'Integrations', count: 1200 },
  { id: 'free', name: 'Free', count: 2100 },
  { id: 'premium', name: 'Premium', count: 3740 }
]

export default function ServicesPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeFilter, setActiveFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredServices = activeFilter === 'all' 
    ? featuredServices 
    : featuredServices.filter(service => 
        service.category.toLowerCase().includes(activeFilter.replace('-', ' ')) ||
        (activeFilter === 'free' && service.price === 0) ||
        (activeFilter === 'premium' && service.price > 0)
      )

  return (
    <>
      <Navigation />
      <main className={styles.servicesPage}>
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
                <span>5,840+ Services Available</span>
              </motion.div>

              <h1 className={styles.heroTitle}>
                AI-Powered <span className={styles.gradientText}>Services</span> for Every Business
              </h1>
              
              <p className={styles.heroDescription}>
                Discover our comprehensive collection of AI agents, n8n workflows, and automation templates. 
                From customer support to data processing, we have the perfect solution for your business needs.
              </p>

              <div className={styles.heroStats}>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>5,840+</div>
                  <div className={styles.statLabel}>Total Services</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>1,250+</div>
                  <div className={styles.statLabel}>AI Agents</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>890+</div>
                  <div className={styles.statLabel}>n8n Workflows</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>50,000+</div>
                  <div className={styles.statLabel}>Downloads</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className={styles.categories} ref={ref}>
          <div className="container">
            <motion.div
              className={styles.sectionHeader}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={styles.sectionTitle}>Service Categories</h2>
              <p className={styles.sectionDescription}>
                Explore our organized collection of automation services across different categories.
              </p>
            </motion.div>

            <motion.div
              className={styles.categoriesGrid}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {serviceCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  className={`${styles.categoryCard} ${styles[category.color]}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -8 }}
                >
                  <div className={styles.categoryIcon}>
                    <category.icon size={32} />
                  </div>
                  <h3 className={styles.categoryName}>{category.name}</h3>
                  <p className={styles.categoryDescription}>{category.description}</p>
                  <div className={styles.categoryCount}>{category.count} Services</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className={styles.servicesSection}>
          <div className="container">
            <motion.div
              className={styles.sectionHeader}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={styles.sectionTitle}>Featured Services</h2>
              <p className={styles.sectionDescription}>
                Handpicked services that deliver exceptional results for businesses worldwide.
              </p>
            </motion.div>

            {/* Filters */}
            <motion.div
              className={styles.filters}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={styles.filterTabs}>
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    className={`${styles.filterTab} ${activeFilter === filter.id ? styles.active : ''}`}
                    onClick={() => setActiveFilter(filter.id)}
                  >
                    {filter.name}
                    <span className={styles.filterCount}>({filter.count})</span>
                  </button>
                ))}
              </div>

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
            </motion.div>

            {/* Services Grid */}
            <motion.div
              className={`${styles.servicesGrid} ${viewMode === 'list' ? styles.listView : ''}`}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  className={styles.serviceCard}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -8 }}
                >
                  <div className={styles.serviceImage}>
                    <div className={styles.imagePlaceholder}>
                      {service.category === 'AI Agents' ? <Bot size={40} /> : <Workflow size={40} />}
                    </div>
                    {service.isPopular && (
                      <div className={styles.popularBadge}>
                        <Star size={14} />
                        <span>Popular</span>
                      </div>
                    )}
                    {service.price === 0 && (
                      <div className={styles.freeBadge}>
                        <span>Free</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.serviceContent}>
                    <div className={styles.serviceCategory}>{service.category}</div>
                    <h3 className={styles.serviceName}>{service.name}</h3>
                    <p className={styles.serviceDescription}>{service.description}</p>

                    <div className={styles.serviceFeatures}>
                      {service.features.slice(0, 2).map((feature, idx) => (
                        <div key={idx} className={styles.feature}>
                          <Check size={14} />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {service.features.length > 2 && (
                        <div className={styles.moreFeatures}>
                          +{service.features.length - 2} more features
                        </div>
                      )}
                    </div>

                    <div className={styles.serviceStats}>
                      <div className={styles.stat}>
                        <Star size={16} />
                        <span>{service.rating}</span>
                      </div>
                      <div className={styles.stat}>
                        <Users size={16} />
                        <span>{service.downloads.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className={styles.serviceFooter}>
                      <div className={styles.pricing}>
                        {service.price === 0 ? (
                          <div className={styles.freePrice}>Free</div>
                        ) : (
                          <div className={styles.paidPrice}>${service.price}/mo</div>
                        )}
                      </div>
                      <Button variant="primary" size="sm">
                        {service.price === 0 ? 'Download' : 'Get Started'}
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className={styles.sectionFooter}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button variant="ghost" size="lg">
                View All Services
                <ArrowRight size={20} />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
