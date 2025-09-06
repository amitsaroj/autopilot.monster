'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Navigation } from '@/components/layout/Navigation/Navigation'
import { Footer } from '@/components/layout/Footer/Footer'
import { Button } from '@/components/ui/Button/Button'
import { 
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Zap,
  CheckCircle,
  AlertCircle,
  User,
  Building,
  Globe,
  ArrowRight
} from 'lucide-react'
import styles from './Contact.module.scss'

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Send us an email and we\'ll respond within 24 hours',
    value: 'hello@autopilot.monster',
    href: 'mailto:hello@autopilot.monster',
    color: 'primary'
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Speak with our support team during business hours',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567',
    color: 'neural'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    description: 'Come see us at our headquarters in San Francisco',
    value: '123 Innovation Drive, San Francisco, CA 94105',
    href: '#',
    color: 'cyber'
  },
  {
    icon: Clock,
    title: 'Business Hours',
    description: 'We\'re here to help during these hours',
    value: 'Monday - Friday: 9:00 AM - 6:00 PM PST',
    href: '#',
    color: 'accent'
  }
]

const departments = [
  {
    name: 'General Support',
    email: 'support@autopilot.monster',
    description: 'General questions and technical support'
  },
  {
    name: 'Sales',
    email: 'sales@autopilot.monster',
    description: 'Pricing, partnerships, and enterprise solutions'
  },
  {
    name: 'Partnerships',
    email: 'partners@autopilot.monster',
    description: 'Business partnerships and integrations'
  },
  {
    name: 'Press & Media',
    email: 'press@autopilot.monster',
    description: 'Media inquiries and press releases'
  }
]

export default function ContactPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    department: '',
    message: ''
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('sending')
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus('success')
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        department: '',
        message: ''
      })
    }, 2000)
  }

  return (
    <>
      <Navigation />
      <main className={styles.contactPage}>
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
                <MessageSquare size={16} />
                <span>We&apos;re Here to Help</span>
              </motion.div>

              <h1 className={styles.heroTitle}>
                Get in <span className={styles.gradientText}>Touch</span> with Our Team
              </h1>
              
              <p className={styles.heroDescription}>
                Have questions about our AI agents, n8n workflows, or need technical support? 
                Our team is ready to help you succeed with automation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className={styles.contactInfo} ref={ref}>
          <div className="container">
            <motion.div
              className={styles.contactInfoGrid}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.title}
                  href={info.href}
                  className={`${styles.contactCard} ${styles[info.color]}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -8 }}
                >
                  <div className={styles.contactIcon}>
                    <info.icon size={32} />
                  </div>
                  <h3 className={styles.contactTitle}>{info.title}</h3>
                  <p className={styles.contactDescription}>{info.description}</p>
                  <div className={styles.contactValue}>{info.value}</div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className={styles.contactForm}>
          <div className="container">
            <motion.div
              className={styles.formContainer}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8 }}
            >
              <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Send us a Message</h2>
                <p className={styles.formDescription}>
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.formLabel}>
                      <User size={16} />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.formLabel}>
                      <Mail size={16} />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="company" className={styles.formLabel}>
                      <Building size={16} />
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="department" className={styles.formLabel}>
                      <Globe size={16} />
                      Department
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={styles.formSelect}
                    >
                      <option value="">Select a department</option>
                      {departments.map((dept) => (
                        <option key={dept.name} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.formLabel}>
                    <Zap size={16} />
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="What is this about?"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.formLabel}>
                    <MessageSquare size={16} />
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={styles.formTextarea}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                  />
                </div>

                <div className={styles.formActions}>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={formStatus === 'sending'}
                    className={styles.submitButton}
                  >
                    {formStatus === 'sending' ? (
                      <>
                        <div className={styles.spinner} />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send size={20} />
                      </>
                    )}
                  </Button>
                </div>

                {formStatus === 'success' && (
                  <motion.div
                    className={styles.formSuccess}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CheckCircle size={20} />
                    <span>Message sent successfully! We&apos;ll get back to you soon.</span>
                  </motion.div>
                )}

                {formStatus === 'error' && (
                  <motion.div
                    className={styles.formError}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AlertCircle size={20} />
                    <span>Something went wrong. Please try again.</span>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </section>

        {/* Departments Section */}
        <section className={styles.departments}>
          <div className="container">
            <motion.div
              className={styles.sectionHeader}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={styles.sectionTitle}>Contact by Department</h2>
              <p className={styles.sectionDescription}>
                Reach out to the right team for faster assistance.
              </p>
            </motion.div>

            <motion.div
              className={styles.departmentsGrid}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {departments.map((dept, index) => (
                <motion.div
                  key={dept.name}
                  className={styles.departmentCard}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -8 }}
                >
                  <h3 className={styles.departmentName}>{dept.name}</h3>
                  <p className={styles.departmentDescription}>{dept.description}</p>
                  <a href={`mailto:${dept.email}`} className={styles.departmentEmail}>
                    {dept.email}
                    <ArrowRight size={16} />
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}