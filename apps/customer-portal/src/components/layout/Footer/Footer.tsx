'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import {
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Zap,
  Bot,
  Workflow,
  Shield,
  Heart
} from 'lucide-react'
import styles from './Footer.module.scss'

const footerLinks = {
  platform: [
    { name: 'AI Agents', href: '/marketplace?category=ai-agents' },
    { name: 'n8n Workflows', href: '/marketplace?category=workflows' },
    { name: 'Templates', href: '/marketplace?category=templates' },
    { name: 'Integrations', href: '/integrations' },
    { name: 'API Documentation', href: '/docs/api' }
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press Kit', href: '/press' },
    { name: 'Partners', href: '/partners' },
    { name: 'Contact', href: '/contact' }
  ],
  resources: [
    { name: 'Blog', href: '/blog' },
    { name: 'Help Center', href: '/faq' },
    { name: 'Tutorials', href: '/tutorials' },
    { name: 'Community', href: '/community' },
    { name: 'Status', href: '/status' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Terms of Service', href: '/legal/terms' },
    { name: 'Cookie Policy', href: '/legal/cookies' },
    { name: 'GDPR', href: '/legal/gdpr' },
    { name: 'Security', href: '/security' }
  ]
}

const socialLinks = [
  { name: 'GitHub', icon: Github, href: 'https://github.com/autopilot-monster', color: '#333' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/autopilotmonster', color: '#1DA1F2' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/autopilot-monster', color: '#0077B5' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/@autopilotmonster', color: '#FF0000' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/autopilotmonster', color: '#E4405F' }
]

const contactInfo = [
  { icon: Mail, text: 'hello@autopilot.monster', href: 'mailto:hello@autopilot.monster' },
  { icon: Phone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
  { icon: MapPin, text: 'San Francisco, CA', href: '#' }
]

export const Footer: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <footer className={styles.footer} ref={ref}>
      {/* Animated Background */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.particle} />
        <div className={styles.particle} />
        <div className={styles.particle} />
        <div className={styles.particle} />
        <div className={styles.particle} />
      </div>

      <div className="container">
        {/* Main Footer Content */}
        <motion.div
          className={styles.footerContent}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          {/* Top Section */}
          <div className={styles.footerTop}>
            <div className={styles.brandSection}>
              <motion.div
                className={styles.logo}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className={styles.logoIcon}>
                  <Zap size={32} />
                </div>
                <div className={styles.logoText}>
                  <span className={styles.logoName}>Autopilot.monster</span>
                  <span className={styles.logoTagline}>Your Monster of Automation</span>
                </div>
              </motion.div>

              <motion.p
                className={styles.description}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                The world&apos;s most comprehensive AI automation marketplace.
                Discover, deploy, and scale intelligent agents and workflows
                that transform your business operations.
              </motion.p>

              <motion.div
                className={styles.newsletter}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h4 className={styles.newsletterTitle}>Stay Updated</h4>
                <p className={styles.newsletterDescription}>
                  Get the latest AI automation insights and product updates.
                </p>
                <div className={styles.newsletterForm}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={styles.newsletterInput}
                  />
                  <button className={styles.newsletterButton}>
                    Subscribe
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            <div className={styles.concerns}>
              <div className={styles.linksGrid}>
                <motion.div
                  className={styles.linkSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h4 className={styles.linkSectionTitle}>
                    <Bot size={20} />
                    Platform
                  </h4>
                  <ul className={styles.linkList}>
                    {footerLinks.platform.map((link, index) => (
                      <motion.li
                        key={link.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      >
                        <Link href={link.href} className={styles.link}>
                          {link.name}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div
                  className={styles.linkSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h4 className={styles.linkSectionTitle}>
                    <Workflow size={20} />
                    Company
                  </h4>
                  <ul className={styles.linkList}>
                    {footerLinks.company.map((link, index) => (
                      <motion.li
                        key={link.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      >
                        <Link href={link.href} className={styles.link}>
                          {link.name}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div
                  className={styles.linkSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h4 className={styles.linkSectionTitle}>
                    <Shield size={20} />
                    Resources
                  </h4>
                  <ul className={styles.linkList}>
                    {footerLinks.resources.map((link, index) => (
                      <motion.li
                        key={link.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      >
                        <Link href={link.href} className={styles.link}>
                          {link.name}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div
                  className={styles.linkSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <h4 className={styles.linkSectionTitle}>
                    <Shield size={20} />
                    Legal
                  </h4>
                  <ul className={styles.linkList}>
                    {footerLinks.legal.map((link, index) => (
                      <motion.li
                        key={link.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      >
                        <Link href={link.href} className={styles.link}>
                          {link.name}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                </div>
              <div> 
              {/* Social Media Below Footer Menus */}
                <motion.div
                  className={styles.footerSocialSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  {/* <h4 className={styles.footerSocialTitle}>Connect With Us</h4> */}
                  <div className={styles.footerSocialLinks}>
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.footerSocialLink}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                        whileHover={{ scale: 1.15, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <social.icon size={24} />
                        <span className={styles.footerSocialName}>{social.name}</span>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className={styles.footerBottom}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className={styles.copyright}>
            <p>
              © 2025 Autopilot.monster. All rights reserved. Made with{' '}
              <Heart size={16} className={styles.heart} /> for automation enthusiasts.
            </p>
          </div>
          <div className={styles.bottomLinks}>
            <Link href="/legal/privacy" className={styles.bottomLink}>
              Privacy
            </Link>
            <Link href="/legal/terms" className={styles.bottomLink}>
              Terms
            </Link>
            <Link href="/legal/cookies" className={styles.bottomLink}>
              Cookies
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
