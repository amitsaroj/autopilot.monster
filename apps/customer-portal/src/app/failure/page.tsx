'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  XCircle, 
  RefreshCw, 
  CreditCard, 
  AlertTriangle,
  ArrowLeft,
  Mail,
  Phone,
  MessageCircle,
  ShoppingCart
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import Link from 'next/link'
import styles from './Failure.module.scss'

// Metadata for failed payment page
// title: 'Payment Failed - Autopilot.monster'
// description: 'Payment processing failed. Try again or contact support for assistance.'

interface FailureReason {
  code: string
  message: string
  suggestion: string
}

// Mock failure data
const failureReasons: FailureReason[] = [
  {
    code: 'insufficient_funds',
    message: 'Insufficient funds in your account',
    suggestion: 'Please check your account balance or try a different payment method.'
  },
  {
    code: 'card_declined',
    message: 'Your card was declined by the bank',
    suggestion: 'Contact your bank or try a different payment method.'
  },
  {
    code: 'expired_card',
    message: 'Your card has expired',
    suggestion: 'Please update your payment information with a valid card.'
  },
  {
    code: 'network_error',
    message: 'Network connection error',
    suggestion: 'Please check your internet connection and try again.'
  }
]

const orderData = {
  orderNumber: 'AM-' + Date.now().toString().slice(-8),
  total: 449.97,
  items: [
    { name: 'AutoLeadGen Pro Agent', price: 149.99 },
    { name: 'E-commerce Analytics Workflow', price: 79.99 },
    { name: 'Social Media Automation Suite', price: 219.99 }
  ]
}

export default function FailurePage() {
  const [isRetrying, setIsRetrying] = useState(false)
  const [selectedReason] = useState(failureReasons[1]) // Mock selected reason

  const handleRetryPayment = () => {
    setIsRetrying(true)
    // Simulate retry process
    setTimeout(() => {
      setIsRetrying(false)
      // Redirect to checkout or payment page
      window.location.href = '/checkout'
    }, 2000)
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
    <div className={styles.failurePage}>
      <div className="container">
        <motion.div
          className={styles.failureContainer}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Failure Header */}
          <motion.div 
            className={styles.failureHeader}
            variants={itemVariants}
          >
            <motion.div
              className={styles.failureIcon}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 10,
                delay: 0.2
              }}
            >
              <XCircle size={64} />
            </motion.div>
            <h1 className={styles.failureTitle}>Payment Failed</h1>
            <p className={styles.failureSubtitle}>
              We couldn&apos;t process your payment. Don&apos;t worry, no charges were made to your account.
            </p>
          </motion.div>

          {/* Error Details */}
          <motion.div 
            className={styles.errorDetails}
            variants={itemVariants}
          >
            <div className={styles.errorCard}>
              <div className={styles.errorHeader}>
                <AlertTriangle size={24} />
                <h2>What went wrong?</h2>
              </div>
              <div className={styles.errorContent}>
                <div className={styles.errorCode}>
                  Error Code: <span>{selectedReason.code.toUpperCase()}</span>
                </div>
                <div className={styles.errorMessage}>
                  {selectedReason.message}
                </div>
                <div className={styles.errorSuggestion}>
                  <strong>Suggested Solution:</strong> {selectedReason.suggestion}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            className={styles.orderSummary}
            variants={itemVariants}
          >
            <h2 className={styles.summaryTitle}>
              <ShoppingCart size={24} />
              Your Order Summary
            </h2>
            <div className={styles.orderItems}>
              {orderData.items.map((item, index) => (
                <div key={index} className={styles.orderItem}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemPrice}>${item.price}</span>
                </div>
              ))}
              <div className={styles.orderTotal}>
                <span>Total:</span>
                <span>${orderData.total}</span>
              </div>
            </div>
            <p className={styles.orderNote}>
              Order #{orderData.orderNumber} • Items reserved for 24 hours
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className={styles.actionButtons}
            variants={itemVariants}
          >
            <Button
              variant="primary"
              size="lg"
              leftIcon={<RefreshCw size={20} />}
              onClick={handleRetryPayment}
              disabled={isRetrying}
              className={styles.retryButton}
            >
              {isRetrying ? 'Processing...' : 'Retry Payment'}
            </Button>
            <Link href="/checkout">
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<CreditCard size={20} />}
              >
                Update Payment Method
              </Button>
            </Link>
          </motion.div>

          {/* Alternative Actions */}
          <motion.div 
            className={styles.alternativeActions}
            variants={itemVariants}
          >
            <h3>Need Help?</h3>
            <div className={styles.helpOptions}>
              <Link href="/contact" className={styles.helpOption}>
                <Mail size={20} />
                <div>
                  <span>Email Support</span>
                  <small>support@autopilot.monster</small>
                </div>
              </Link>
              <Link href="/contact" className={styles.helpOption}>
                <Phone size={20} />
                <div>
                  <span>Phone Support</span>
                  <small>+1 (555) 123-4567</small>
                </div>
              </Link>
              <Link href="/contact" className={styles.helpOption}>
                <MessageCircle size={20} />
                <div>
                  <span>Live Chat</span>
                  <small>Available 24/7</small>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Common Issues */}
          <motion.div 
            className={styles.commonIssues}
            variants={itemVariants}
          >
            <h3>Common Issues & Solutions</h3>
            <div className={styles.issuesList}>
              <div className={styles.issue}>
                <h4>Card Declined</h4>
                <p>Check with your bank or try a different payment method. Some banks block international transactions by default.</p>
              </div>
              <div className={styles.issue}>
                <h4>Insufficient Funds</h4>
                <p>Ensure your account has sufficient balance to cover the purchase amount plus any potential fees.</p>
              </div>
              <div className={styles.issue}>
                <h4>Expired Card</h4>
                <p>Update your payment information with a current, valid credit or debit card.</p>
              </div>
              <div className={styles.issue}>
                <h4>Technical Issues</h4>
                <p>Clear your browser cache, disable ad blockers, or try using a different browser or device.</p>
              </div>
            </div>
          </motion.div>

          {/* Back to Shopping */}
          <motion.div 
            className={styles.backToShopping}
            variants={itemVariants}
          >
            <Link href="/marketplace">
              <Button variant="ghost" size="lg" leftIcon={<ArrowLeft size={20} />}>
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
