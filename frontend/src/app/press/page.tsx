'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Download, 
  Image as ImageIcon, 
  FileText, 
  Users, 
  Award,
  Calendar,
  Mail,
  ExternalLink,
  Briefcase,
  Globe,
  TrendingUp,
  Camera
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import styles from './Press.module.scss'

// Press releases data
const pressReleases = [
  {
    id: 'series-a-funding',
    title: 'Autopilot.monster Secures $15M Series A to Democratize AI Automation',
    date: '2024-03-15',
    category: 'Funding',
    summary: 'Leading AI automation platform raises Series A funding to expand enterprise offerings and global reach.',
    readTime: '3 min read',
    featured: true
  },
  {
    id: 'enterprise-expansion',
    title: 'Autopilot.monster Launches Enterprise Suite for Fortune 500 Companies',
    date: '2024-02-28',
    category: 'Product',
    summary: 'New enterprise features include advanced security, custom integrations, and dedicated support.',
    readTime: '4 min read',
    featured: false
  },
  {
    id: '50k-businesses',
    title: 'Autopilot.monster Reaches 50,000 Business Milestone',
    date: '2024-01-20',
    category: 'Growth',
    summary: 'Platform now serves over 50,000 businesses across 15 countries with 1B+ automated tasks.',
    readTime: '2 min read',
    featured: false
  }
]

// Media coverage
const mediaCoverage = [
  {
    outlet: 'TechCrunch',
    title: 'Autopilot.monster is making AI automation accessible to everyone',
    date: '2024-03-20',
    type: 'Article',
    url: '#'
  },
  {
    outlet: 'Forbes',
    title: 'The Future of Business Automation: Interview with CEO Sarah Chen',
    date: '2024-02-15',
    type: 'Interview',
    url: '#'
  },
  {
    outlet: 'VentureBeat',
    title: 'How Autopilot.monster is revolutionizing workflow automation',
    date: '2024-01-30',
    type: 'Feature',
    url: '#'
  }
]

// Brand assets
const brandAssets = [
  {
    category: 'Logos',
    items: [
      { name: 'Primary Logo (SVG)', size: '2.1 KB', type: 'svg' },
      { name: 'Primary Logo (PNG)', size: '45 KB', type: 'png' },
      { name: 'Logo Dark (SVG)', size: '2.0 KB', type: 'svg' },
      { name: 'Logo Light (SVG)', size: '2.0 KB', type: 'svg' },
      { name: 'Icon Only (SVG)', size: '1.2 KB', type: 'svg' }
    ]
  },
  {
    category: 'Brand Guidelines',
    items: [
      { name: 'Brand Guidelines PDF', size: '2.8 MB', type: 'pdf' },
      { name: 'Color Palette', size: '150 KB', type: 'ai' },
      { name: 'Typography Guide', size: '890 KB', type: 'pdf' }
    ]
  },
  {
    category: 'Screenshots',
    items: [
      { name: 'Platform Dashboard', size: '1.2 MB', type: 'png' },
      { name: 'Workflow Builder', size: '980 KB', type: 'png' },
      { name: 'Marketplace View', size: '1.1 MB', type: 'png' },
      { name: 'Mobile App', size: '750 KB', type: 'png' }
    ]
  }
]

// Company stats
const companyStats = [
  { label: 'Founded', value: '2019' },
  { label: 'Employees', value: '150+' },
  { label: 'Customers', value: '50,000+' },
  { label: 'Countries', value: '15' },
  { label: 'Funding Raised', value: '$28M' },
  { label: 'Tasks Automated', value: '1B+' }
]

export default function PressPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const releasesRef = useRef<HTMLDivElement>(null)
  const assetsRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const releasesInView = useInView(releasesRef, { once: true, amount: 0.2 })
  const assetsInView = useInView(assetsRef, { once: true, amount: 0.2 })
  const contactInView = useInView(contactRef, { once: true, amount: 0.3 })

  return (
    <div className={styles.pressPage}>
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
              <Camera size={16} />
              <span>Press Kit & Media Resources</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              Press Kit &
              <span className={styles.gradient}> Media Center</span>
            </h1>
            
            <p className={styles.heroDescription}>
              Get the latest news, brand assets, and media resources for Autopilot.monster. 
              Find everything you need for press coverage, partnership announcements, 
              and media stories about our AI automation platform.
            </p>
            
            <div className={styles.companyStats}>
              {companyStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className={styles.stat}
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
            
            <div className={styles.heroActions}>
              <Button size="lg" variant="primary">
                Download Press Kit
                <Download size={20} />
              </Button>
              <Button size="lg" variant="outline">
                Contact Media Team
                <Mail size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Press Releases */}
      <section className={styles.releases} ref={releasesRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={releasesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Latest Press Releases</h2>
            <p>Stay updated with our latest company news and announcements</p>
          </motion.div>

          <div className={styles.releasesList}>
            {pressReleases.map((release, index) => (
              <motion.article
                key={release.id}
                className={`${styles.releaseCard} ${release.featured ? styles.featured : ''}`}
                initial={{ opacity: 0, y: 40 }}
                animate={releasesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={styles.releaseHeader}>
                  <div className={styles.releaseCategory}>{release.category}</div>
                  <div className={styles.releaseDate}>
                    <Calendar size={16} />
                    {new Date(release.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                
                <h3 className={styles.releaseTitle}>{release.title}</h3>
                <p className={styles.releaseSummary}>{release.summary}</p>
                
                <div className={styles.releaseFooter}>
                  <span className={styles.readTime}>{release.readTime}</span>
                  <Button variant="outline" size="sm">
                    Read Full Release
                    <ExternalLink size={16} />
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Media Coverage */}
          <motion.div
            className={styles.mediaCoverage}
            initial={{ opacity: 0, y: 40 }}
            animate={releasesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3>Recent Media Coverage</h3>
            <div className={styles.coverageList}>
              {mediaCoverage.map((coverage, index) => (
                <div key={index} className={styles.coverageItem}>
                  <div className={styles.coverageOutlet}>{coverage.outlet}</div>
                  <div className={styles.coverageTitle}>{coverage.title}</div>
                  <div className={styles.coverageMeta}>
                    <span className={styles.coverageType}>{coverage.type}</span>
                    <span className={styles.coverageDate}>{coverage.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Assets */}
      <section className={styles.assets} ref={assetsRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={assetsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Brand Assets & Downloads</h2>
            <p>High-quality brand assets for media use and partnerships</p>
          </motion.div>

          <div className={styles.assetsGrid}>
            {brandAssets.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                className={styles.assetCategory}
                initial={{ opacity: 0, y: 40 }}
                animate={assetsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              >
                <h3>{category.category}</h3>
                <div className={styles.assetsList}>
                  {category.items.map((asset, index) => (
                    <div key={index} className={styles.assetItem}>
                      <div className={styles.assetInfo}>
                        <div className={styles.assetIcon}>
                          {asset.type === 'svg' && <ImageIcon size={20} />}
                          {asset.type === 'png' && <ImageIcon size={20} />}
                          {asset.type === 'pdf' && <FileText size={20} />}
                          {asset.type === 'ai' && <FileText size={20} />}
                        </div>
                        <div>
                          <div className={styles.assetName}>{asset.name}</div>
                          <div className={styles.assetSize}>{asset.size}</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className={styles.contact} ref={contactRef}>
        <div className="container">
          <motion.div
            className={styles.contactContent}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={contactInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
          >
            <h2>Media Contact</h2>
            <p>
              For press inquiries, interview requests, or additional information, 
              please contact our media relations team.
            </p>
            
            <div className={styles.contactInfo}>
              <div className={styles.contactCard}>
                <h3>Sarah Martinez</h3>
                <p>Head of Communications</p>
                <a href="mailto:press@autopilot.monster">press@autopilot.monster</a>
                <a href="tel:+1-555-0123">+1 (555) 012-3456</a>
              </div>
              
              <div className={styles.contactCard}>
                <h3>Media Guidelines</h3>
                <p>Please review our media guidelines before publication:</p>
                <ul>
                  <li>Use approved logos and brand assets only</li>
                  <li>Maintain consistent brand representation</li>
                  <li>Contact us for fact-checking and quotes</li>
                </ul>
              </div>
            </div>
            
            <div className={styles.contactActions}>
              <Button size="lg" variant="primary">
                Send Media Inquiry
                <Mail size={20} />
              </Button>
              <Button size="lg" variant="outline">
                Schedule Interview
                <Calendar size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
