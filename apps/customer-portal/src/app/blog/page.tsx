'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'
import { Button } from '@/components/ui/Button/Button'
import Link from 'next/link'
import { 
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  ArrowRight,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Zap,
  Tag,
  Eye,
  Heart,
  Share2,
  Star,
  Shield,
  Workflow
} from 'lucide-react'
import styles from './Blog.module.scss'

const blogPosts = [
  {
    id: 1,
    title: 'The Future of AI Automation: Trends to Watch in 2024',
    excerpt: 'Discover the latest trends in AI automation that are reshaping how businesses operate and compete in the digital landscape.',
    content: 'Full article content...',
    author: 'Sarah Chen',
    authorAvatar: '/api/placeholder/40/40',
    publishDate: '2024-01-15',
    readTime: '8 min read',
    category: 'AI Trends',
    tags: ['AI', 'Automation', 'Future Tech'],
    image: '/api/placeholder/600/400',
    featured: true,
    views: 1250,
    likes: 89
  },
  {
    id: 2,
    title: 'Building Your First n8n Workflow: A Complete Guide',
    excerpt: 'Learn how to create powerful automation workflows using n8n, from basic concepts to advanced integrations.',
    content: 'Full article content...',
    author: 'Marcus Rodriguez',
    authorAvatar: '/api/placeholder/40/40',
    publishDate: '2024-01-12',
    readTime: '12 min read',
    category: 'Tutorials',
    tags: ['n8n', 'Workflows', 'Tutorial'],
    image: '/api/placeholder/600/400',
    featured: false,
    views: 980,
    likes: 67
  },
  {
    id: 3,
    title: 'Customer Support AI: Reducing Response Time by 80%',
    excerpt: 'How one company transformed their customer support with AI agents, achieving faster response times and higher satisfaction.',
    content: 'Full article content...',
    author: 'Dr. Priya Patel',
    authorAvatar: '/api/placeholder/40/40',
    publishDate: '2024-01-10',
    readTime: '6 min read',
    category: 'Case Studies',
    tags: ['Customer Support', 'AI Agents', 'Case Study'],
    image: '/api/placeholder/600/400',
    featured: false,
    views: 750,
    likes: 45
  },
  {
    id: 4,
    title: 'The Complete Guide to AI Agent Security',
    excerpt: 'Essential security practices for deploying AI agents in production environments, including data protection and access control.',
    content: 'Full article content...',
    author: 'Alex Thompson',
    authorAvatar: '/api/placeholder/40/40',
    publishDate: '2024-01-08',
    readTime: '10 min read',
    category: 'Security',
    tags: ['Security', 'AI Agents', 'Best Practices'],
    image: '/api/placeholder/600/400',
    featured: false,
    views: 620,
    likes: 38
  },
  {
    id: 5,
    title: 'Integrating AI Agents with Your Existing CRM',
    excerpt: 'Step-by-step guide to connecting AI agents with popular CRM systems like Salesforce, HubSpot, and Pipedrive.',
    content: 'Full article content...',
    author: 'Elena Volkov',
    authorAvatar: '/api/placeholder/40/40',
    publishDate: '2024-01-05',
    readTime: '9 min read',
    category: 'Integrations',
    tags: ['CRM', 'Integrations', 'Salesforce'],
    image: '/api/placeholder/600/400',
    featured: false,
    views: 890,
    likes: 52
  },
  {
    id: 6,
    title: 'ROI Calculator: Measuring Automation Success',
    excerpt: 'Learn how to calculate the return on investment for your automation projects and justify your automation budget.',
    content: 'Full article content...',
    author: 'David Kim',
    authorAvatar: '/api/placeholder/40/40',
    publishDate: '2024-01-03',
    readTime: '7 min read',
    category: 'Business',
    tags: ['ROI', 'Business', 'Analytics'],
    image: '/api/placeholder/600/400',
    featured: false,
    views: 540,
    likes: 29
  }
]

const categories = [
  { name: 'All', count: 24, icon: BookOpen },
  { name: 'AI Trends', count: 6, icon: TrendingUp },
  { name: 'Tutorials', count: 8, icon: Lightbulb },
  { name: 'Case Studies', count: 4, icon: Zap },
  { name: 'Security', count: 3, icon: Shield },
  { name: 'Integrations', count: 2, icon: Workflow },
  { name: 'Business', count: 1, icon: TrendingUp }
]

const featuredPost = blogPosts.find(post => post.featured) || blogPosts[0]

export default function BlogPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <Navigation />
      <main className={styles.blogPage}>
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
                <BookOpen size={16} />
                <span>Latest Insights & Tutorials</span>
              </motion.div>

              <h1 className={styles.heroTitle}>
                Learn <span className={styles.gradientText}>Automation</span> from the Experts
              </h1>
              
              <p className={styles.heroDescription}>
                Discover the latest trends, tutorials, and case studies in AI automation. 
                Stay ahead of the curve with insights from industry leaders.
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
                    placeholder="Search articles, tutorials, and insights..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Featured Post */}
        <section className={styles.featuredSection}>
          <div className="container">
            <motion.div
              className={styles.featuredPost}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8 }}
            >
              <div className={styles.featuredImage}>
                <div className={styles.imagePlaceholder}>
                  <BookOpen size={60} />
                </div>
                <div className={styles.featuredBadge}>
                  <Star size={16} />
                  <span>Featured</span>
                </div>
              </div>
              <div className={styles.featuredContent}>
                <div className={styles.featuredCategory}>{featuredPost.category}</div>
                <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
                <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
                <div className={styles.featuredMeta}>
                  <div className={styles.author}>
                    <div className={styles.authorAvatar}>
                      <User size={16} />
                    </div>
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Calendar size={16} />
                    <span>{new Date(featuredPost.publishDate).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Clock size={16} />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
                <div className={styles.featuredTags}>
                  {featuredPost.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={`/blog/${featuredPost.id}`} className={styles.featuredLink}>
                  <Button variant="primary" size="lg">
                    Read Article
                    <ArrowRight size={20} />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories and Posts */}
        <section className={styles.postsSection} ref={ref}>
          <div className="container">
            <motion.div
              className={styles.sectionHeader}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={styles.sectionTitle}>Latest Articles</h2>
              <p className={styles.sectionDescription}>
                {filteredPosts.length} articles found
              </p>
            </motion.div>

            <div className={styles.contentLayout}>
              {/* Categories Sidebar */}
              <motion.div
                className={styles.categoriesSidebar}
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className={styles.sidebarTitle}>Categories</h3>
                <div className={styles.categoriesList}>
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      className={`${styles.categoryItem} ${activeCategory === category.name ? styles.active : ''}`}
                      onClick={() => setActiveCategory(category.name)}
                    >
                      <category.icon size={18} />
                      <span>{category.name}</span>
                      <span className={styles.categoryCount}>({category.count})</span>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Posts Grid */}
              <motion.div
                className={styles.postsGrid}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {filteredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    className={styles.postCard}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02, y: -8 }}
                  >
                    <Link href={`/blog/${post.id}`} className={styles.postLink}>
                      <div className={styles.postImage}>
                        <div className={styles.imagePlaceholder}>
                          <BookOpen size={40} />
                        </div>
                        <div className={styles.postCategory}>{post.category}</div>
                      </div>

                      <div className={styles.postContent}>
                        <h3 className={styles.postTitle}>{post.title}</h3>
                        <p className={styles.postExcerpt}>{post.excerpt}</p>

                        <div className={styles.postMeta}>
                          <div className={styles.author}>
                            <div className={styles.authorAvatar}>
                              <User size={14} />
                            </div>
                            <span>{post.author}</span>
                          </div>
                          <div className={styles.metaItem}>
                            <Calendar size={14} />
                            <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                          </div>
                          <div className={styles.metaItem}>
                            <Clock size={14} />
                            <span>{post.readTime}</span>
                          </div>
                        </div>

                        <div className={styles.postTags}>
                          {post.tags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className={styles.tag}>
                              <Tag size={10} />
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className={styles.postStats}>
                          <div className={styles.stat}>
                            <Eye size={14} />
                            <span>{post.views}</span>
                          </div>
                          <div className={styles.stat}>
                            <Heart size={14} />
                            <span>{post.likes}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className={styles.newsletterSection}>
          <div className="container">
            <motion.div
              className={styles.newsletterContent}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className={styles.newsletterTitle}>Stay Updated</h2>
              <p className={styles.newsletterDescription}>
                Get the latest automation insights, tutorials, and industry news delivered to your inbox.
              </p>
              <div className={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className={styles.newsletterInput}
                />
                <Button variant="primary" size="lg">
                  Subscribe
                  <ArrowRight size={20} />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}