'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  Server, 
  FileText,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Globe,
  Database,
  Users,
  Zap,
  Award,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import styles from './Security.module.scss'

// Metadata for this page - should be handled by layout or metadata API
// export const metadata = {
//   title: 'Security | Autopilot.monster - Enterprise Security Practices',
//   description: 'Learn about Autopilot.monster\'s comprehensive security measures, compliance certifications, and data protection practices that keep your business automation secure.',
//   keywords: ['security', 'data protection', 'compliance', 'SOC 2', 'GDPR', 'encryption'],
// }

// Security measures data
const securityMeasures = [
  {
    title: 'Data Encryption',
    icon: Lock,
    measures: [
      'AES-256 encryption for data at rest',
      'TLS 1.3 for data in transit',
      'End-to-end encryption for sensitive workflows',
      'Hardware Security Modules (HSM) for key management'
    ]
  },
  {
    title: 'Access Controls',
    icon: Key,
    measures: [
      'Multi-factor authentication (MFA) required',
      'Role-based access control (RBAC)',
      'Single Sign-On (SSO) integration',
      'Zero-trust network architecture'
    ]
  },
  {
    title: 'Infrastructure Security',
    icon: Server,
    measures: [
      'SOC 2 Type II certified data centers',
      '24/7 security monitoring and alerts',
      'Distributed Denial of Service (DDoS) protection',
      'Network segmentation and firewalls'
    ]
  },
  {
    title: 'Compliance & Auditing',
    icon: FileText,
    measures: [
      'GDPR and CCPA compliance',
      'Regular third-party security audits',
      'Penetration testing quarterly',
      'Vulnerability assessments monthly'
    ]
  }
]

// Compliance certifications
const certifications = [
  {
    name: 'SOC 2 Type II',
    description: 'Annual compliance audit for security, availability, and confidentiality',
    icon: Award,
    status: 'Current',
    validUntil: 'December 2025'
  },
  {
    name: 'ISO 27001',
    description: 'International standard for information security management',
    icon: Globe,
    status: 'In Progress',
    validUntil: 'Expected Q2 2025'
  },
  {
    name: 'GDPR Compliance',
    description: 'EU General Data Protection Regulation compliance',
    icon: Shield,
    status: 'Current',
    validUntil: 'Ongoing'
  },
  {
    name: 'HIPAA Ready',
    description: 'Healthcare data protection for qualifying customers',
    icon: Users,
    status: 'Available',
    validUntil: 'On Request'
  }
]

// Security features
const securityFeatures = [
  {
    title: 'Real-time Threat Detection',
    description: 'AI-powered monitoring systems detect and respond to security threats in real-time',
    icon: Eye
  },
  {
    title: 'Automated Backup & Recovery',
    description: 'Continuous data backup with 99.9% recovery guarantee and point-in-time restoration',
    icon: Database
  },
  {
    title: 'API Security',
    description: 'Rate limiting, request signing, and comprehensive API security monitoring',
    icon: Zap
  },
  {
    title: 'Incident Response',
    description: '24/7 security team with < 15 minute response time for critical incidents',
    icon: AlertTriangle
  }
]

export default function SecurityPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const measuresRef = useRef<HTMLDivElement>(null)
  const certificationsRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const measuresInView = useInView(measuresRef, { once: true, amount: 0.2 })
  const certificationsInView = useInView(certificationsRef, { once: true, amount: 0.2 })
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 })

  return (
    <div className={styles.securityPage}>
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
              <span>Enterprise-Grade Security</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              Security & Compliance
              <span className={styles.gradient}> You Can Trust</span>
            </h1>
            
            <p className={styles.heroDescription}>
              Your data security is our highest priority. We implement industry-leading security measures, 
              maintain rigorous compliance standards, and undergo regular third-party audits to ensure 
              your business automation workflows are protected at the highest level.
            </p>
            
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>99.9%</div>
                <div className={styles.statLabel}>Uptime SLA</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>24/7</div>
                <div className={styles.statLabel}>Monitoring</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>SOC 2</div>
                <div className={styles.statLabel}>Type II Certified</div>
              </div>
            </div>
            
            <div className={styles.heroActions}>
              <Button size="lg" variant="primary">
                Security Documentation
                <FileText size={20} />
              </Button>
              <Button size="lg" variant="outline">
                Contact Security Team
                <Mail size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security Measures */}
      <section className={styles.measures} ref={measuresRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={measuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Comprehensive Security Measures</h2>
            <p>Multi-layered security controls protecting your data and workflows</p>
          </motion.div>

          <div className={styles.measuresGrid}>
            {securityMeasures.map((category, index) => (
              <motion.div
                key={category.title}
                className={styles.measureCard}
                initial={{ opacity: 0, y: 40 }}
                animate={measuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={styles.measureHeader}>
                  <div className={styles.measureIcon}>
                    <category.icon size={24} />
                  </div>
                  <h3>{category.title}</h3>
                </div>
                
                <ul className={styles.measureList}>
                  {category.measures.map((measure, measureIndex) => (
                    <li key={measureIndex}>
                      <CheckCircle size={16} />
                      <span>{measure}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className={styles.certifications} ref={certificationsRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={certificationsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Compliance Certifications</h2>
            <p>Industry-recognized standards and certifications</p>
          </motion.div>

          <div className={styles.certificationsGrid}>
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                className={styles.certCard}
                initial={{ opacity: 0, y: 40 }}
                animate={certificationsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={styles.certIcon}>
                  <cert.icon size={32} />
                </div>
                <div className={styles.certInfo}>
                  <h3>{cert.name}</h3>
                  <p>{cert.description}</p>
                  <div className={styles.certStatus}>
                    <span className={`${styles.status} ${styles[cert.status.toLowerCase().replace(' ', '-')]}`}>
                      {cert.status}
                    </span>
                    <span className={styles.validity}>Valid until {cert.validUntil}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className={styles.features} ref={featuresRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Advanced Security Features</h2>
            <p>Cutting-edge technology protecting your automation workflows</p>
          </motion.div>

          <div className={styles.featuresGrid}>
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 40 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={styles.featureIcon}>
                  <feature.icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Security Team */}
      <section className={styles.contact}>
        <div className="container">
          <motion.div
            className={styles.contactContent}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={featuresInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2>Security Questions or Concerns?</h2>
            <p>
              Our security team is available 24/7 to address any questions or concerns. 
              We take security seriously and are committed to transparency in our practices.
            </p>
            <div className={styles.contactActions}>
              <Button size="lg" variant="primary">
                Report Security Issue
                <AlertTriangle size={20} />
              </Button>
              <Button size="lg" variant="outline">
                Request Security Audit
                <FileText size={18} />
              </Button>
            </div>
            
            <div className={styles.emergencyContact}>
              <AlertTriangle size={20} />
              <div>
                <h4>Security Emergency Contact</h4>
                <p>For urgent security matters: <a href="mailto:security@autopilot.monster">security@autopilot.monster</a></p>
                <p>Response time: &lt; 15 minutes for critical issues</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
