'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'
import { Button } from '@/components/ui/Button/Button'
import Link from 'next/link'
import { 
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Heart,
  Eye,
  Tag,
  BookOpen,
  ArrowRight,
  Twitter,
  Linkedin,
  Facebook,
  Copy
} from 'lucide-react'
import styles from './BlogDetail.module.scss'

// Mock blog post data - in a real app, this would come from a CMS or API
const blogPost = {
  id: 1,
  title: 'The Future of AI Automation: Trends to Watch in 2024',
  excerpt: 'Discover the latest trends in AI automation that are reshaping how businesses operate and compete in the digital landscape.',
  content: `
    <p>Artificial Intelligence automation is rapidly transforming the business landscape, and 2024 promises to be a pivotal year for this technology. As we move forward, several key trends are emerging that will shape how organizations implement and benefit from AI automation.</p>

    <h2>The Rise of Conversational AI</h2>
    <p>One of the most significant trends we're seeing is the evolution of conversational AI beyond simple chatbots. Modern AI agents can now handle complex, multi-turn conversations, understand context, and provide personalized responses that feel genuinely human.</p>

    <p>Companies like Autopilot.monster are leading this charge, offering AI agents that can:</p>
    <ul>
      <li>Handle customer support inquiries with 95% accuracy</li>
      <li>Process complex requests across multiple systems</li>
      <li>Learn from interactions to improve over time</li>
      <li>Integrate seamlessly with existing business workflows</li>
    </ul>

    <h2>No-Code AI Development</h2>
    <p>The democratization of AI development is another major trend. With no-code platforms, business users can now create sophisticated AI agents without writing a single line of code. This shift is making AI automation accessible to organizations of all sizes.</p>

    <blockquote>
      "The future belongs to those who can harness the power of AI without needing a team of data scientists. No-code AI platforms are making this possible for everyone."
    </blockquote>

    <h2>Hyperautomation and Process Mining</h2>
    <p>Hyperautomation combines multiple automation technologies to create end-to-end business process automation. When combined with process mining, organizations can identify inefficiencies and automate entire workflows automatically.</p>

    <h2>AI-Powered Decision Making</h2>
    <p>Beyond task automation, AI is now being used for strategic decision-making. Advanced AI systems can analyze vast amounts of data, identify patterns, and make recommendations that would be impossible for humans to process manually.</p>

    <h2>Security and Compliance</h2>
    <p>As AI automation becomes more prevalent, security and compliance are becoming critical concerns. Organizations need to ensure their AI systems are:</p>
    <ul>
      <li>Secure against cyber threats</li>
      <li>Compliant with data protection regulations</li>
      <li>Transparent in their decision-making processes</li>
      <li>Auditable for regulatory requirements</li>
    </ul>

    <h2>Looking Ahead</h2>
    <p>The future of AI automation is bright, with new technologies and approaches emerging regularly. Organizations that embrace these trends early will have a significant competitive advantage in the years to come.</p>

    <p>At Autopilot.monster, we're committed to staying at the forefront of these developments, providing our users with the most advanced AI automation tools available.</p>
  `,
  author: {
    name: 'Sarah Chen',
    avatar: '/api/placeholder/60/60',
    bio: 'AI researcher and automation expert with 15+ years of experience in machine learning and business process optimization.',
    social: {
      twitter: 'https://twitter.com/sarahchen',
      linkedin: 'https://linkedin.com/in/sarahchen'
    }
  },
  publishDate: '2024-01-15',
  readTime: '8 min read',
  category: 'AI Trends',
  tags: ['AI', 'Automation', 'Future Tech', 'Business'],
  image: '/api/placeholder/800/400',
  views: 1250,
  likes: 89,
  shares: 23
}

const relatedPosts = [
  {
    id: 2,
    title: 'Building Your First n8n Workflow: A Complete Guide',
    excerpt: 'Learn how to create powerful automation workflows using n8n, from basic concepts to advanced integrations.',
    author: 'Marcus Rodriguez',
    publishDate: '2024-01-12',
    readTime: '12 min read',
    category: 'Tutorials',
    image: '/api/placeholder/300/200'
  },
  {
    id: 3,
    title: 'Customer Support AI: Reducing Response Time by 80%',
    excerpt: 'How one company transformed their customer support with AI agents, achieving faster response times and higher satisfaction.',
    author: 'Dr. Priya Patel',
    publishDate: '2024-01-10',
    readTime: '6 min read',
    category: 'Case Studies',
    image: '/api/placeholder/300/200'
  },
  {
    id: 4,
    title: 'The Complete Guide to AI Agent Security',
    excerpt: 'Essential security practices for deploying AI agents in production environments, including data protection and access control.',
    author: 'Alex Thompson',
    publishDate: '2024-01-08',
    readTime: '10 min read',
    category: 'Security',
    image: '/api/placeholder/300/200'
  }
]

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = blogPost.title
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        // You could add a toast notification here
        break
    }
  }

  return (
    <>
      <Navigation />
      <main className={styles.blogDetailPage}>
        {/* Back Navigation */}
        <section className={styles.backSection}>
          <div className="container">
            <Link href="/blog" className={styles.backLink}>
              <ArrowLeft size={20} />
              <span>Back to Blog</span>
            </Link>
          </div>
        </section>

        {/* Article Header */}
        <section className={styles.articleHeader}>
          <div className="container">
            <motion.div
              className={styles.headerContent}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className={styles.articleCategory}>{blogPost.category}</div>
              <h1 className={styles.articleTitle}>{blogPost.title}</h1>
              <p className={styles.articleExcerpt}>{blogPost.excerpt}</p>

              <div className={styles.articleMeta}>
                <div className={styles.authorInfo}>
                  <div className={styles.authorAvatar}>
                    <User size={20} />
                  </div>
                  <div className={styles.authorDetails}>
                    <div className={styles.authorName}>{blogPost.author.name}</div>
                    <div className={styles.authorBio}>{blogPost.author.bio}</div>
                  </div>
                </div>

                <div className={styles.metaItems}>
                  <div className={styles.metaItem}>
                    <Calendar size={16} />
                    <span>{new Date(blogPost.publishDate).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Clock size={16} />
                    <span>{blogPost.readTime}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Eye size={16} />
                    <span>{blogPost.views} views</span>
                  </div>
                </div>
              </div>

              <div className={styles.articleTags}>
                {blogPost.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Article Image */}
        <section className={styles.articleImage}>
          <div className="container">
            <motion.div
              className={styles.imageContainer}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className={styles.imagePlaceholder}>
                <BookOpen size={80} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Article Content */}
        <section className={styles.articleContent} ref={ref}>
          <div className="container">
            <div className={styles.contentLayout}>
              <motion.article
                className={styles.content}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8 }}
              >
                <div 
                  className={styles.articleBody}
                  dangerouslySetInnerHTML={{ __html: blogPost.content }}
                />
              </motion.article>

              {/* Sidebar */}
              <motion.aside
                className={styles.sidebar}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className={styles.shareSection}>
                  <h3 className={styles.sidebarTitle}>Share this article</h3>
                  <div className={styles.shareButtons}>
                    <button 
                      className={styles.shareButton}
                      onClick={() => handleShare('twitter')}
                    >
                      <Twitter size={18} />
                    </button>
                    <button 
                      className={styles.shareButton}
                      onClick={() => handleShare('linkedin')}
                    >
                      <Linkedin size={18} />
                    </button>
                    <button 
                      className={styles.shareButton}
                      onClick={() => handleShare('facebook')}
                    >
                      <Facebook size={18} />
                    </button>
                    <button 
                      className={styles.shareButton}
                      onClick={() => handleShare('copy')}
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>

                <div className={styles.statsSection}>
                  <h3 className={styles.sidebarTitle}>Article Stats</h3>
                  <div className={styles.stats}>
                    <div className={styles.stat}>
                      <Eye size={16} />
                      <span>{blogPost.views} views</span>
                    </div>
                    <div className={styles.stat}>
                      <Heart size={16} />
                      <span>{blogPost.likes} likes</span>
                    </div>
                    <div className={styles.stat}>
                      <Share2 size={16} />
                      <span>{blogPost.shares} shares</span>
                    </div>
                  </div>
                </div>

                <div className={styles.authorSection}>
                  <h3 className={styles.sidebarTitle}>About the Author</h3>
                  <div className={styles.authorCard}>
                    <div className={styles.authorAvatar}>
                      <User size={24} />
                    </div>
                    <div className={styles.authorInfo}>
                      <div className={styles.authorName}>{blogPost.author.name}</div>
                      <div className={styles.authorBio}>{blogPost.author.bio}</div>
                      <div className={styles.authorSocial}>
                        <a href={blogPost.author.social.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter size={16} />
                        </a>
                        <a href={blogPost.author.social.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className={styles.relatedSection}>
          <div className="container">
            <motion.div
              className={styles.relatedContent}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className={styles.relatedTitle}>Related Articles</h2>
              <div className={styles.relatedGrid}>
                {relatedPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    className={styles.relatedCard}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02, y: -8 }}
                  >
                    <Link href={`/blog/${post.id}`} className={styles.relatedLink}>
                      <div className={styles.relatedImage}>
                        <div className={styles.imagePlaceholder}>
                          <BookOpen size={40} />
                        </div>
                        <div className={styles.relatedCategory}>{post.category}</div>
                      </div>
                      <div className={styles.relatedContent}>
                        <h3 className={styles.relatedPostTitle}>{post.title}</h3>
                        <p className={styles.relatedExcerpt}>{post.excerpt}</p>
                        <div className={styles.relatedMeta}>
                          <span className={styles.relatedAuthor}>{post.author}</span>
                          <span className={styles.relatedDate}>{new Date(post.publishDate).toLocaleDateString()}</span>
                          <span className={styles.relatedReadTime}>{post.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </motion.div>
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
              <h2 className={styles.newsletterTitle}>Enjoyed this article?</h2>
              <p className={styles.newsletterDescription}>
                Subscribe to our newsletter for more insights on AI automation and business optimization.
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