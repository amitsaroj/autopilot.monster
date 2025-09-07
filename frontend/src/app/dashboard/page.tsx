'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Download, 
  CreditCard, 
  Settings,
  BarChart3,
  ShoppingBag,
  Calendar,
  Star,
  ExternalLink,
  Zap,
  Bot,
  Workflow,
  Crown,
  TrendingUp,
  Activity,
  Search,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Dashboard.module.scss'

interface Purchase {
  id: string
  name: string
  type: 'agent' | 'workflow' | 'tool'
  price: number
  purchaseDate: string
  downloadUrl: string
  licenseKey: string
  vendor: string
  image: string
  downloads: number
  status: 'active' | 'expired'
}

// Mock data
const userProfile = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/api/placeholder/100/100',
  joinDate: '2024-01-15',
  totalSpent: 2847.99,
  totalDownloads: 47,
  activeSubscriptions: 2
}

const recentPurchases: Purchase[] = [
  {
    id: '1',
    name: 'AutoLeadGen Pro Agent',
    type: 'agent',
    price: 149.99,
    purchaseDate: '2024-12-01',
    downloadUrl: '/download/agent-1',
    licenseKey: 'ALG-PRO-2024-XYZ123',
    vendor: 'AI Solutions Inc',
    image: '/api/placeholder/300/200',
    downloads: 3,
    status: 'active'
  },
  {
    id: '2',
    name: 'E-commerce Data Sync Workflow',
    type: 'workflow',
    price: 79.99,
    purchaseDate: '2024-11-28',
    downloadUrl: '/download/workflow-1',
    licenseKey: 'EDS-WF-2024-ABC456',
    vendor: 'Automation Masters',
    image: '/api/placeholder/300/200',
    downloads: 5,
    status: 'active'
  },
  {
    id: '3',
    name: 'Social Media Scheduler',
    type: 'tool',
    price: 29.99,
    purchaseDate: '2024-11-25',
    downloadUrl: '/download/tool-1',
    licenseKey: 'SMS-TOOL-2024-DEF789',
    vendor: 'SocialBot Studios',
    image: '/api/placeholder/300/200',
    downloads: 8,
    status: 'active'
  }
]

const usageStats = [
  { label: 'Total Downloads', value: '47', icon: Download, trend: '+12%' },
  { label: 'Active Agents', value: '8', icon: Bot, trend: '+3' },
  { label: 'Running Workflows', value: '15', icon: Workflow, trend: '+5' },
  { label: 'Automations Saved', value: '156h', icon: Zap, trend: '+23h' }
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'purchases' | 'subscriptions' | 'profile'>('overview')
  const [searchTerm, setSearchTerm] = useState('')

  const handleDownload = (purchase: Purchase) => {
    console.log(`Downloading: ${purchase.name}`)
    window.open(purchase.downloadUrl, '_blank')
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

  return (
    <div className={styles.dashboardPage}>
      <div className="container">
        <motion.div
          className={styles.dashboardHeader}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.welcomeSection}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                <Image
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  width={80}
                  height={80}
                  className={styles.avatarImage}
                />
                <div className={styles.statusBadge}>
                  <Crown size={16} />
                </div>
              </div>
              <div className={styles.userDetails}>
                <h1 className={styles.welcomeTitle}>
                  Welcome back, {userProfile.name}!
                </h1>
                <p className={styles.welcomeSubtitle}>
                  Member since {new Date(userProfile.joinDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>
            </div>
            <div className={styles.quickActions}>
              <Link href="/marketplace">
                <Button variant="primary" size="md" rightIcon={<ShoppingBag size={16} />}>
                  Browse Marketplace
                </Button>
              </Link>
              <Button variant="ghost" size="md" rightIcon={<Settings size={16} />}>
                Settings
              </Button>
            </div>
          </div>

          <motion.div
            className={styles.statsGrid}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {usageStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className={styles.statCard}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className={styles.statIcon}>
                  <stat.icon size={24} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                  <div className={styles.statTrend}>
                    <TrendingUp size={12} />
                    {stat.trend}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className={styles.dashboardContent}>
          <motion.div
            className={styles.tabNavigation}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button
              className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 size={20} />
              Overview
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'purchases' ? styles.active : ''}`}
              onClick={() => setActiveTab('purchases')}
            >
              <Download size={20} />
              My Purchases
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'subscriptions' ? styles.active : ''}`}
              onClick={() => setActiveTab('subscriptions')}
            >
              <CreditCard size={20} />
              Subscriptions
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'profile' ? styles.active : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={20} />
              Profile
            </button>
          </motion.div>

          <motion.div
            className={styles.tabContent}
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'overview' && (
              <div className={styles.overviewContent}>
                <div className={styles.overviewGrid}>
                  <div className={styles.recentActivity}>
                    <h3 className={styles.sectionTitle}>
                      <Activity size={20} />
                      Recent Activity
                    </h3>
                    <div className={styles.activityList}>
                      {recentPurchases.slice(0, 3).map((purchase) => (
                        <div key={purchase.id} className={styles.activityItem}>
                          <div className={styles.activityIcon}>
                            {purchase.type === 'agent' && <Bot size={16} />}
                            {purchase.type === 'workflow' && <Workflow size={16} />}
                            {purchase.type === 'tool' && <Zap size={16} />}
                          </div>
                          <div className={styles.activityDetails}>
                            <div className={styles.activityTitle}>{purchase.name}</div>
                            <div className={styles.activityDate}>
                              Downloaded {new Date(purchase.purchaseDate).toLocaleDateString()}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            rightIcon={<ExternalLink size={14} />}
                            onClick={() => handleDownload(purchase)}
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.quickStats}>
                    <h3 className={styles.sectionTitle}>
                      <TrendingUp size={20} />
                      Account Summary
                    </h3>
                    <div className={styles.summaryCards}>
                      <div className={styles.summaryCard}>
                        <div className={styles.summaryValue}>${userProfile.totalSpent}</div>
                        <div className={styles.summaryLabel}>Total Spent</div>
                      </div>
                      <div className={styles.summaryCard}>
                        <div className={styles.summaryValue}>{userProfile.totalDownloads}</div>
                        <div className={styles.summaryLabel}>Downloads</div>
                      </div>
                      <div className={styles.summaryCard}>
                        <div className={styles.summaryValue}>{userProfile.activeSubscriptions}</div>
                        <div className={styles.summaryLabel}>Active Plans</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'purchases' && (
              <div className={styles.purchasesContent}>
                <div className={styles.purchasesHeader}>
                  <h3 className={styles.sectionTitle}>
                    <Download size={20} />
                    My Purchases ({recentPurchases.length})
                  </h3>
                  <div className={styles.searchBox}>
                    <Search size={16} />
                    <input
                      type="text"
                      placeholder="Search purchases..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                </div>

                <div className={styles.purchasesList}>
                  {recentPurchases.map((purchase) => (
                    <motion.div
                      key={purchase.id}
                      className={styles.purchaseCard}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.01, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={styles.purchaseImage}>
                        <Image
                          src={purchase.image}
                          alt={purchase.name}
                          width={120}
                          height={80}
                          className={styles.productImage}
                        />
                        <div className={styles.purchaseType}>
                          {purchase.type}
                        </div>
                      </div>

                      <div className={styles.purchaseDetails}>
                        <h4 className={styles.purchaseName}>{purchase.name}</h4>
                        <p className={styles.purchaseVendor}>by {purchase.vendor}</p>
                        <div className={styles.purchaseMeta}>
                          <span className={styles.purchaseDate}>
                            <Calendar size={14} />
                            {new Date(purchase.purchaseDate).toLocaleDateString()}
                          </span>
                          <span className={styles.purchasePrice}>${purchase.price}</span>
                        </div>
                        <div className={styles.licenseInfo}>
                          <span className={styles.licenseKey}>License: {purchase.licenseKey}</span>
                          <span className={styles.downloadCount}>
                            Downloads: {purchase.downloads}
                          </span>
                        </div>
                      </div>

                      <div className={styles.purchaseActions}>
                        <Button
                          variant="primary"
                          size="sm"
                          rightIcon={<Download size={16} />}
                          onClick={() => handleDownload(purchase)}
                        >
                          Download
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          rightIcon={<Eye size={16} />}
                        >
                          View Details
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'subscriptions' && (
              <div className={styles.subscriptionsContent}>
                <h3 className={styles.sectionTitle}>
                  <CreditCard size={20} />
                  Active Subscriptions
                </h3>
                <div className={styles.subscriptionCard}>
                  <div className={styles.subscriptionHeader}>
                    <div className={styles.planInfo}>
                      <h4 className={styles.planName}>Pro Plan</h4>
                      <div className={styles.planPrice}>$49.99/month</div>
                    </div>
                    <div className={styles.planStatus}>
                      <span className={styles.statusBadge}>Active</span>
                    </div>
                  </div>
                  <div className={styles.subscriptionDetails}>
                    <div className={styles.billingInfo}>
                      <span>Next billing: December 15, 2024</span>
                    </div>
                    <div className={styles.featuresList}>
                      <div className={styles.feature}>
                        <Star size={12} />
                        Unlimited Downloads
                      </div>
                      <div className={styles.feature}>
                        <Star size={12} />
                        Premium Support
                      </div>
                      <div className={styles.feature}>
                        <Star size={12} />
                        Early Access
                      </div>
                    </div>
                  </div>
                  <div className={styles.subscriptionActions}>
                    <Button variant="ghost" size="sm">
                      Manage Plan
                    </Button>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className={styles.profileContent}>
                <h3 className={styles.sectionTitle}>
                  <User size={20} />
                  Profile Settings
                </h3>
                <div className={styles.profileForm}>
                  <div className={styles.profileSection}>
                    <h4>Personal Information</h4>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>Full Name</label>
                        <input type="text" defaultValue={userProfile.name} className={styles.input} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input type="email" defaultValue={userProfile.email} className={styles.input} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Phone Number</label>
                        <input type="tel" placeholder="+1 (555) 123-4567" className={styles.input} />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Company</label>
                        <input type="text" placeholder="Your Company" className={styles.input} />
                      </div>
                    </div>
                  </div>

                  <div className={styles.profileActions}>
                    <Button variant="primary" size="lg">
                      Save Changes
                    </Button>
                    <Button variant="ghost" size="lg">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
