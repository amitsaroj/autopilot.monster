'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  ArrowLeft, 
  Send,
  CheckCircle,
  AlertCircle,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import Link from 'next/link'
import styles from './ForgotPassword.module.scss'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Email is required')
      return
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setError('')
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className={styles.forgotPasswordPage}>
        <div className="container">
          <motion.div
            className={styles.successCard}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className={styles.successIcon}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CheckCircle size={60} />
            </motion.div>
            
            <h1 className={styles.successTitle}>Email Sent!</h1>
            <p className={styles.successMessage}>
              We&apos;ve sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and follow the instructions to reset your password.
            </p>
            
            <div className={styles.successInfo}>
              <div className={styles.infoItem}>
                <Shield size={16} />
                <span>Reset link expires in 1 hour</span>
              </div>
              <div className={styles.infoItem}>
                <Mail size={16} />
                <span>Check your spam folder if you don&apos;t see it</span>
              </div>
            </div>

            <div className={styles.successActions}>
              <Link href="/login">
                <Button variant="primary" size="lg">
                  Back to Login
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="lg"
                onClick={() => {
                  setIsSubmitted(false)
                  setEmail('')
                }}
              >
                Try Different Email
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.forgotPasswordPage}>
      <div className="container">
        <motion.div
          className={styles.forgotPasswordCard}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.header}>
            <Link href="/login" className={styles.backLink}>
              <ArrowLeft size={20} />
              Back to Login
            </Link>
            
            <div className={styles.headerContent}>
              <div className={styles.logo}>
                <Mail size={32} />
              </div>
              <h1 className={styles.title}>Forgot Password?</h1>
              <p className={styles.subtitle}>
                No worries! Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Mail size={16} />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                className={`${styles.input} ${error ? styles.error : ''}`}
                placeholder="Enter your email address"
                disabled={isLoading}
                required
              />
              {error && (
                <div className={styles.errorMessage}>
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={<Send size={20} />}
              loading={isLoading}
              glow
            >
              Send Reset Link
            </Button>
          </form>

          <div className={styles.helpSection}>
            <div className={styles.helpText}>
              <h3>Having trouble?</h3>
              <ul>
                <li>Make sure you&apos;re using the email associated with your account</li>
                <li>Check your spam folder for the reset email</li>
                <li>Reset links expire after 1 hour for security</li>
              </ul>
            </div>
            
            <div className={styles.supportLink}>
              <p>
                Still need help? <Link href="/contact" className={styles.link}>Contact our support team</Link>
              </p>
            </div>
          </div>

          <div className={styles.loginPrompt}>
            <span>Remember your password?</span>
            <Link href="/login" className={styles.loginLink}>
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}