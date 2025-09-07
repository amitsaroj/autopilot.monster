'use client'

import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  Star,
  ChevronRight,
  Search,
  Filter,
  Download,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  Zap,
  Code,
  Lightbulb
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import styles from './Tutorials.module.scss'

// Tutorial categories
const categories = [
  { id: 'all', name: 'All Tutorials', count: 45 },
  { id: 'getting-started', name: 'Getting Started', count: 8 },
  { id: 'workflows', name: 'Workflow Creation', count: 12 },
  { id: 'integrations', name: 'Integrations', count: 15 },
  { id: 'advanced', name: 'Advanced Techniques', count: 10 }
]

// Featured tutorials
const featuredTutorials = [
  {
    id: 'automation-basics',
    title: 'Complete Guide to AI Automation',
    description: 'Learn the fundamentals of building powerful AI automation workflows from scratch.',
    duration: '45 min',
    difficulty: 'Beginner',
    rating: 4.9,
    students: 12500,
    image: '/api/placeholder/400/250',
    category: 'getting-started',
    featured: true,
    lessons: 8
  },
  {
    id: 'enterprise-workflows',
    title: 'Enterprise Workflow Patterns',
    description: 'Master advanced workflow patterns used by Fortune 500 companies.',
    duration: '2.5 hours',
    difficulty: 'Advanced',
    rating: 4.8,
    students: 3200,
    image: '/api/placeholder/400/250',
    category: 'advanced',
    featured: true,
    lessons: 12
  }
]

// All tutorials
const allTutorials = [
  {
    id: 'quickstart',
    title: 'Quick Start: Your First AI Agent',
    description: 'Deploy your first AI agent in under 10 minutes.',
    duration: '8 min',
    difficulty: 'Beginner',
    rating: 4.7,
    students: 8900,
    category: 'getting-started',
    type: 'video',
    free: true
  },
  {
    id: 'stripe-integration',
    title: 'Stripe Payment Automation',
    description: 'Automate payment processing with Stripe integration.',
    duration: '25 min',
    difficulty: 'Intermediate',
    rating: 4.6,
    students: 5400,
    category: 'integrations',
    type: 'video',
    free: false
  },
  {
    id: 'slack-notifications',
    title: 'Slack Notification Workflows',
    description: 'Set up intelligent Slack notifications for your team.',
    duration: '18 min',
    difficulty: 'Beginner',
    rating: 4.8,
    students: 7200,
    category: 'workflows',
    type: 'article',
    free: true
  },
  {
    id: 'error-handling',
    title: 'Advanced Error Handling',
    description: 'Build resilient workflows with proper error handling.',
    duration: '35 min',
    difficulty: 'Advanced',
    rating: 4.9,
    students: 2800,
    category: 'advanced',
    type: 'video',
    free: false
  },
  {
    id: 'api-testing',
    title: 'API Testing & Monitoring',
    description: 'Implement comprehensive API testing in your workflows.',
    duration: '40 min',
    difficulty: 'Intermediate',
    rating: 4.5,
    students: 3600,
    category: 'advanced',
    type: 'hands-on',
    free: false
  },
  {
    id: 'database-operations',
    title: 'Database Operations & Data Sync',
    description: 'Master database operations and data synchronization.',
    duration: '55 min',
    difficulty: 'Intermediate',
    rating: 4.7,
    students: 4100,
    category: 'workflows',
    type: 'video',
    free: false
  }
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return '#10b981'
    case 'Intermediate': return '#f59e0b'
    case 'Advanced': return '#ef4444'
    default: return '#6b7280'
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'video': return Play
    case 'article': return BookOpen
    case 'hands-on': return Code
    default: return BookOpen
  }
}

export default function TutorialsPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuredRef = useRef<HTMLDivElement>(null)
  const tutorialsRef = useRef<HTMLDivElement>(null)
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const featuredInView = useInView(featuredRef, { once: true, amount: 0.2 })
  const tutorialsInView = useInView(tutorialsRef, { once: true, amount: 0.2 })
  
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTutorials = allTutorials.filter(tutorial => {
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className={styles.tutorialsPage}>
      {/* Hero Section */}
      <section className={styles.hero} ref={heroRef}>
        <div className="container">
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 60 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
          >
            <div className={styles.badge}>
              <Lightbulb size={16} />
              <span>Learn & Master</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              Tutorials &
              <span className={styles.gradient}> Learning Center</span>
            </h1>
            
            <p className={styles.heroDescription}>
              Master AI automation with our comprehensive tutorials. From beginner guides to advanced techniques, 
              learn at your own pace with step-by-step instructions, video walkthroughs, and hands-on examples.
            </p>
            
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>45+</div>
                <div className={styles.statLabel}>Tutorials</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>50K+</div>
                <div className={styles.statLabel}>Students</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>4.8★</div>
                <div className={styles.statLabel}>Avg Rating</div>
              </div>
            </div>
            
            <div className={styles.heroActions}>
              <Button size="lg" variant="primary">
                Start Learning
                <Play size={20} />
              </Button>
              <Button size="lg" variant="outline">
                Browse All Tutorials
                <BookOpen size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Tutorials */}
      <section className={styles.featured} ref={featuredRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Featured Tutorials</h2>
            <p>Most popular and comprehensive learning paths</p>
          </motion.div>

          <div className={styles.featuredGrid}>
            {featuredTutorials.map((tutorial, index) => (
              <motion.div
                key={tutorial.id}
                className={styles.featuredCard}
                initial={{ opacity: 0, y: 40 }}
                animate={featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8 }}
              >
                <div className={styles.featuredImage}>
                  <img src={tutorial.image} alt={tutorial.title} />
                  <div className={styles.playButton}>
                    <Play size={24} />
                  </div>
                  <div className={styles.duration}>{tutorial.duration}</div>
                </div>
                
                <div className={styles.featuredContent}>
                  <div className={styles.featuredMeta}>
                    <span 
                      className={styles.difficulty}
                      style={{ backgroundColor: getDifficultyColor(tutorial.difficulty) }}
                    >
                      {tutorial.difficulty}
                    </span>
                    <div className={styles.rating}>
                      <Star size={14} />
                      {tutorial.rating}
                    </div>
                  </div>
                  
                  <h3>{tutorial.title}</h3>
                  <p>{tutorial.description}</p>
                  
                  <div className={styles.featuredStats}>
                    <div className={styles.students}>
                      <Users size={16} />
                      {tutorial.students.toLocaleString()} students
                    </div>
                    <div className={styles.lessons}>
                      {tutorial.lessons} lessons
                    </div>
                  </div>
                  
                  <Button variant="primary" className={styles.featuredCta}>
                    Start Course
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Tutorials */}
      <section className={styles.tutorials} ref={tutorialsRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={tutorialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>All Tutorials</h2>
            <p>Browse our complete library of automation tutorials</p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            className={styles.controls}
            initial={{ opacity: 0, y: 20 }}
            animate={tutorialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className={styles.searchBox}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Search tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className={styles.categories}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`${styles.categoryBtn} ${selectedCategory === category.id ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                  <span className={styles.count}>{category.count}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tutorials Grid */}
          <motion.div
            className={styles.tutorialsGrid}
            initial={{ opacity: 0 }}
            animate={tutorialsInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {filteredTutorials.map((tutorial, index) => {
              const TypeIcon = getTypeIcon(tutorial.type)
              return (
                <motion.div
                  key={tutorial.id}
                  className={styles.tutorialCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className={styles.tutorialHeader}>
                    <div className={styles.typeIcon}>
                      <TypeIcon size={20} />
                    </div>
                    <div className={styles.tutorialMeta}>
                      <span 
                        className={styles.difficulty}
                        style={{ backgroundColor: getDifficultyColor(tutorial.difficulty) }}
                      >
                        {tutorial.difficulty}
                      </span>
                      {tutorial.free && <span className={styles.free}>FREE</span>}
                    </div>
                  </div>
                  
                  <h3>{tutorial.title}</h3>
                  <p>{tutorial.description}</p>
                  
                  <div className={styles.tutorialFooter}>
                    <div className={styles.tutorialStats}>
                      <div className={styles.duration}>
                        <Clock size={14} />
                        {tutorial.duration}
                      </div>
                      <div className={styles.rating}>
                        <Star size={14} />
                        {tutorial.rating}
                      </div>
                      <div className={styles.students}>
                        <Users size={14} />
                        {tutorial.students.toLocaleString()}
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      {tutorial.type === 'video' ? 'Watch' : tutorial.type === 'article' ? 'Read' : 'Start'}
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <motion.div
            className={styles.ctaContent}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={tutorialsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2>Ready to Become an Automation Expert?</h2>
            <p>
              Join thousands of professionals who have mastered AI automation with our comprehensive tutorials. 
              Start your learning journey today and transform your business processes.
            </p>
            <div className={styles.ctaActions}>
              <Button size="lg" variant="primary">
                Start Free Course
                <Play size={20} />
              </Button>
              <Button size="lg" variant="outline">
                View Certification Program
                <Star size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
