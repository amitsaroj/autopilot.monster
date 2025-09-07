'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Download, 
  Mail, 
  Calendar,
  Package,
  Star,
  ArrowRight,
  Copy,
  FileText,
  Key
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import Link from 'next/link'
import styles from './Success.module.scss'

// Metadata for successful payment page
// title: 'Payment Successful - Autopilot.monster'
// description: 'Your order has been processed successfully. Download your AI agents and workflows.'

interface OrderItem {
  id: string
  name: string
  type: 'agent' | 'workflow' | 'tool'
  price: number
  licenseKey: string
  downloadUrl: string
}

// Mock order data
const orderData = {
  orderNumber: 'AM-' + Date.now().toString().slice(-8),
  email: 'user@example.com',
  total: 449.97,
  items: [
    {
      id: '1',
      name: 'AutoLeadGen Pro Agent',
      type: 'agent' as const,
      price: 149.99,
      licenseKey: 'AL-PRO-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      downloadUrl: '/downloads/autoleadgen-pro.zip'
    },
    {
      id: '2',
      name: 'E-commerce Analytics Workflow',
      type: 'workflow' as const,
      price: 79.99,
      licenseKey: 'EC-ANA-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      downloadUrl: '/downloads/ecommerce-analytics.n8n'
    },
    {
      id: '3',
      name: 'Social Media Automation Suite',
      type: 'tool' as const,
      price: 219.99,
      licenseKey: 'SM-AUT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      downloadUrl: '/downloads/social-media-suite.zip'
    }
  ]
}

export default function SuccessPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [downloadStarted, setDownloadStarted] = useState<string[]>([])

  const copyLicenseKey = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleDownload = (item: OrderItem) => {
    setDownloadStarted(prev => [...prev, item.id])
    // Simulate download
    setTimeout(() => {
      console.log(`Downloading ${item.name}`)
    }, 1000)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className={styles.successPage}>
      <div className="container">
        <motion.div
          className={styles.successContainer}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Success Header */}
          <motion.div 
            className={styles.successHeader}
            variants={itemVariants}
          >
            <motion.div
              className={styles.successIcon}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 10,
                delay: 0.2
              }}
            >
              <CheckCircle size={64} />
            </motion.div>
            <h1 className={styles.successTitle}>Payment Successful!</h1>
            <p className={styles.successSubtitle}>
              Thank you for your purchase. Your AI agents and workflows are ready for download.
            </p>
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            className={styles.orderSummary}
            variants={itemVariants}
          >
            <div className={styles.orderHeader}>
              <h2 className={styles.orderTitle}>Order Summary</h2>
              <div className={styles.orderMeta}>
                <span className={styles.orderNumber}>Order #{orderData.orderNumber}</span>
                <span className={styles.orderDate}>
                  <Calendar size={16} />
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>

            <div className={styles.orderDetails}>
              <div className={styles.billingInfo}>
                <h3>Billing Information</h3>
                <p>
                  <Mail size={16} />
                  Confirmation sent to: {orderData.email}
                </p>
              </div>
              <div className={styles.orderTotal}>
                <div className={styles.totalAmount}>
                  Total: <span>${orderData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Download Section */}
          <motion.div 
            className={styles.downloadSection}
            variants={itemVariants}
          >
            <h2 className={styles.sectionTitle}>
              <Package size={24} />
              Your Digital Products
            </h2>
            <p className={styles.sectionDescription}>
              Download your purchased AI agents and workflows. Save your license keys for future reference.
            </p>

            <div className={styles.productsList}>
              {orderData.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  className={styles.productCard}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.productInfo}>
                    <div className={styles.productHeader}>
                      <h3 className={styles.productName}>{item.name}</h3>
                      <span className={styles.productType}>{item.type}</span>
                    </div>
                    <div className={styles.productPrice}>${item.price}</div>
                  </div>

                  <div className={styles.licenseSection}>
                    <div className={styles.licenseHeader}>
                      <Key size={16} />
                      License Key
                    </div>
                    <div className={styles.licenseKey}>
                      <code>{item.licenseKey}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Copy size={14} />}
                        onClick={() => copyLicenseKey(item.licenseKey)}
                        className={styles.copyButton}
                      >
                        {copiedKey === item.licenseKey ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>

                  <div className={styles.productActions}>
                    <Button
                      variant="primary"
                      size="md"
                      leftIcon={<Download size={16} />}
                      onClick={() => handleDownload(item)}
                      disabled={downloadStarted.includes(item.id)}
                    >
                      {downloadStarted.includes(item.id) ? 'Downloading...' : 'Download'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="md"
                      leftIcon={<FileText size={16} />}
                    >
                      Documentation
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div 
            className={styles.nextSteps}
            variants={itemVariants}
          >
            <h2 className={styles.sectionTitle}>What's Next?</h2>
            <div className={styles.stepsList}>
              <div className={styles.step}>
                <div className={styles.stepIcon}>
                  <Download size={20} />
                </div>
                <div className={styles.stepContent}>
                  <h3>Download Your Products</h3>
                  <p>Click the download buttons above to get your AI agents and workflows.</p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepIcon}>
                  <Key size={20} />
                </div>
                <div className={styles.stepContent}>
                  <h3>Save License Keys</h3>
                  <p>Keep your license keys safe - you'll need them for activation and support.</p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepIcon}>
                  <Star size={20} />
                </div>
                <div className={styles.stepContent}>
                  <h3>Leave a Review</h3>
                  <p>Help other users by sharing your experience with these products.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className={styles.actionButtons}
            variants={itemVariants}
          >
            <Link href="/dashboard">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={20} />}>
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="ghost" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>

          {/* Support Info */}
          <motion.div 
            className={styles.supportInfo}
            variants={itemVariants}
          >
            <p>
              Need help? Contact our support team at{' '}
              <a href="mailto:support@autopilot.monster">support@autopilot.monster</a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
