'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  BarChart3,
  Shield,
  Settings,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Star,
  Search,
  Calendar,
  Mail,
  Phone,
  Crown,
  FileText,
  Activity,
  Target,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Admin.module.scss'

interface AdminStats {
  totalUsers: number
  totalVendors: number
  totalProducts: number
  totalRevenue: number
  monthlyGrowth: number
  pendingApprovals: number
}

interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: 'user' | 'vendor' | 'admin'
  status: 'active' | 'suspended' | 'pending'
  joinDate: string
  totalSpent: number
  lastLogin: string
}

interface Product {
  id: string
  name: string
  vendor: string
  type: 'agent' | 'workflow' | 'tool'
  price: number
  status: 'active' | 'pending' | 'rejected'
  downloads: number
  rating: number
  uploadDate: string
}

// Mock data
const adminStats: AdminStats = {
  totalUsers: 12847,
  totalVendors: 456,
  totalProducts: 2834,
  totalRevenue: 1847920.56,
  monthlyGrowth: 23.5,
  pendingApprovals: 27
}

const recentUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@techcorp.com',
    avatar: '/api/placeholder/40/40',
    role: 'vendor',
    status: 'active',
    joinDate: '2024-11-25',
    totalSpent: 2847.99,
    lastLogin: '2024-12-01T10:30:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson', 
    email: 'sarah@startup.io',
    avatar: '/api/placeholder/40/40',
    role: 'user',
    status: 'active',
    joinDate: '2024-11-20',
    totalSpent: 599.99,
    lastLogin: '2024-11-30T15:45:00Z'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@agency.com',
    avatar: '/api/placeholder/40/40',
    role: 'vendor',
    status: 'pending',
    joinDate: '2024-11-28',
    totalSpent: 0,
    lastLogin: '2024-11-28T09:15:00Z'
  }
]

const pendingProducts: Product[] = [
  {
    id: '1',
    name: 'Advanced CRM Integration Agent',
    vendor: 'TechFlow Solutions',
    type: 'agent',
    price: 299.99,
    status: 'pending',
    downloads: 0,
    rating: 0,
    uploadDate: '2024-11-30'
  },
  {
    id: '2',
    name: 'Social Media Analytics Workflow',
    vendor: 'DataBot Inc',
    type: 'workflow', 
    price: 149.99,
    status: 'pending',
    downloads: 0,
    rating: 0,
    uploadDate: '2024-11-29'
  }
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'products' | 'analytics' | 'settings'>('overview')

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin': return '#8b5cf6'
      case 'vendor': return '#10b981'
      case 'user': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return '#10b981'
      case 'pending': return '#f59e0b'
      case 'suspended': return '#ef4444'
      default: return '#6b7280'
    }
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
    <div className={styles.adminPage}>
      <div className="container">
        <motion.div
          className={styles.adminContainer}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Admin Header */}
          <motion.div
            className={styles.adminHeader}
            variants={itemVariants}
          >
            <div className={styles.headerContent}>
              <div className={styles.adminTitle}>
                <Shield size={32} />
                <div>
                  <h1>Admin Dashboard</h1>
                  <p>Manage users, products, and platform analytics</p>
                </div>
              </div>
              <div className={styles.headerActions}>
                <Button variant="primary" size="md" leftIcon={<Download size={16} />}>
                  Export Data
                </Button>
                <Button variant="ghost" size="md" leftIcon={<Settings size={16} />}>
                  Settings
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className={styles.statsGrid}
            variants={containerVariants}
          >
            <motion.div className={styles.statCard} variants={itemVariants}>
              <div className={styles.statIcon}>
                <Users size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{adminStats.totalUsers.toLocaleString()}</div>
                <div className={styles.statLabel}>Total Users</div>
                <div className={styles.statTrend}>
                  <TrendingUp size={12} />
                  +{adminStats.monthlyGrowth}%
                </div>
              </div>
            </motion.div>

            <motion.div className={styles.statCard} variants={itemVariants}>
              <div className={styles.statIcon}>
                <Package size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{adminStats.totalProducts.toLocaleString()}</div>
                <div className={styles.statLabel}>Total Products</div>
                <div className={styles.statTrend}>
                  <TrendingUp size={12} />
                  +18.7%
                </div>
              </div>
            </motion.div>

            <motion.div className={styles.statCard} variants={itemVariants}>
              <div className={styles.statIcon}>
                <DollarSign size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>${adminStats.totalRevenue.toLocaleString()}</div>
                <div className={styles.statLabel}>Total Revenue</div>
                <div className={styles.statTrend}>
                  <TrendingUp size={12} />
                  +32.1%
                </div>
              </div>
            </motion.div>

            <motion.div className={styles.statCard} variants={itemVariants}>
              <div className={styles.statIcon}>
                <Clock size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{adminStats.pendingApprovals}</div>
                <div className={styles.statLabel}>Pending Approvals</div>
                <div className={styles.statTrend}>
                  <AlertTriangle size={12} />
                  Needs attention
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            className={styles.tabNavigation}
            variants={itemVariants}
          >
            <button
              className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 size={20} />
              Overview
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'users' ? styles.active : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={20} />
              Users
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'products' ? styles.active : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <Package size={20} />
              Products
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'analytics' ? styles.active : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <TrendingUp size={20} />
              Analytics
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'settings' ? styles.active : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={20} />
              Settings
            </button>
          </motion.div>

          {/* Tab Content */}
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
                  <div className={styles.recentUsers}>
                    <h3 className={styles.sectionTitle}>Recent Users</h3>
                    <div className={styles.usersList}>
                      {recentUsers.map((user) => (
                        <div key={user.id} className={styles.userItem}>
                          <div className={styles.userInfo}>
                            <Image
                              src={user.avatar}
                              alt={user.name}
                              width={40}
                              height={40}
                              className={styles.userAvatar}
                            />
                            <div className={styles.userDetails}>
                              <div className={styles.userName}>{user.name}</div>
                              <div className={styles.userEmail}>{user.email}</div>
                            </div>
                          </div>
                          <div className={styles.userMeta}>
                            <span 
                              className={styles.userRole}
                              style={{ color: getRoleColor(user.role) }}
                            >
                              {user.role}
                            </span>
                            <span 
                              className={styles.userStatus}
                              style={{ color: getStatusColor(user.status) }}
                            >
                              {user.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.pendingApprovals}>
                    <h3 className={styles.sectionTitle}>Pending Product Approvals</h3>
                    <div className={styles.approvalsList}>
                      {pendingProducts.map((product) => (
                        <div key={product.id} className={styles.approvalItem}>
                          <div className={styles.productInfo}>
                            <div className={styles.productName}>{product.name}</div>
                            <div className={styles.productMeta}>
                              <span>{product.vendor}</span>
                              <span>${product.price}</span>
                              <span className={styles.productType}>{product.type}</span>
                            </div>
                          </div>
                          <div className={styles.approvalActions}>
                            <Button
                              variant="ghost"
                              size="sm"
                              leftIcon={<CheckCircle size={14} />}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              leftIcon={<XCircle size={14} />}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className={styles.quickActions}>
                  <h3 className={styles.sectionTitle}>Quick Actions</h3>
                  <div className={styles.actionCards}>
                    <Link href="/admin/users" className={styles.actionCard}>
                      <Users size={24} />
                      <span>Manage Users</span>
                    </Link>
                    <Link href="/admin/products" className={styles.actionCard}>
                      <Package size={24} />
                      <span>Review Products</span>
                    </Link>
                    <Link href="/admin/vendors" className={styles.actionCard}>
                      <Crown size={24} />
                      <span>Vendor Applications</span>
                    </Link>
                    <Link href="/admin/analytics" className={styles.actionCard}>
                      <BarChart3 size={24} />
                      <span>View Analytics</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className={styles.analyticsContent}>
                <h3 className={styles.sectionTitle}>Platform Analytics</h3>
                <div className={styles.analyticsGrid}>
                  <div className={styles.chartCard}>
                    <h4>Revenue Trend</h4>
                    <div className={styles.chartPlaceholder}>
                      <BarChart3 size={48} />
                      <p>Revenue analytics chart would go here</p>
                    </div>
                  </div>
                  <div className={styles.chartCard}>
                    <h4>User Growth</h4>
                    <div className={styles.chartPlaceholder}>
                      <TrendingUp size={48} />
                      <p>User growth chart would go here</p>
                    </div>
                  </div>
                  <div className={styles.chartCard}>
                    <h4>Product Performance</h4>
                    <div className={styles.chartPlaceholder}>
                      <Package size={48} />
                      <p>Product performance chart would go here</p>
                    </div>
                  </div>
                  <div className={styles.chartCard}>
                    <h4>Geographic Distribution</h4>
                    <div className={styles.chartPlaceholder}>
                      <Users size={48} />
                      <p>Geographic data visualization would go here</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className={styles.settingsContent}>
                <h3 className={styles.sectionTitle}>Platform Settings</h3>
                <div className={styles.settingsGrid}>
                  <div className={styles.settingCard}>
                    <h4>General Settings</h4>
                    <div className={styles.settingOptions}>
                      <label className={styles.settingOption}>
                        <input type="checkbox" defaultChecked />
                        <span>Allow new vendor registrations</span>
                      </label>
                      <label className={styles.settingOption}>
                        <input type="checkbox" defaultChecked />
                        <span>Require product approval</span>
                      </label>
                      <label className={styles.settingOption}>
                        <input type="checkbox" />
                        <span>Enable maintenance mode</span>
                      </label>
                    </div>
                  </div>

                  <div className={styles.settingCard}>
                    <h4>Commission Settings</h4>
                    <div className={styles.settingFields}>
                      <div className={styles.fieldGroup}>
                        <label>Platform Commission (%)</label>
                        <input type="number" defaultValue="15" className={styles.input} />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label>Minimum Payout Amount</label>
                        <input type="number" defaultValue="50" className={styles.input} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
