'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  UserX, 
  Mail,
  FileText,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Globe,
  Server,
  Key,
  Users,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import styles from './Privacy.module.scss'

// Metadata for this page - should be handled by layout or metadata API
// export const metadata = {
//   title: 'Privacy Policy | Autopilot.monster - Your Data Protection Rights',
//   description: 'Comprehensive privacy policy for Autopilot.monster. Learn how we collect, use, and protect your personal data in compliance with GDPR, CCPA, and global privacy regulations.',
//   keywords: ['privacy policy', 'data protection', 'GDPR compliance', 'personal data', 'data rights'],
// }

// Privacy sections data
const privacySections = [
  {
    id: 'data-collection',
    title: 'What Data We Collect',
    icon: Database,
    content: [
      {
        subtitle: 'Account Information',
        details: 'Name, email address, company information, billing details, and profile preferences you provide when creating an account.'
      },
      {
        subtitle: 'Usage Data',
        details: 'Information about how you interact with our platform, including feature usage, workflow patterns, and performance metrics.'
      },
      {
        subtitle: 'Technical Data',
        details: 'IP addresses, browser types, device information, and system logs necessary for platform security and optimization.'
      },
      {
        subtitle: 'Communication Data',
        details: 'Records of your communications with our support team, feedback, and survey responses.'
      }
    ]
  },
  {
    id: 'data-usage',
    title: 'How We Use Your Data',
    icon: Eye,
    content: [
      {
        subtitle: 'Service Provision',
        details: 'To provide, maintain, and improve our AI automation platform and deliver the services you request.'
      },
      {
        subtitle: 'Personalization',
        details: 'To customize your experience, recommend relevant AI agents, and optimize workflows for your specific needs.'
      },
      {
        subtitle: 'Security & Fraud Prevention',
        details: 'To detect, prevent, and respond to security threats, fraudulent activities, and unauthorized access attempts.'
      },
      {
        subtitle: 'Communication',
        details: 'To send service updates, security alerts, and respond to your inquiries with your explicit consent.'
      }
    ]
  },
  {
    id: 'data-sharing',
    title: 'Data Sharing & Disclosure',
    icon: Users,
    content: [
      {
        subtitle: 'Third-Party Services',
        details: 'We share minimal necessary data with trusted service providers for payment processing, analytics, and infrastructure management.'
      },
      {
        subtitle: 'Legal Compliance',
        details: 'We may disclose information when required by law, court order, or to protect our rights and the safety of our users.'
      },
      {
        subtitle: 'Business Transfers',
        details: 'In the event of a merger or acquisition, user data may be transferred as part of the business assets with continued privacy protection.'
      },
      {
        subtitle: 'No Data Sales',
        details: 'We never sell, rent, or trade your personal information to third parties for marketing purposes.'
      }
    ]
  },
  {
    id: 'data-storage',
    title: 'Data Storage & Security',
    icon: Server,
    content: [
      {
        subtitle: 'Encryption',
        details: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption with regularly rotated keys.'
      },
      {
        subtitle: 'Access Controls',
        details: 'Strict access controls ensure only authorized personnel can access user data on a need-to-know basis.'
      },
      {
        subtitle: 'Data Centers',
        details: 'Data is stored in SOC 2 Type II certified data centers with 24/7 monitoring and physical security measures.'
      },
      {
        subtitle: 'Backup & Recovery',
        details: 'Regular backups are maintained with the same security standards to ensure data availability and integrity.'
      }
    ]
  },
  {
    id: 'user-rights',
    title: 'Your Privacy Rights',
    icon: Key,
    content: [
      {
        subtitle: 'Access Rights',
        details: 'You can request a copy of all personal data we hold about you in a structured, machine-readable format.'
      },
      {
        subtitle: 'Correction Rights',
        details: 'You can update, correct, or modify your personal information at any time through your account settings.'
      },
      {
        subtitle: 'Deletion Rights',
        details: 'You can request deletion of your personal data, subject to legal retention requirements and legitimate business needs.'
      },
      {
        subtitle: 'Portability Rights',
        details: 'You can export your data and transfer it to another service provider in standard formats.'
      }
    ]
  },
  {
    id: 'cookies',
    title: 'Cookies & Tracking',
    icon: Globe,
    content: [
      {
        subtitle: 'Essential Cookies',
        details: 'Required for platform functionality, authentication, and security. These cannot be disabled without affecting service operation.'
      },
      {
        subtitle: 'Analytics Cookies',
        details: 'Help us understand platform usage patterns to improve user experience. You can opt-out through your browser settings.'
      },
      {
        subtitle: 'Preference Cookies',
        details: 'Remember your settings and preferences to provide a personalized experience across sessions.'
      },
      {
        subtitle: 'Third-Party Cookies',
        details: 'Limited use of trusted third-party cookies for payment processing and customer support functionality.'
      }
    ]
  }
]

// Data retention periods
const retentionPeriods = [
  { type: 'Account Data', period: 'Duration of account + 7 years for legal compliance' },
  { type: 'Usage Logs', period: '24 months for platform optimization' },
  { type: 'Security Logs', period: '12 months for threat monitoring' },
  { type: 'Support Communications', period: '3 years for service improvement' },
  { type: 'Billing Records', period: '10 years for tax and audit purposes' },
  { type: 'Marketing Data', period: 'Until consent withdrawal or 2 years of inactivity' }
]

// Contact information for privacy inquiries
const privacyContacts = [
  {
    title: 'Data Protection Officer',
    email: 'dpo@autopilot.monster',
    description: 'For data protection inquiries and privacy rights requests'
  },
  {
    title: 'Legal Department',
    email: 'legal@autopilot.monster',
    description: 'For legal compliance and policy questions'
  },
  {
    title: 'Security Team',
    email: 'security@autopilot.monster',
    description: 'For security-related privacy concerns'
  }
]

export default function PrivacyPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<HTMLDivElement>(null)
  const retentionRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const sectionsInView = useInView(sectionsRef, { once: true, amount: 0.1 })
  const retentionInView = useInView(retentionRef, { once: true, amount: 0.3 })
  const contactInView = useInView(contactRef, { once: true, amount: 0.3 })

  return (
    <div className={styles.privacyPage}>
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
              <Shield size={16} />
              <span>GDPR & CCPA Compliant</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              Privacy Policy
              <span className={styles.gradient}> & Data Protection</span>
            </h1>
            
            <p className={styles.heroDescription}>
              Your privacy is fundamental to our mission. This comprehensive policy explains how we collect, 
              use, and protect your personal data in compliance with global privacy regulations including 
              GDPR, CCPA, and other applicable laws.
            </p>
            
            <div className={styles.heroMeta}>
              <div className={styles.lastUpdated}>
                <Calendar size={16} />
                <span>Last updated: January 15, 2025</span>
              </div>
              <div className={styles.effectiveDate}>
                <CheckCircle size={16} />
                <span>Effective: January 15, 2025</span>
              </div>
            </div>
            
            <div className={styles.heroActions}>
              <Button size="lg" variant="primary">
                Download PDF Version
                <FileText size={20} />
              </Button>
              <Button size="lg" variant="outline">
                Contact DPO
                <Mail size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Privacy Sections */}
      <section className={styles.sections} ref={sectionsRef}>
        <div className="container">
          <div className={styles.sectionsList}>
            {privacySections.map((section, index) => (
              <motion.div
                key={section.id}
                className={styles.sectionCard}
                initial={{ opacity: 0, y: 40 }}
                animate={sectionsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionIcon}>
                    <section.icon size={24} />
                  </div>
                  <h2>{section.title}</h2>
                </div>
                
                <div className={styles.sectionContent}>
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className={styles.contentItem}>
                      <h3>{item.subtitle}</h3>
                      <p>{item.details}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Retention */}
      <section className={styles.retention} ref={retentionRef}>
        <div className="container">
          <motion.div
            className={styles.retentionContent}
            initial={{ opacity: 0, y: 40 }}
            animate={retentionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <Clock size={32} />
              </div>
              <div>
                <h2>Data Retention Periods</h2>
                <p>We retain your data only as long as necessary for the purposes outlined in this policy</p>
              </div>
            </div>
            
            <div className={styles.retentionTable}>
              {retentionPeriods.map((item, index) => (
                <motion.div
                  key={item.type}
                  className={styles.retentionRow}
                  initial={{ opacity: 0, x: -20 }}
                  animate={retentionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className={styles.dataType}>{item.type}</div>
                  <div className={styles.retentionPeriod}>{item.period}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className={styles.contact} ref={contactRef}>
        <div className="container">
          <motion.div
            className={styles.contactContent}
            initial={{ opacity: 0, y: 40 }}
            animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.sectionHeader}>
              <h2>Privacy Contact Information</h2>
              <p>Have questions about your privacy rights or this policy? We&apos;re here to help.</p>
            </div>
            
            <div className={styles.contactGrid}>
              {privacyContacts.map((contact, index) => (
                <motion.div
                  key={contact.title}
                  className={styles.contactCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <h3>{contact.title}</h3>
                  <p>{contact.description}</p>
                  <a href={`mailto:${contact.email}`} className={styles.contactEmail}>
                    <Mail size={16} />
                    {contact.email}
                  </a>
                </motion.div>
              ))}
            </div>
            
            <div className={styles.legalNotice}>
              <AlertTriangle size={20} />
              <div>
                <h4>Important Legal Notice</h4>
                <p>
                  This privacy policy is governed by the laws of Delaware, United States. 
                  For users in the European Union, our GDPR representative can be contacted at 
                  gdpr-rep@autopilot.monster. We respond to privacy rights requests within 30 days.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}