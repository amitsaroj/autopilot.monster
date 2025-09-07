'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Mail, 
  Phone,
  ChevronRight,
  ChevronDown,
  Star,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Settings,
  CreditCard,
  Shield,
  Zap,
  Download,
  PlayCircle,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import { Container } from '@/components/ui/Container/Container'
import styles from './HelpCenter.module.scss'

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
//   title: 'Help Center & Support | AutoPilot Monster',
//   description: 'Find answers to your questions with our comprehensive knowledge base, tutorials, and 24/7 support resources.',
//   keywords: 'help center, support, FAQ, tutorials, documentation, customer service'
// }

const categories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Everything you need to begin your AI automation journey',
    icon: Lightbulb,
    articles: 24,
    color: 'blue'
  },
  {
    id: 'account-billing',
    title: 'Account & Billing',
    description: 'Manage your account, subscriptions, and payment information',
    icon: CreditCard,
    articles: 18,
    color: 'green'
  },
  {
    id: 'technical-support',
    title: 'Technical Support',
    description: 'Troubleshoot issues and get technical assistance',
    icon: Settings,
    articles: 32,
    color: 'purple'
  },
  {
    id: 'security-privacy',
    title: 'Security & Privacy',
    description: 'Learn about our security measures and privacy policies',
    icon: Shield,
    articles: 15,
    color: 'red'
  },
  {
    id: 'ai-agents',
    title: 'AI Agents',
    description: 'Setup, configuration, and optimization of AI agents',
    icon: Zap,
    articles: 28,
    color: 'yellow'
  },
  {
    id: 'workflows',
    title: 'N8N Workflows',
    description: 'Create, customize, and deploy automation workflows',
    icon: PlayCircle,
    articles: 21,
    color: 'indigo'
  }
]

const popularArticles = [
  {
    id: 1,
    title: 'How to Set Up Your First AI Agent',
    description: 'Step-by-step guide to creating and deploying your first AI automation agent.',
    category: 'Getting Started',
    readTime: '8 min',
    views: 15420,
    helpful: 94,
    icon: Lightbulb,
    difficulty: 'Beginner'
  },
  {
    id: 2,
    title: 'Troubleshooting Common N8N Workflow Issues',
    description: 'Solutions to the most frequently encountered problems when building automation workflows.',
    category: 'Technical Support',
    readTime: '12 min',
    views: 8930,
    helpful: 91,
    icon: Settings,
    difficulty: 'Intermediate'
  },
  {
    id: 3,
    title: 'Understanding Your Billing and Subscription',
    description: 'Complete guide to managing your account, understanding charges, and upgrading plans.',
    category: 'Account & Billing',
    readTime: '6 min',
    views: 12100,
    helpful: 89,
    icon: CreditCard,
    difficulty: 'Beginner'
  },
  {
    id: 4,
    title: 'API Integration Best Practices',
    description: 'Learn how to securely integrate third-party APIs with your AI agents and workflows.',
    category: 'Technical Support',
    readTime: '15 min',
    views: 6750,
    helpful: 96,
    icon: Zap,
    difficulty: 'Advanced'
  },
  {
    id: 5,
    title: 'Data Security and GDPR Compliance',
    description: 'How we protect your data and ensure compliance with international privacy regulations.',
    category: 'Security & Privacy',
    readTime: '10 min',
    views: 9200,
    helpful: 92,
    icon: Shield,
    difficulty: 'Intermediate'
  }
]

const faqs = [
  {
    id: 1,
    question: 'How do I get started with AutoPilot Monster?',
    answer: 'Getting started is easy! First, create your account and choose a subscription plan that fits your needs. Then, explore our marketplace of pre-built AI agents or use our no-code builder to create your own. Our onboarding tutorial will guide you through your first automation setup.',
    category: 'getting-started'
  },
  {
    id: 2,
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise accounts. All payments are processed securely through Stripe with 256-bit SSL encryption.',
    category: 'account-billing'
  },
  {
    id: 3,
    question: 'Can I cancel my subscription at any time?',
    answer: 'Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period. We also offer a 30-day money-back guarantee for new subscribers.',
    category: 'account-billing'
  },
  {
    id: 4,
    question: 'How secure is my data?',
    answer: 'We take security very seriously. All data is encrypted in transit and at rest using AES-256 encryption. We are SOC 2 Type II certified and comply with GDPR, CCPA, and other privacy regulations. Regular security audits ensure the highest level of protection.',
    category: 'security-privacy'
  },
  {
    id: 5,
    question: 'Do you offer technical support?',
    answer: 'Yes! We offer 24/7 technical support through multiple channels including live chat, email, and phone support for enterprise customers. Our support team consists of experienced AI engineers and automation specialists.',
    category: 'technical-support'
  },
  {
    id: 6,
    question: 'Can I integrate with my existing tools?',
    answer: 'Absolutely! We support integrations with 500+ popular tools including Salesforce, HubSpot, Slack, Microsoft Teams, Google Workspace, and many more. Our API also allows for custom integrations.',
    category: 'technical-support'
  }
]

const contactOptions = [
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Get instant help from our support team',
    availability: '24/7 Available',
    action: 'Start Chat',
    variant: 'primary'
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send us a detailed message',
    availability: 'Response in 2-4 hours',
    action: 'Send Email',
    variant: 'outline'
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Speak directly with our experts',
    availability: 'Enterprise customers only',
    action: 'Schedule Call',
    variant: 'outline'
  }
]

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [openFaqs, setOpenFaqs] = React.useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)

  const toggleFaq = (id: number) => {
    setOpenFaqs(prev => 
      prev.includes(id) 
        ? prev.filter(faqId => faqId !== id)
        : [...prev, id]
    )
  }

  const filteredFaqs = selectedCategory 
    ? faqs.filter(faq => faq.category === selectedCategory)
    : faqs

  const searchResults = searchQuery.length > 0
    ? popularArticles.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  return (
    <div className={styles.helpCenterPage}>
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
              <HelpCircle size={16} />
              Help Center
            </motion.div>
            
            <motion.h1 className={styles.heroTitle} variants={fadeInUp}>
              How can we <span className={styles.gradient}>help you?</span>
            </motion.h1>
            
            <motion.p className={styles.heroDescription} variants={fadeInUp}>
              Search our knowledge base, browse categories, or contact our support team for personalized assistance.
            </motion.p>

            <motion.div className={styles.searchBox} variants={fadeInUp}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search for answers, guides, tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <Button variant="primary" size="sm">
                Search
              </Button>
            </motion.div>

            {searchResults.length > 0 && (
              <motion.div className={styles.searchResults} variants={fadeInUp}>
                <h3>Search Results ({searchResults.length})</h3>
                {searchResults.map((article) => (
                  <div key={article.id} className={styles.searchResult}>
                    <article.icon size={20} />
                    <div>
                      <h4>{article.title}</h4>
                      <p>{article.description}</p>
                      <div className={styles.resultMeta}>
                        <span>{article.category}</span>
                        <span>{article.readTime}</span>
                        <span>{article.views} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </Container>
      </section>

      {/* Categories Section */}
      <section className={styles.categories}>
        <Container>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div className={styles.sectionHeader} variants={fadeInUp}>
              <h2>Browse by Category</h2>
              <p>Find answers organized by topic and expertise level</p>
            </motion.div>

            <motion.div className={styles.categoriesGrid} variants={stagger}>
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  className={styles.categoryCard}
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className={`${styles.categoryIcon} ${styles[category.color]}`}>
                    <category.icon size={24} />
                  </div>
                  
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  
                  <div className={styles.categoryMeta}>
                    <span>{category.articles} articles</span>
                    <ChevronRight size={16} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Popular Articles */}
      <section className={styles.popularArticles}>
        <Container>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div className={styles.sectionHeader} variants={fadeInUp}>
              <h2>Popular Articles</h2>
              <p>The most helpful resources as rated by our community</p>
            </motion.div>

            <motion.div className={styles.articlesGrid} variants={stagger}>
              {popularArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  className={styles.articleCard}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.articleHeader}>
                    <div className={styles.articleIcon}>
                      <article.icon size={20} />
                    </div>
                    <div className={styles.articleDifficulty}>
                      {article.difficulty}
                    </div>
                  </div>
                  
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  
                  <div className={styles.articleMeta}>
                    <div className={styles.metaItem}>
                      <Clock size={14} />
                      <span>{article.readTime}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <User size={14} />
                      <span>{article.views.toLocaleString()} views</span>
                    </div>
                    <div className={styles.metaItem}>
                      <Star size={14} />
                      <span>{article.helpful}% helpful</span>
                    </div>
                  </div>
                  
                  <div className={styles.articleCategory}>
                    {article.category}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <Container>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div className={styles.sectionHeader} variants={fadeInUp}>
              <h2>Frequently Asked Questions</h2>
              <p>Quick answers to common questions</p>
            </motion.div>

            <motion.div className={styles.faqContainer} variants={stagger}>
              <div className={styles.faqCategories}>
                <button
                  className={`${styles.faqCategoryBtn} ${!selectedCategory ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All Questions
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`${styles.faqCategoryBtn} ${selectedCategory === category.id ? styles.active : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.title}
                  </button>
                ))}
              </div>

              <div className={styles.faqList}>
                {filteredFaqs.map((faq) => (
                  <motion.div
                    key={faq.id}
                    className={styles.faqItem}
                    variants={fadeInUp}
                  >
                    <button
                      className={styles.faqQuestion}
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <span>{faq.question}</span>
                      <motion.div
                        animate={{ rotate: openFaqs.includes(faq.id) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={20} />
                      </motion.div>
                    </button>
                    
                    <motion.div
                      className={styles.faqAnswer}
                      initial={false}
                      animate={{
                        height: openFaqs.includes(faq.id) ? 'auto' : 0,
                        opacity: openFaqs.includes(faq.id) ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.faqAnswerContent}>
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Contact Support */}
      <section className={styles.contactSupport}>
        <Container>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div className={styles.sectionHeader} variants={fadeInUp}>
              <h2>Still Need Help?</h2>
              <p>Our expert support team is here to assist you 24/7</p>
            </motion.div>

            <motion.div className={styles.contactOptions} variants={stagger}>
              {contactOptions.map((option, index) => (
                <motion.div
                  key={index}
                  className={styles.contactCard}
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.contactIcon}>
                    <option.icon size={24} />
                  </div>
                  
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>
                  
                  <div className={styles.contactAvailability}>
                    <CheckCircle size={16} />
                    <span>{option.availability}</span>
                  </div>
                  
                  <Button 
                    variant={option.variant as 'primary' | 'outline'} 
                    className={styles.contactBtn}
                  >
                    {option.action}
                  </Button>
                </motion.div>
              ))}
            </motion.div>

            <motion.div className={styles.additionalResources} variants={fadeInUp}>
              <h3>Additional Resources</h3>
              <div className={styles.resourceLinks}>
                <a href="/tutorials" className={styles.resourceLink}>
                  <PlayCircle size={20} />
                  <span>Video Tutorials</span>
                  <ChevronRight size={16} />
                </a>
                <a href="/api-docs" className={styles.resourceLink}>
                  <FileText size={20} />
                  <span>API Documentation</span>
                  <ChevronRight size={16} />
                </a>
                <a href="/community" className={styles.resourceLink}>
                  <MessageCircle size={20} />
                  <span>Community Forum</span>
                  <ChevronRight size={16} />
                </a>
                <a href="/resources" className={styles.resourceLink}>
                  <Download size={20} />
                  <span>Download Center</span>
                  <ChevronRight size={16} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Quick Tips */}
      <section className={styles.quickTips}>
        <Container>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className={styles.tipsContainer}>
              <div className={styles.tipsContent}>
                <h3>Pro Tips for Better Support</h3>
                <ul>
                  <li>
                    <Info size={16} />
                    <span>Include error messages and screenshots when reporting issues</span>
                  </li>
                  <li>
                    <AlertCircle size={16} />
                    <span>Check our status page before reporting system-wide issues</span>
                  </li>
                  <li>
                    <Lightbulb size={16} />
                    <span>Search the knowledge base first - you might find instant answers</span>
                  </li>
                  <li>
                    <CheckCircle size={16} />
                    <span>Join our community forum to connect with other users</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}
