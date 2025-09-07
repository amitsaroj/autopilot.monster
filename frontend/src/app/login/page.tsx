'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Github, 
  Chrome,
  User,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import Link from 'next/link'
import styles from './Login.module.scss'

interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

export default function LoginPage() {
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!loginForm.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!loginForm.password) {
      newErrors.password = 'Password is required'
    } else if (loginForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Redirect to dashboard on success
    window.location.href = '/dashboard'
  }

  const handleSocialLogin = (provider: 'google' | 'github') => {
    // Handle social login
    console.log(`Login with ${provider}`)
  }

  return (
    <div className={styles.loginPage}>
      <div className="container">
        <div className={styles.loginContainer}>
          <motion.div
            className={styles.loginCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.loginHeader}>
              <div className={styles.logoSection}>
                <div className={styles.logo}>
                  <User size={32} />
                </div>
                <h1 className={styles.title}>Welcome Back</h1>
                <p className={styles.subtitle}>
                  Sign in to your Autopilot.monster account
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className={styles.loginForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Mail size={16} />
                  Email Address
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    className={`${styles.input} ${errors.email ? styles.error : ''}`}
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={14} />
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Lock size={16} />
                  Password
                </label>
                <div className={styles.inputWrapper}>
                  <div className={styles.passwordInput}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className={`${styles.input} ${errors.password ? styles.error : ''}`}
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={styles.passwordToggle}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <div className={styles.errorMessage}>
                      <AlertCircle size={14} />
                      {errors.password}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formOptions}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={loginForm.rememberMe}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, rememberMe: e.target.checked }))}
                    disabled={isLoading}
                  />
                  <span className={styles.checkmark}></span>
                  Remember me
                </label>
                <Link href="/auth/forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight size={20} />}
                loading={isLoading}
                glow
              >
                Sign In
              </Button>
            </form>

            <div className={styles.divider}>
              <span>or continue with</span>
            </div>

            <div className={styles.socialLogin}>
              <motion.button
                type="button"
                className={styles.socialButton}
                onClick={() => handleSocialLogin('google')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                <Chrome size={20} />
                Google
              </motion.button>
              <motion.button
                type="button"
                className={styles.socialButton}
                onClick={() => handleSocialLogin('github')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                <Github size={20} />
                GitHub
              </motion.button>
            </div>

            <div className={styles.signupPrompt}>
              <span>Don&apos;t have an account?</span>
              <Link href="/signup" className={styles.signupLink}>
                Create account
              </Link>
            </div>
          </motion.div>

          <motion.div
            className={styles.featuresList}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className={styles.featuresTitle}>What you&apos;ll get</h3>
            <ul className={styles.features}>
              <li className={styles.feature}>
                <div className={styles.featureIcon}>✨</div>
                <div>
                  <h4>AI-Powered Automation</h4>
                  <p>Access thousands of pre-built AI agents and workflows</p>
                </div>
              </li>
              <li className={styles.feature}>
                <div className={styles.featureIcon}>🚀</div>
                <div>
                  <h4>Instant Downloads</h4>
                  <p>Get your automation tools immediately after purchase</p>
                </div>
              </li>
              <li className={styles.feature}>
                <div className={styles.featureIcon}>🔒</div>
                <div>
                  <h4>Enterprise Security</h4>
                  <p>Bank-grade security for all your automation assets</p>
                </div>
              </li>
              <li className={styles.feature}>
                <div className={styles.featureIcon}>📊</div>
                <div>
                  <h4>Advanced Analytics</h4>
                  <p>Track performance and ROI of your automation investments</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  )
}