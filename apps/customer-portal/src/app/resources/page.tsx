'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Download, 
  Star, 
  Clock, 
  User, 
  Tag, 
  Search,
  Filter,
  BookOpen,
  Video,
  ExternalLink,
  CheckCircle,
  TrendingUp,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import { Container } from '@/components/ui/Container/Container'
import styles from './Resources.module.scss'

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

// const metadata = {
//   title: 'Resources & Knowledge Hub | AutoPilot Monster',
//   description: 'Access whitepapers, case studies, guides, and educational content to maximize your AI automation success.',
//   keywords: 'AI resources, automation guides, whitepapers, case studies, tutorials, documentation'
// }

const categories = [
  { id: 'all', label: 'All Resources', count: 127 },
  { id: 'whitepapers', label: 'Whitepapers', count: 24 },
  { id: 'case-studies', label: 'Case Studies', count: 18 },
  { id: 'guides', label: 'Guides', count: 32 },
  { id: 'templates', label: 'Templates', count: 28 },
  { id: 'videos', label: 'Videos', count: 25 }
]

const featuredResources = [
  {
    id: 1,
    title: 'The Complete Guide to AI Agent Implementation',
    description: 'A comprehensive 50-page guide covering everything from basic setup to advanced deployment strategies for enterprise AI agents.',
    type: 'Guide',
    category: 'guides',
    downloadCount: 12450,
    rating: 4.9,
    readTime: '45 min',
    author: 'Dr. Sarah Chen',
    authorRole: 'AI Research Director',
    image: '/resources/guide-ai-implementation.jpg',
    tags: ['AI', 'Implementation', 'Enterprise'],
    featured: true,
    premium: false,
    fileSize: '2.3 MB',
    publishedAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'ROI Analysis: N8N Workflows in Fortune 500 Companies',
    description: 'Detailed case study analyzing the return on investment from N8N automation implementations across 15 Fortune 500 companies.',
    type: 'Case Study',
    category: 'case-studies',
    downloadCount: 8920,
    rating: 4.8,
    readTime: '30 min',
    author: 'Michael Rodriguez',
    authorRole: 'Business Analyst',
    image: '/resources/case-study-roi.jpg',
    tags: ['ROI', 'N8N', 'Enterprise'],
    featured: true,
    premium: true,
    fileSize: '1.8 MB',
    publishedAt: '2024-01-10'
  },
  {
    id: 3,
    title: 'AI Security Best Practices Whitepaper',
    description: 'Essential security protocols and compliance frameworks for deploying AI agents in regulated industries.',
    type: 'Whitepaper',
    category: 'whitepapers',
    downloadCount: 15670,
    rating: 4.9,
    readTime: '60 min',
    author: 'Jennifer Park',
    authorRole: 'Cybersecurity Expert',
    image: '/resources/whitepaper-security.jpg',
    tags: ['Security', 'Compliance', 'AI'],
    featured: true,
    premium: false,
    fileSize: '3.1 MB',
    publishedAt: '2024-01-08'
  }
]

const resources = [
  {
    id: 4,
    title: 'Automation Workflow Templates Collection',
    description: 'Ready-to-use N8N workflow templates for common business processes including CRM integration, email marketing, and data synchronization.',
    type: 'Template',
    category: 'templates',
    downloadCount: 9340,
    rating: 4.7,
    readTime: '15 min',
    author: 'Alex Thompson',
    authorRole: 'Automation Specialist',
    image: '/resources/templates-collection.jpg',
    tags: ['Templates', 'N8N', 'Workflows'],
    featured: false,
    premium: false,
    fileSize: '850 KB',
    publishedAt: '2024-01-12'
  },
  {
    id: 5,
    title: 'AI Agent Performance Optimization Guide',
    description: 'Technical deep-dive into optimizing AI agent performance, reducing latency, and improving accuracy through advanced configuration.',
    type: 'Guide',
    category: 'guides',
    downloadCount: 6780,
    rating: 4.8,
    readTime: '40 min',
    author: 'David Kumar',
    authorRole: 'ML Engineer',
    image: '/resources/guide-optimization.jpg',
    tags: ['Performance', 'Optimization', 'Technical'],
    featured: false,
    premium: true,
    fileSize: '2.7 MB',
    publishedAt: '2024-01-05'
  },
  {
    id: 6,
    title: 'Customer Service Automation Case Study',
    description: 'How TechCorp reduced support tickets by 73% using AI-powered customer service agents and automated response systems.',
    type: 'Case Study',
    category: 'case-studies',
    downloadCount: 5420,
    rating: 4.6,
    readTime: '25 min',
    author: 'Lisa Wang',
    authorRole: 'Customer Success Manager',
    image: '/resources/case-study-customer-service.jpg',
    tags: ['Customer Service', 'Automation', 'ROI'],
    featured: false,
    premium: false,
    fileSize: '1.5 MB',
    publishedAt: '2024-01-03'
  },
  {
    id: 7,
    title: 'No-Code AI Implementation for Small Business',
    description: 'Step-by-step guide for small business owners to implement AI solutions without technical expertise or large budgets.',
    type: 'Guide',
    category: 'guides',
    downloadCount: 11200,
    rating: 4.9,
    readTime: '35 min',
    author: 'Maria Garcia',
    authorRole: 'Small Business Consultant',
    image: '/resources/guide-small-business.jpg',
    tags: ['No-Code', 'Small Business', 'Implementation'],
    featured: false,
    premium: false,
    fileSize: '1.9 MB',
    publishedAt: '2024-01-01'
  },
  {
    id: 8,
    title: 'Future of Work: AI Integration Trends 2024',
    description: 'Research report analyzing current trends and future predictions for AI integration in workplace automation and productivity.',
    type: 'Whitepaper',
    category: 'whitepapers',
    downloadCount: 7890,
    rating: 4.7,
    readTime: '50 min',
    author: 'Robert Chen',
    authorRole: 'Industry Analyst',
    image: '/resources/whitepaper-trends.jpg',
    tags: ['Trends', 'Future of Work', 'Research'],
    featured: false,
    premium: true,
    fileSize: '2.8 MB',
    publishedAt: '2023-12-28'
  }
]

const webinars = [
  {
    id: 1,
    title: 'Building Your First AI Agent: Live Workshop',
    description: 'Join our expert-led workshop where you&apos;ll build a complete AI agent from scratch in just 60 minutes.',
    duration: '60 min',
    attendees: 2450,
    instructor: 'Sarah Chen',
    date: '2024-02-15',
    time: '2:00 PM EST',
    upcoming: true,
    featured: true
  },
  {
    id: 2,
    title: 'N8N Advanced Automation Masterclass',
    description: 'Deep dive into advanced N8N features including custom nodes, error handling, and enterprise deployment strategies.',
    duration: '90 min',
    attendees: 1870,
    instructor: 'Michael Rodriguez',
    date: '2024-02-20',
    time: '11:00 AM EST',
    upcoming: true,
    featured: false
  },
  {
    id: 3,
    title: 'AI Security & Compliance Best Practices',
    description: 'Essential security protocols for AI implementations in regulated industries including healthcare and finance.',
    duration: '75 min',
    attendees: 1340,
    instructor: 'Jennifer Park',
    date: '2024-02-25',
    time: '3:00 PM EST',
    upcoming: true,
    featured: false
  }
]

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredResources = [...featuredResources, ...resources].filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className={styles.resourcesPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <Container>
          <motion.div 
            className={styles.heroContent}
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.div className={styles.badge} variants={fadeInUp}>
              <BookOpen size={16} />
              Knowledge Hub
            </motion.div>
            
            <motion.h1 className={styles.heroTitle} variants={fadeInUp}>
              Resources & <span className={styles.gradient}>Learning Center</span>
            </motion.h1>
            
            <motion.p className={styles.heroDescription} variants={fadeInUp}>
              Access our comprehensive library of whitepapers, case studies, guides, and educational content to accelerate your AI automation journey and maximize ROI.
            </motion.p>

            <motion.div className={styles.heroStats} variants={fadeInUp}>
              <div className={styles.stat}>
                <FileText className={styles.statIcon} />
                <div className={styles.statNumber}>127+</div>
                <div className={styles.statLabel}>Resources</div>
              </div>
              <div className={styles.stat}>
                <Download className={styles.statIcon} />
                <div className={styles.statNumber}>50K+</div>
                <div className={styles.statLabel}>Downloads</div>
              </div>
              <div className={styles.stat}>
                <Star className={styles.statIcon} />
                <div className={styles.statNumber}>4.8</div>
                <div className={styles.statLabel}>Avg Rating</div>
              </div>
              <div className={styles.stat}>
                <TrendingUp className={styles.statIcon} />
                <div className={styles.statNumber}>95%</div>
                <div className={styles.statLabel}>Success Rate</div>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Search & Filter Section */}
      <section className={styles.searchSection}>
        <Container>
          <div className={styles.searchControls}>
            <div className={styles.searchBox}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search resources, guides, case studies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            
            <div className={styles.categories}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`${styles.categoryButton} ${selectedCategory === category.id ? styles.active : ''}`}
                >
                  <span>{category.label}</span>
                  <span className={styles.count}>{category.count}</span>
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Resources */}
      <section className={styles.featured}>
        <Container>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div className={styles.sectionHeader} variants={fadeInUp}>
              <h2>Featured Resources</h2>
              <p>Our most popular and impactful content, curated for maximum value</p>
            </motion.div>

            <motion.div className={styles.featuredGrid} variants={stagger}>
              {featuredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  className={styles.featuredCard}
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.resourceImage}>
                    <img src={resource.image} alt={resource.title} />
                    <div className={styles.resourceCategory}>{resource.type}</div>
                    {resource.premium && (
                      <div className={styles.premiumBadge}>
                        <Star size={12} />
                        Premium
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.resourceContent}>
                    <div className={styles.resourceMeta}>
                      <div className={styles.resourceStats}>
                        <div className={styles.stat}>
                          <Download size={14} />
                          <span>{resource.downloadCount.toLocaleString()}</span>
                        </div>
                        <div className={styles.stat}>
                          <Star size={14} />
                          <span>{resource.rating}</span>
                        </div>
                        <div className={styles.stat}>
                          <Clock size={14} />
                          <span>{resource.readTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                    
                    <div className={styles.resourceTags}>
                      {resource.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                          <Tag size={12} />
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className={styles.resourceAuthor}>
                      <User size={16} />
                      <div>
                        <div className={styles.authorName}>{resource.author}</div>
                        <div className={styles.authorRole}>{resource.authorRole}</div>
                      </div>
                    </div>
                    
                    <div className={styles.resourceActions}>
                      <Button variant="primary" size="sm" className={styles.downloadBtn}>
                        <Download size={16} />
                        Download ({resource.fileSize})
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink size={16} />
                        Preview
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* All Resources */}
      <section className={styles.allResources}>
        <Container>
          <div className={styles.sectionHeader}>
            <h2>All Resources</h2>
            <p>Browse our complete library of educational content and tools</p>
          </div>

          <div className={styles.resourcesGrid}>
            {filteredResources.map((resource) => (
              <motion.div
                key={resource.id}
                className={styles.resourceCard}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.resourceImage}>
                  <img src={resource.image} alt={resource.title} />
                  <div className={styles.resourceCategory}>{resource.type}</div>
                  {resource.premium && (
                    <div className={styles.premiumBadge}>
                      <Star size={12} />
                    </div>
                  )}
                </div>
                
                <div className={styles.resourceContent}>
                  <div className={styles.resourceMeta}>
                    <div className={styles.stat}>
                      <Download size={12} />
                      <span>{resource.downloadCount.toLocaleString()}</span>
                    </div>
                    <div className={styles.stat}>
                      <Star size={12} />
                      <span>{resource.rating}</span>
                    </div>
                    <div className={styles.stat}>
                      <Clock size={12} />
                      <span>{resource.readTime}</span>
                    </div>
                  </div>
                  
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  
                  <div className={styles.resourceTags}>
                    {resource.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Button variant="outline" size="sm" className={styles.resourceCta}>
                    <Download size={14} />
                    Download
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Upcoming Webinars */}
      <section className={styles.webinars}>
        <Container>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div className={styles.sectionHeader} variants={fadeInUp}>
              <h2>Upcoming Webinars</h2>
              <p>Join our live sessions with industry experts and thought leaders</p>
            </motion.div>

            <motion.div className={styles.webinarsGrid} variants={stagger}>
              {webinars.map((webinar) => (
                <motion.div
                  key={webinar.id}
                  className={`${styles.webinarCard} ${webinar.featured ? styles.featured : ''}`}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.webinarHeader}>
                    <div className={styles.webinarType}>
                      <Video size={16} />
                      Live Webinar
                    </div>
                    {webinar.featured && (
                      <div className={styles.featuredBadge}>
                        <Zap size={12} />
                        Featured
                      </div>
                    )}
                  </div>
                  
                  <h3>{webinar.title}</h3>
                  <p>{webinar.description}</p>
                  
                  <div className={styles.webinarMeta}>
                    <div className={styles.webinarDate}>
                      <Clock size={14} />
                      <span>{webinar.date} at {webinar.time}</span>
                    </div>
                    <div className={styles.webinarDuration}>
                      <span>{webinar.duration}</span>
                    </div>
                  </div>
                  
                  <div className={styles.webinarInstructor}>
                    <User size={16} />
                    <span>Instructor: {webinar.instructor}</span>
                  </div>
                  
                  <div className={styles.webinarStats}>
                    <span>{webinar.attendees} registered</span>
                  </div>
                  
                  <Button variant="primary" className={styles.webinarCta}>
                    <CheckCircle size={16} />
                    Register Now
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Newsletter Signup */}
      <section className={styles.newsletter}>
        <Container>
          <motion.div
            className={styles.newsletterContent}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2>Stay Updated</h2>
            <p>Get notified when we publish new resources, case studies, and guides</p>
            
            <div className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Enter your email address"
                className={styles.emailInput}
              />
              <Button variant="primary">
                Subscribe
              </Button>
            </div>
            
            <p className={styles.newsletterDisclaimer}>
              Join 25,000+ professionals. No spam, unsubscribe anytime.
            </p>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}
