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
  AlertCircle,
  Building,
  Phone,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './Signup.module.scss'

interface SignupForm {
  firstName: string
  lastName: string
  email: string
  company: string
  phone: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
  subscribeNewsletter: boolean
}

export default function SignupPage() {
  const [signupForm, setSignupForm] = useState<SignupForm>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: true
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const { register, isLoading } = useAuth()
  const router = useRouter()

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!signupForm.firstName) newErrors.firstName = 'First name is required'
    if (!signupForm.lastName) newErrors.lastName = 'Last name is required'
    if (!signupForm.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(signupForm.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!signupForm.password) {
      newErrors.password = 'Password is required'
    } else if (signupForm.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(signupForm.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }
    
    if (!signupForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (signupForm.password !== signupForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!signupForm.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      handleSignup()
    }
  }

  const handleSignup = async () => {
    const userData = {
      firstName: signupForm.firstName,
      lastName: signupForm.lastName,
      email: signupForm.email,
      company: signupForm.company,
      phone: signupForm.phone,
      password: signupForm.password,
      subscribeNewsletter: signupForm.subscribeNewsletter
    }
    
    const result = await register(userData)
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      setErrors({ general: result.error || 'Registration failed' })
    }
  }

  const handleSocialSignup = (provider: 'google' | 'github') => {
    // Handle social signup
    console.log(`Signup with ${provider}`)
  }

  const passwordStrength = () => {
    const password = signupForm.password
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const getStrengthColor = () => {
    const strength = passwordStrength()
    if (strength <= 2) return '#ef4444'
    if (strength <= 3) return '#f59e0b'
    return '#10b981'
  }

  const getStrengthText = () => {
    const strength = passwordStrength()
    if (strength <= 2) return 'Weak'
    if (strength <= 3) return 'Medium'
    return 'Strong'
  }

  return (
    <div className={styles.signupPage}>
      <div className="container">
        <div className={styles.signupContainer}>
          <motion.div
            className={styles.signupCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.signupHeader}>
              <div className={styles.logoSection}>
                <div className={styles.logo}>
                  <User size={32} />
                </div>
                <h1 className={styles.title}>Create Account</h1>
                <p className={styles.subtitle}>
                  Join thousands of automation enthusiasts
                </p>
              </div>

              {/* Progress indicator */}
              <div className={styles.progressSteps}>
                <div className={`${styles.stepIndicator} ${currentStep >= 1 ? styles.active : ''}`}>
                  <span>1</span>
                  <span>Account Info</span>
                </div>
                <div className={styles.stepConnector}></div>
                <div className={`${styles.stepIndicator} ${currentStep >= 2 ? styles.active : ''}`}>
                  <span>2</span>
                  <span>Security</span>
                </div>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className={styles.signupForm}>
              {errors.general && (
                <div className={styles.errorMessage}>
                  <AlertCircle size={14} />
                  {errors.general}
                </div>
              )}
              
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={styles.stepContent}
                >
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        <User size={16} />
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={signupForm.firstName}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className={`${styles.input} ${errors.firstName ? styles.error : ''}`}
                        placeholder="John"
                        disabled={isLoading}
                      />
                      {errors.firstName && (
                        <div className={styles.errorMessage}>
                          <AlertCircle size={14} />
                          {errors.firstName}
                        </div>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        <User size={16} />
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={signupForm.lastName}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className={`${styles.input} ${errors.lastName ? styles.error : ''}`}
                        placeholder="Doe"
                        disabled={isLoading}
                      />
                      {errors.lastName && (
                        <div className={styles.errorMessage}>
                          <AlertCircle size={14} />
                          {errors.lastName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <Mail size={16} />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                      className={`${styles.input} ${errors.email ? styles.error : ''}`}
                      placeholder="your@email.com"
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <Building size={16} />
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      value={signupForm.company}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, company: e.target.value }))}
                      className={styles.input}
                      placeholder="Your Company Inc."
                      disabled={isLoading}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <Phone size={16} />
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, phone: e.target.value }))}
                      className={styles.input}
                      placeholder="+1 (555) 123-4567"
                      disabled={isLoading}
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={styles.stepContent}
                >
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <Lock size={16} />
                      Password *
                    </label>
                    <div className={styles.passwordInput}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signupForm.password}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                        className={`${styles.input} ${errors.password ? styles.error : ''}`}
                        placeholder="Create a strong password"
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
                    
                    {signupForm.password && (
                      <div className={styles.passwordStrength}>
                        <div className={styles.strengthBar}>
                          <div 
                            className={styles.strengthFill}
                            style={{ 
                              width: `${(passwordStrength() / 5) * 100}%`,
                              backgroundColor: getStrengthColor()
                            }}
                          ></div>
                        </div>
                        <span style={{ color: getStrengthColor() }}>
                          {getStrengthText()}
                        </span>
                      </div>
                    )}
                    
                    {errors.password && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      <Lock size={16} />
                      Confirm Password *
                    </label>
                    <div className={styles.passwordInput}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className={`${styles.input} ${errors.confirmPassword ? styles.error : ''}`}
                        placeholder="Confirm your password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={styles.passwordToggle}
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>

                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={signupForm.agreeToTerms}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                        disabled={isLoading}
                      />
                      <span className={styles.checkmark}></span>
                      <span>
                        I agree to the{' '}
                        <Link href="/terms" className={styles.link}>Terms & Conditions</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
                      </span>
                    </label>
                    {errors.agreeToTerms && (
                      <div className={styles.errorMessage}>
                        <AlertCircle size={14} />
                        {errors.agreeToTerms}
                      </div>
                    )}

                    <label className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={signupForm.subscribeNewsletter}
                        onChange={(e) => setSignupForm(prev => ({ ...prev, subscribeNewsletter: e.target.checked }))}
                        disabled={isLoading}
                      />
                      <span className={styles.checkmark}></span>
                      <span>Subscribe to newsletter for automation insights and updates</span>
                    </label>
                  </div>
                </motion.div>
              )}

              <div className={styles.formActions}>
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                )}
                
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  rightIcon={currentStep === 1 ? <ArrowRight size={20} /> : <CheckCircle size={20} />}
                  loading={isLoading}
                  glow
                  fullWidth={currentStep === 1}
                >
                  {currentStep === 1 ? 'Continue' : 'Create Account'}
                </Button>
              </div>
            </form>

            {currentStep === 1 && (
              <>
                <div className={styles.divider}>
                  <span>or continue with</span>
                </div>

                <div className={styles.socialSignup}>
                  <motion.button
                    type="button"
                    className={styles.socialButton}
                    onClick={() => handleSocialSignup('google')}
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
                    onClick={() => handleSocialSignup('github')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                  >
                    <Github size={20} />
                    GitHub
                  </motion.button>
                </div>
              </>
            )}

            <div className={styles.loginPrompt}>
              <span>Already have an account?</span>
              <Link href="/login" className={styles.loginLink}>
                Sign in
              </Link>
            </div>
          </motion.div>

          <motion.div
            className={styles.benefitsList}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className={styles.benefitsTitle}>Why join Autopilot.monster?</h3>
            <ul className={styles.benefits}>
              <li className={styles.benefit}>
                <div className={styles.benefitIcon}>🤖</div>
                <div>
                  <h4>10,000+ AI Agents</h4>
                  <p>Ready-to-use AI agents for every business need</p>
                </div>
              </li>
              <li className={styles.benefit}>
                <div className={styles.benefitIcon}>⚡</div>
                <div>
                  <h4>N8N Workflows</h4>
                  <p>Professional automation workflows that save hours</p>
                </div>
              </li>
              <li className={styles.benefit}>
                <div className={styles.benefitIcon}>💼</div>
                <div>
                  <h4>Enterprise Tools</h4>
                  <p>Business-grade automation tools and integrations</p>
                </div>
              </li>
              <li className={styles.benefit}>
                <div className={styles.benefitIcon}>📈</div>
                <div>
                  <h4>Vendor Marketplace</h4>
                  <p>Sell your own automation solutions and earn revenue</p>
                </div>
              </li>
              <li className={styles.benefit}>
                <div className={styles.benefitIcon}>🔒</div>
                <div>
                  <h4>Secure & Reliable</h4>
                  <p>Enterprise-grade security with 99.9% uptime</p>
                </div>
              </li>
              <li className={styles.benefit}>
                <div className={styles.benefitIcon}>🎯</div>
                <div>
                  <h4>Expert Support</h4>
                  <p>24/7 support from automation experts</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
