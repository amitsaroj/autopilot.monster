'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CreditCard, 
  Lock, 
  Shield, 
  Check, 
  ArrowLeft, 
  ArrowRight,
  User,
  Mail,
  MapPin,
  Building,
  Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Checkout.module.scss'

interface CheckoutItem {
  id: string
  name: string
  type: 'agent' | 'workflow' | 'tool'
  price: number
  quantity: number
  image: string
  vendor: string
  license: string
}

interface BillingForm {
  email: string
  firstName: string
  lastName: string
  company: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

interface PaymentForm {
  cardNumber: string
  expiryDate: string
  cvv: string
  nameOnCard: string
}

// Mock checkout items
const checkoutItems: CheckoutItem[] = [
  {
    id: '1',
    name: 'AutoLeadGen Pro Agent',
    type: 'agent',
    price: 149.99,
    quantity: 1,
    image: '/api/placeholder/300/200',
    vendor: 'AI Solutions Inc',
    license: 'Team License'
  },
  {
    id: '2',
    name: 'E-commerce Data Sync Workflow',
    type: 'workflow',
    price: 79.99,
    quantity: 2,
    image: '/api/placeholder/300/200',
    vendor: 'Automation Masters',
    license: 'Single License'
  }
]

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay'>('stripe')
  
  const [billingForm, setBillingForm] = useState<BillingForm>({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: ''
  })

  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const subtotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discount = 29.98 // Example discount
  const tax = (subtotal - discount) * 0.08
  const total = subtotal - discount + tax

  const validateBillingForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!billingForm.email) newErrors.email = 'Email is required'
    if (!billingForm.firstName) newErrors.firstName = 'First name is required'
    if (!billingForm.lastName) newErrors.lastName = 'Last name is required'
    if (!billingForm.address) newErrors.address = 'Address is required'
    if (!billingForm.city) newErrors.city = 'City is required'
    if (!billingForm.zipCode) newErrors.zipCode = 'ZIP code is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePaymentForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!paymentForm.cardNumber) newErrors.cardNumber = 'Card number is required'
    if (!paymentForm.expiryDate) newErrors.expiryDate = 'Expiry date is required'
    if (!paymentForm.cvv) newErrors.cvv = 'CVV is required'
    if (!paymentForm.nameOnCard) newErrors.nameOnCard = 'Name on card is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (currentStep === 1 && validateBillingForm()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validatePaymentForm()) {
      processPayment()
    }
  }

  const processPayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsProcessing(false)
    setOrderComplete(true)
    setCurrentStep(3)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const steps = [
    { number: 1, title: 'Billing Information', icon: User },
    { number: 2, title: 'Payment Details', icon: CreditCard },
    { number: 3, title: 'Order Complete', icon: Check }
  ]

  if (orderComplete) {
    return (
      <div className={styles.checkoutPage}>
        <div className="container">
          <motion.div
            className={styles.successContainer}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.successIcon}>
              <Check size={60} />
            </div>
            <h1 className={styles.successTitle}>Order Complete!</h1>
            <p className={styles.successMessage}>
              Thank you for your purchase. Your order has been processed successfully.
            </p>
            
            <div className={styles.orderDetails}>
              <h3>Order #AP-2024-001</h3>
              <p>Total: ${total.toFixed(2)}</p>
              <p>Download links have been sent to {billingForm.email}</p>
            </div>

            <div className={styles.successActions}>
              <Link href="/dashboard">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight size={20} />}
                >
                  View Downloads
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button
                  variant="ghost"
                  size="lg"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.checkoutPage}>
      <div className="container">
        <motion.div
          className={styles.checkoutHeader}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/cart" className={styles.backLink}>
            <ArrowLeft size={20} />
            Back to Cart
          </Link>
          
          <h1 className={styles.checkoutTitle}>
            <Lock size={28} />
            Secure Checkout
          </h1>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          className={styles.progressSteps}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`${styles.step} ${currentStep >= step.number ? styles.active : ''} ${currentStep > step.number ? styles.completed : ''}`}
            >
              <div className={styles.stepIcon}>
                <step.icon size={20} />
              </div>
              <div className={styles.stepInfo}>
                <div className={styles.stepNumber}>Step {step.number}</div>
                <div className={styles.stepTitle}>{step.title}</div>
              </div>
              {index < steps.length - 1 && <div className={styles.stepConnector} />}
            </div>
          ))}
        </motion.div>

        <div className={styles.checkoutContent}>
          <motion.div
            className={styles.checkoutForm}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="billing"
                  className={styles.formSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className={styles.sectionTitle}>
                    <User size={24} />
                    Billing Information
                  </h2>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        <Mail size={16} />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={billingForm.email}
                        onChange={(e) => setBillingForm(prev => ({ ...prev, email: e.target.value }))}
                        className={`${styles.input} ${errors.email ? styles.error : ''}`}
                        placeholder="your@email.com"
                      />
                      {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>First Name *</label>
                        <input
                          type="text"
                          value={billingForm.firstName}
                          onChange={(e) => setBillingForm(prev => ({ ...prev, firstName: e.target.value }))}
                          className={`${styles.input} ${errors.firstName ? styles.error : ''}`}
                          placeholder="John"
                        />
                        {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Last Name *</label>
                        <input
                          type="text"
                          value={billingForm.lastName}
                          onChange={(e) => setBillingForm(prev => ({ ...prev, lastName: e.target.value }))}
                          className={`${styles.input} ${errors.lastName ? styles.error : ''}`}
                          placeholder="Doe"
                        />
                        {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        <Building size={16} />
                        Company (Optional)
                      </label>
                      <input
                        type="text"
                        value={billingForm.company}
                        onChange={(e) => setBillingForm(prev => ({ ...prev, company: e.target.value }))}
                        className={styles.input}
                        placeholder="Your Company Inc."
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        <MapPin size={16} />
                        Address *
                      </label>
                      <input
                        type="text"
                        value={billingForm.address}
                        onChange={(e) => setBillingForm(prev => ({ ...prev, address: e.target.value }))}
                        className={`${styles.input} ${errors.address ? styles.error : ''}`}
                        placeholder="123 Main Street"
                      />
                      {errors.address && <span className={styles.errorText}>{errors.address}</span>}
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>City *</label>
                        <input
                          type="text"
                          value={billingForm.city}
                          onChange={(e) => setBillingForm(prev => ({ ...prev, city: e.target.value }))}
                          className={`${styles.input} ${errors.city ? styles.error : ''}`}
                          placeholder="New York"
                        />
                        {errors.city && <span className={styles.errorText}>{errors.city}</span>}
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>State</label>
                        <input
                          type="text"
                          value={billingForm.state}
                          onChange={(e) => setBillingForm(prev => ({ ...prev, state: e.target.value }))}
                          className={styles.input}
                          placeholder="NY"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>ZIP Code *</label>
                        <input
                          type="text"
                          value={billingForm.zipCode}
                          onChange={(e) => setBillingForm(prev => ({ ...prev, zipCode: e.target.value }))}
                          className={`${styles.input} ${errors.zipCode ? styles.error : ''}`}
                          placeholder="10001"
                        />
                        {errors.zipCode && <span className={styles.errorText}>{errors.zipCode}</span>}
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        <Smartphone size={16} />
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        value={billingForm.phone}
                        onChange={(e) => setBillingForm(prev => ({ ...prev, phone: e.target.value }))}
                        className={styles.input}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="payment"
                  className={styles.formSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className={styles.sectionTitle}>
                    <CreditCard size={24} />
                    Payment Information
                  </h2>

                  <div className={styles.paymentMethods}>
                    <div
                      className={`${styles.paymentMethod} ${paymentMethod === 'stripe' ? styles.selected : ''}`}
                      onClick={() => setPaymentMethod('stripe')}
                    >
                      <div className={styles.methodInfo}>
                        <CreditCard size={20} />
                        <span>Credit/Debit Card</span>
                      </div>
                      <div className={styles.methodLogos}>
                        <span className={styles.cardLogo}>💳</span>
                      </div>
                    </div>
                    <div
                      className={`${styles.paymentMethod} ${paymentMethod === 'razorpay' ? styles.selected : ''}`}
                      onClick={() => setPaymentMethod('razorpay')}
                    >
                      <div className={styles.methodInfo}>
                        <Shield size={20} />
                        <span>Razorpay</span>
                      </div>
                      <div className={styles.methodLogos}>
                        <span className={styles.cardLogo}>🏦</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Card Number *</label>
                      <input
                        type="text"
                        value={paymentForm.cardNumber}
                        onChange={(e) => setPaymentForm(prev => ({ 
                          ...prev, 
                          cardNumber: formatCardNumber(e.target.value) 
                        }))}
                        className={`${styles.input} ${errors.cardNumber ? styles.error : ''}`}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      {errors.cardNumber && <span className={styles.errorText}>{errors.cardNumber}</span>}
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Expiry Date *</label>
                        <input
                          type="text"
                          value={paymentForm.expiryDate}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                          className={`${styles.input} ${errors.expiryDate ? styles.error : ''}`}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {errors.expiryDate && <span className={styles.errorText}>{errors.expiryDate}</span>}
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>CVV *</label>
                        <input
                          type="text"
                          value={paymentForm.cvv}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, cvv: e.target.value }))}
                          className={`${styles.input} ${errors.cvv ? styles.error : ''}`}
                          placeholder="123"
                          maxLength={4}
                        />
                        {errors.cvv && <span className={styles.errorText}>{errors.cvv}</span>}
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Name on Card *</label>
                      <input
                        type="text"
                        value={paymentForm.nameOnCard}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, nameOnCard: e.target.value }))}
                        className={`${styles.input} ${errors.nameOnCard ? styles.error : ''}`}
                        placeholder="John Doe"
                      />
                      {errors.nameOnCard && <span className={styles.errorText}>{errors.nameOnCard}</span>}
                    </div>
                  </div>

                  <div className={styles.securityNotice}>
                    <Shield size={16} />
                    <span>Your payment information is encrypted and secure</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={styles.formActions}>
              {currentStep > 1 && (
                <Button
                  variant="ghost"
                  size="lg"
                  leftIcon={<ArrowLeft size={20} />}
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Back
                </Button>
              )}
              
              <Button
                variant="primary"
                size="lg"
                rightIcon={currentStep === 2 ? <Lock size={20} /> : <ArrowRight size={20} />}
                onClick={handleNextStep}
                loading={isProcessing}
                glow
              >
                {currentStep === 1 ? 'Continue to Payment' : 'Complete Order'}
              </Button>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            className={styles.orderSummary}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>

              <div className={styles.orderItems}>
                {checkoutItems.map((item) => (
                  <div key={item.id} className={styles.orderItem}>
                    <div className={styles.itemImage}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={40}
                        className={styles.productImage}
                      />
                    </div>
                    <div className={styles.itemDetails}>
                      <h4 className={styles.itemName}>{item.name}</h4>
                      <p className={styles.itemVendor}>by {item.vendor}</p>
                      <p className={styles.itemLicense}>{item.license}</p>
                    </div>
                    <div className={styles.itemPrice}>
                      <span className={styles.quantity}>×{item.quantity}</span>
                      <span className={styles.price}>${item.price}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.summaryBreakdown}>
                <div className={styles.summaryLine}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryLine}>
                  <span className={styles.discount}>Discount</span>
                  <span className={styles.discount}>-${discount.toFixed(2)}</span>
                </div>
                <div className={styles.summaryLine}>
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className={styles.securityBadges}>
                <div className={styles.badge}>
                  <Shield size={16} />
                  <span>SSL Encrypted</span>
                </div>
                <div className={styles.badge}>
                  <Lock size={16} />
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
