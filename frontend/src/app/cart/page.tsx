'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Gift, Shield, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Cart.module.scss'
import { cartApi, checkoutApi } from '@/lib/api'

interface CartItem {
  id: string
  name: string
  type: 'agent' | 'workflow' | 'tool'
  price: number
  originalPrice?: number
  quantity: number
  image: string
  vendor: string
  description: string
  license: 'single' | 'team' | 'enterprise'
  downloadSize: string
  version: string
}

// Realistic dummy cart data
const initialCartItems: CartItem[] = [
  {
    id: '1',
    name: 'AutoLeadGen Pro Agent',
    type: 'agent',
    price: 149.99,
    originalPrice: 199.99,
    quantity: 1,
    image: '/api/placeholder/300/200',
    vendor: 'AI Solutions Inc',
    description: 'Advanced lead generation agent with ML-powered prospect scoring',
    license: 'team',
    downloadSize: '45 MB',
    version: '2.1.4'
  },
  {
    id: '2',
    name: 'E-commerce Data Sync Workflow',
    type: 'workflow',
    price: 79.99,
    quantity: 2,
    image: '/api/placeholder/300/200',
    vendor: 'Automation Masters',
    description: 'Complete e-commerce automation for inventory and order management',
    license: 'single',
    downloadSize: '12 MB',
    version: '1.8.2'
  },
  {
    id: '3',
    name: 'Social Media Scheduler',
    type: 'tool',
    price: 29.99,
    quantity: 1,
    image: '/api/placeholder/300/200',
    vendor: 'SocialBot Studios',
    description: 'Intelligent social media content scheduling and analytics tool',
    license: 'single',
    downloadSize: '8 MB',
    version: '3.0.1'
  }
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cartData, setCartData] = useState(null)

  // Load cart data from API
  useEffect(() => {
    const loadCartData = async () => {
      try {
        const cartData = await cartApi.getCart()
        setCartItems(cartData.items || [])
        setCartData(cartData)
      } catch (error) {
        console.error('Failed to load cart data:', error)
        // Fallback to localStorage if API fails
        try {
          const savedCart = localStorage.getItem('cart')
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart)
            setCartItems(parsedCart)
          }
        } catch (localError) {
          console.error('Failed to load cart from localStorage:', localError)
        }
      }
    }

    loadCartData()
  }, [])

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    try {
      await cartApi.updateCartItem(id, { quantity: newQuantity })
      const updatedItems = cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
      setCartItems(updatedItems)
    } catch (error) {
      console.error('Failed to update cart item:', error)
    }
  }

  const removeItem = async (id: string) => {
    try {
      await cartApi.removeFromCart(id)
      const updatedItems = cartItems.filter(item => item.id !== id)
      setCartItems(updatedItems)
    } catch (error) {
      console.error('Failed to remove cart item:', error)
    }
  }

  const applyPromoCode = async () => {
    try {
      await cartApi.applyCoupon({ code: promoCode })
      setPromoApplied(true)
    } catch (error) {
      console.error('Failed to apply promo code:', error)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discount = promoApplied ? subtotal * 0.2 : 0
  const tax = (subtotal - discount) * 0.08
  const total = subtotal - discount + tax

  const proceedToCheckout = async () => {
    setIsLoading(true)
    try {
      // Create order with cart items
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        totalAmount: total,
        currency: 'USD',
        billing: {
          // This would come from user profile
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        }
      }

      const checkoutSession = await checkoutApi.initiateCheckout(orderData)
      
      // Clear cart and redirect to checkout
      await cartApi.clearCart()
      window.location.href = `/checkout?sessionId=${checkoutSession.sessionId}`
    } catch (error) {
      console.error('Failed to create order:', error)
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (cartItems.length === 0) {
    return (
      <div className={styles.cartPage}>
        <div className="container">
          <motion.div
            className={styles.emptyCart}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <ShoppingBag size={80} className={styles.emptyIcon} />
            <h2>Your cart is empty</h2>
            <p>Discover amazing AI agents and automation tools to power your business</p>
            <Link href="/marketplace">
              <Button
                variant="primary" 
                size="lg"
                rightIcon={<ArrowRight size={20} />}
              >
                Explore Marketplace
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.cartPage}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.cartHeader}>
            <h1 className={styles.cartTitle}>
              <ShoppingBag size={32} />
              Shopping Cart
            </h1>
            <p className={styles.cartSubtitle}>
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>
        </motion.div>

        <div className={styles.cartContent}>
          <motion.div
            className={styles.cartItems}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                className={styles.cartItem}
                variants={itemVariants}
                layout
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.itemImage}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={120}
                    height={80}
                    className={styles.productImage}
                  />
                  <div className={styles.itemType}>
                    {item.type}
                  </div>
                </div>

                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemVendor}>by {item.vendor}</p>
                  <p className={styles.itemDescription}>{item.description}</p>
                  
                  <div className={styles.itemMeta}>
                    <span className={styles.metaItem}>
                      <Shield size={14} />
                      {item.license} license
                    </span>
                    <span className={styles.metaItem}>
                      <Clock size={14} />
                      {item.downloadSize}
                    </span>
                    <span className={styles.metaItem}>
                      v{item.version}
                    </span>
                  </div>
                </div>

                <div className={styles.itemActions}>
                  <div className={styles.quantityControl}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className={styles.quantityBtn}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={styles.quantityBtn}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className={styles.itemPrice}>
                    {item.originalPrice && (
                      <span className={styles.originalPrice}>${item.originalPrice}</span>
                    )}
                    <span className={styles.currentPrice}>${item.price}</span>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className={styles.removeBtn}
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className={styles.cartSummary}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>

              <div className={styles.promoSection}>
                <div className={styles.promoInput}>
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className={styles.promoField}
                  />
                  <button
                    onClick={applyPromoCode}
                    className={styles.promoBtn}
                    disabled={promoApplied}
                  >
                    <Gift size={16} />
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <motion.div
                    className={styles.promoSuccess}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    ✨ SAVE20 applied! 20% discount
                  </motion.div>
                )}
              </div>

              <div className={styles.summaryBreakdown}>
                <div className={styles.summaryLine}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className={styles.summaryLine}>
                    <span className={styles.discount}>Discount (20%)</span>
                    <span className={styles.discount}>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className={styles.summaryLine}>
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className={styles.checkoutActions}>
                <Button
                  onClick={proceedToCheckout}
                  variant="primary"
                  size="lg"
                  fullWidth
                  rightIcon={<ArrowRight size={20} />}
                  loading={isLoading}
                  glow
                >
                  Proceed to Checkout
                </Button>
                
                <Link href="/marketplace">
                  <Button
                    variant="ghost"
                    size="md"
                    fullWidth
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              <div className={styles.securityBadges}>
                <div className={styles.badge}>
                  <Shield size={16} />
                  <span>Secure Checkout</span>
                </div>
                <div className={styles.badge}>
                  <Gift size={16} />
                  <span>Instant Download</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
