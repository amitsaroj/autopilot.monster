'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  FileText, 
  Scale, 
  AlertTriangle, 
  Shield, 
  CreditCard, 
  Users,
  Ban,
  RefreshCw,
  Mail,
  Calendar,
  CheckCircle,
  Globe,
  Lock,
  UserCheck
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import styles from './Terms.module.scss'

// Metadata for this page - should be handled by layout or metadata API
// export const metadata = {
//   title: 'Terms of Service | Autopilot.monster - Legal Agreement',
//   description: 'Terms of Service for Autopilot.monster AI automation platform. Understand your rights and responsibilities when using our enterprise-grade automation services.',
//   keywords: ['terms of service', 'legal agreement', 'user agreement', 'terms and conditions', 'service terms'],
// }

// Terms sections data
const termsSections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    icon: UserCheck,
    content: [
      {
        subtitle: 'Agreement to Terms',
        details: 'By accessing or using Autopilot.monster, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our service.'
      },
      {
        subtitle: 'Capacity to Contract',
        details: 'You represent that you are at least 18 years old and have the legal capacity to enter into this agreement. If you are using the service on behalf of an organization, you warrant that you have the authority to bind that organization.'
      },
      {
        subtitle: 'Modifications',
        details: 'We reserve the right to modify these terms at any time. We will notify users of significant changes via email or platform notifications. Continued use after modifications constitutes acceptance of the new terms.'
      }
    ]
  },
  {
    id: 'service-description',
    title: 'Service Description',
    icon: Globe,
    content: [
      {
        subtitle: 'Platform Overview',
        details: 'Autopilot.monster provides AI-powered automation tools, workflow management, and integration services. We offer both cloud-based and on-premises deployment options for enterprise customers.'
      },
      {
        subtitle: 'Service Availability',
        details: 'We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. Planned maintenance will be announced in advance, and we will work to minimize service disruptions.'
      },
      {
        subtitle: 'Feature Updates',
        details: 'We continuously improve our platform by adding new features and AI agents. Some features may be in beta and are provided "as-is" with the understanding that they are still under development.'
      }
    ]
  },
  {
    id: 'user-accounts',
    title: 'User Accounts & Registration',
    icon: Users,
    content: [
      {
        subtitle: 'Account Creation',
        details: 'You must provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials.'
      },
      {
        subtitle: 'Account Security',
        details: 'You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use or security breaches. We recommend enabling two-factor authentication.'
      },
      {
        subtitle: 'Account Termination',
        details: 'We may suspend or terminate accounts that violate these terms, engage in fraudulent activities, or pose security risks. You may cancel your account at any time through your account settings.'
      }
    ]
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use Policy',
    icon: Shield,
    content: [
      {
        subtitle: 'Permitted Uses',
        details: 'You may use our platform for legitimate business automation, workflow management, and AI-powered task execution in compliance with applicable laws and these terms.'
      },
      {
        subtitle: 'Prohibited Activities',
        details: 'You may not use our service for illegal activities, spamming, distributing malware, violating intellectual property rights, or attempting to gain unauthorized access to our systems.'
      },
      {
        subtitle: 'Resource Limits',
        details: 'Usage must comply with your subscription tier limits. Excessive usage that impacts platform performance may result in rate limiting or account suspension.'
      }
    ]
  },
  {
    id: 'payment-terms',
    title: 'Payment & Billing',
    icon: CreditCard,
    content: [
      {
        subtitle: 'Subscription Fees',
        details: 'Subscription fees are charged in advance on a monthly or annual basis as selected. All fees are non-refundable except as expressly stated in our refund policy.'
      },
      {
        subtitle: 'Payment Processing',
        details: 'Payments are processed through secure third-party providers including Stripe and Razorpay. We do not store credit card information on our servers.'
      },
      {
        subtitle: 'Late Payments',
        details: 'Accounts with overdue payments may be suspended. A late fee of 1.5% per month may be applied to overdue amounts. Service will be restored upon payment of all outstanding amounts.'
      },
      {
        subtitle: 'Price Changes',
        details: 'We may change subscription prices with 30 days notice. Existing subscribers will be grandfathered at their current rate for the remainder of their billing cycle.'
      }
    ]
  },
  {
    id: 'data-ownership',
    title: 'Data Ownership & Privacy',
    icon: Lock,
    content: [
      {
        subtitle: 'Your Data',
        details: 'You retain ownership of all data you upload or create using our platform. We do not claim ownership rights to your content, workflows, or generated outputs.'
      },
      {
        subtitle: 'Platform Data',
        details: 'We own the platform, software, algorithms, and any improvements or modifications we make. This includes aggregated usage data that does not identify specific users.'
      },
      {
        subtitle: 'Data Processing',
        details: 'We process your data solely to provide our services. Our data processing practices are detailed in our Privacy Policy, which is incorporated by reference into these terms.'
      }
    ]
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    icon: AlertTriangle,
    content: [
      {
        subtitle: 'Service Disclaimer',
        details: 'Our platform is provided "as-is" and "as-available." We disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.'
      },
      {
        subtitle: 'Damage Limitations',
        details: 'Our total liability for any claim shall not exceed the amount paid by you for our services in the 12 months preceding the claim. We are not liable for indirect, incidental, or consequential damages.'
      },
      {
        subtitle: 'Force Majeure',
        details: 'We are not liable for delays or failures due to circumstances beyond our reasonable control, including natural disasters, government actions, or third-party service outages.'
      }
    ]
  },
  {
    id: 'termination',
    title: 'Termination & Suspension',
    icon: Ban,
    content: [
      {
        subtitle: 'Termination Rights',
        details: 'Either party may terminate this agreement at any time. Upon termination, your access to the platform will cease, and we will delete your data according to our data retention policy.'
      },
      {
        subtitle: 'Effect of Termination',
        details: 'Upon termination, all rights and licenses granted to you will cease. Provisions regarding liability, indemnification, and dispute resolution will survive termination.'
      },
      {
        subtitle: 'Data Export',
        details: 'You may export your data for 30 days after termination. After this period, we may permanently delete your data except as required for legal compliance.'
      }
    ]
  }
]

// Quick navigation items
const quickNav = [
  'acceptance',
  'service-description', 
  'user-accounts',
  'acceptable-use',
  'payment-terms',
  'data-ownership',
  'liability',
  'termination'
]

export default function TermsPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const sectionsInView = useInView(sectionsRef, { once: true, amount: 0.1 })
  const footerInView = useInView(footerRef, { once: true, amount: 0.3 })

  return (
    <div className={styles.termsPage}>
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
              <Scale size={16} />
              <span>Legal Agreement</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              Terms of Service
              <span className={styles.gradient}> & User Agreement</span>
            </h1>
            
            <p className={styles.heroDescription}>
              These Terms of Service govern your use of Autopilot.monster and its related services. 
              Please read carefully to understand your rights and responsibilities as a user of our 
              AI automation platform.
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
                Contact Legal Team
                <Mail size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className={styles.quickNav}>
        <div className="container">
          <motion.div
            className={styles.quickNavContent}
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3>Quick Navigation</h3>
            <div className={styles.navLinks}>
              {quickNav.map((sectionId, index) => {
                const section = termsSections.find(s => s.id === sectionId)
                return (
                  <a 
                    key={sectionId} 
                    href={`#${sectionId}`} 
                    className={styles.navLink}
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    {section?.title}
                  </a>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className={styles.sections} ref={sectionsRef}>
        <div className="container">
          <div className={styles.sectionsList}>
            {termsSections.map((section, index) => (
              <motion.div
                key={section.id}
                id={section.id}
                className={styles.sectionCard}
                initial={{ opacity: 0, y: 40 }}
                animate={sectionsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionNumber}>{index + 1}</div>
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

      {/* Footer Information */}
      <section className={styles.footer} ref={footerRef}>
        <div className="container">
          <motion.div
            className={styles.footerContent}
            initial={{ opacity: 0, y: 40 }}
            animate={footerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.legalInfo}>
              <h3>Legal Information</h3>
              <div className={styles.legalGrid}>
                <div className={styles.legalItem}>
                  <h4>Governing Law</h4>
                  <p>These terms are governed by the laws of Delaware, United States, without regard to conflict of law principles.</p>
                </div>
                <div className={styles.legalItem}>
                  <h4>Dispute Resolution</h4>
                  <p>Any disputes will be resolved through binding arbitration in Delaware, except for claims of intellectual property infringement.</p>
                </div>
                <div className={styles.legalItem}>
                  <h4>Severability</h4>
                  <p>If any provision of these terms is found unenforceable, the remaining provisions will remain in full force and effect.</p>
                </div>
                <div className={styles.legalItem}>
                  <h4>Contact Information</h4>
                  <p>For legal inquiries, contact our legal team at legal@autopilot.monster or our registered address below.</p>
                </div>
              </div>
            </div>
            
            <div className={styles.companyInfo}>
              <h4>Company Information</h4>
              <div className={styles.address}>
                <p><strong>Autopilot.monster Inc.</strong></p>
                <p>123 Innovation Drive, Suite 100</p>
                <p>San Francisco, CA 94107</p>
                <p>United States</p>
                <p className={styles.email}>
                  <Mail size={16} />
                  legal@autopilot.monster
                </p>
              </div>
            </div>
            
            <div className={styles.acknowledgment}>
              <AlertTriangle size={24} />
              <div>
                <h4>Acknowledgment</h4>
                <p>
                  By using Autopilot.monster, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms of Service. These terms constitute a 
                  legally binding agreement between you and Autopilot.monster Inc.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}