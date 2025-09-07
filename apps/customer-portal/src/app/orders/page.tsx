'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  Calendar, 
  Download, 
  Eye, 
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  ChevronDown,
  RefreshCw,
  Star,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Orders.module.scss'

// Metadata for orders page
// title: 'My Orders - Autopilot.monster'
// description: 'View your order history, download purchased products, and track deliveries.'

interface OrderItem {
  id: string
  name: string
  type: 'agent' | 'workflow' | 'tool'
  price: number
  image: string
  licenseKey?: string
  downloadUrl?: string
}

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'completed' | 'processing' | 'failed' | 'refunded'
  total: number
  items: OrderItem[]
  paymentMethod: string
  downloadCount: number
  maxDownloads: number
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'AM-20241201-001',
    date: '2024-12-01T10:30:00Z',
    status: 'completed',
    total: 449.97,
    paymentMethod: 'Stripe',
    downloadCount: 2,
    maxDownloads: 5,
    items: [
      {
        id: '1',
        name: 'AutoLeadGen Pro Agent',
        type: 'agent',
        price: 149.99,
        image: '/api/placeholder/60/60',
        licenseKey: 'AL-PRO-ABC123DEF',
        downloadUrl: '/downloads/autoleadgen-pro.zip'
      },
      {
        id: '2',
        name: 'E-commerce Analytics Workflow',
        type: 'workflow',
        price: 79.99,
        image: '/api/placeholder/60/60',
        licenseKey: 'EC-ANA-XYZ789GHI',
        downloadUrl: '/downloads/ecommerce-analytics.n8n'
      },
      {
        id: '3',
        name: 'Social Media Automation Suite',
        type: 'tool',
        price: 219.99,
        image: '/api/placeholder/60/60',
        licenseKey: 'SM-AUT-JKL456MNO',
        downloadUrl: '/downloads/social-media-suite.zip'
      }
    ]
  },
  {
    id: '2',
    orderNumber: 'AM-20241125-002',
    date: '2024-11-25T14:15:00Z',
    status: 'completed',
    total: 79.99,
    paymentMethod: 'Razorpay',
    downloadCount: 1,
    maxDownloads: 3,
    items: [
      {
        id: '4',
        name: 'Customer Support AI Agent',
        type: 'agent',
        price: 79.99,
        image: '/api/placeholder/60/60',
        licenseKey: 'CS-AI-PQR789STU',
        downloadUrl: '/downloads/customer-support-ai.zip'
      }
    ]
  },
  {
    id: '3',
    orderNumber: 'AM-20241120-003',
    date: '2024-11-20T09:45:00Z',
    status: 'processing',
    total: 199.99,
    paymentMethod: 'Stripe',
    downloadCount: 0,
    maxDownloads: 0,
    items: [
      {
        id: '5',
        name: 'Finance Data Processor',
        type: 'tool',
        price: 199.99,
        image: '/api/placeholder/60/60'
      }
    ]
  }
]

export default function OrdersPage() {
  const [orders] = useState<Order[]>(mockOrders)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'processing' | 'failed' | 'refunded'>('all')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  // Filter orders
  React.useEffect(() => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />
      case 'processing': return <Clock size={16} />
      case 'failed': return <XCircle size={16} />
      case 'refunded': return <RefreshCw size={16} />
      default: return <Clock size={16} />
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed': return '#10b981'
      case 'processing': return '#f59e0b'
      case 'failed': return '#ef4444'
      case 'refunded': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const handleDownload = (item: OrderItem) => {
    console.log('Downloading:', item.name)
    // Handle download logic
  }

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
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
    <div className={styles.ordersPage}>
      <div className="container">
        <motion.div
          className={styles.ordersContainer}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Page Header */}
          <motion.div 
            className={styles.pageHeader}
            variants={itemVariants}
          >
            <div className={styles.headerContent}>
              <div className={styles.headerTitle}>
                <Package size={32} />
                <div>
                  <h1>My Orders</h1>
                  <p>View your order history and download purchased products</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div 
            className={styles.filtersSection}
            variants={itemVariants}
          >
            <div className={styles.searchBox}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Search orders or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterControls}>
              <div className={styles.statusFilter}>
                <Filter size={16} />
                <select
                  value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as 'all' | 'completed' | 'processing' | 'failed' | 'refunded')}
                  className={styles.filterSelect}
                >
                  <option value="all">All Orders</option>
                  <option value="completed">Completed</option>
                  <option value="processing">Processing</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Orders List */}
          <motion.div 
            className={styles.ordersList}
            variants={itemVariants}
          >
            {filteredOrders.length === 0 ? (
              <div className={styles.emptyState}>
                <Package size={48} />
                <h3>No orders found</h3>
                <p>You haven't placed any orders yet or no orders match your search.</p>
                <Link href="/marketplace">
                  <Button variant="primary" size="lg">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  className={styles.orderCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Order Header */}
                  <div 
                    className={styles.orderHeader}
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <div className={styles.orderInfo}>
                      <div className={styles.orderNumber}>
                        Order #{order.orderNumber}
                      </div>
                      <div className={styles.orderMeta}>
                        <span className={styles.orderDate}>
                          <Calendar size={14} />
                          {new Date(order.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <span className={styles.paymentMethod}>
                          via {order.paymentMethod}
                        </span>
                      </div>
                    </div>

                    <div className={styles.orderSummary}>
                      <div 
                        className={styles.orderStatus}
                        style={{ color: getStatusColor(order.status) }}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                      <div className={styles.orderTotal}>
                        ${order.total.toFixed(2)}
                      </div>
                      <div className={styles.itemCount}>
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                      <ChevronDown 
                        size={20}
                        className={`${styles.expandIcon} ${
                          expandedOrder === order.id ? styles.expanded : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Order Details */}
                  {expandedOrder === order.id && (
                    <motion.div
                      className={styles.orderDetails}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.orderItems}>
                        {order.items.map((item) => (
                          <div key={item.id} className={styles.orderItem}>
                            <div className={styles.itemImage}>
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={60}
                                height={60}
                                className={styles.productImage}
                              />
                              <div className={styles.itemType}>{item.type}</div>
                            </div>

                            <div className={styles.itemDetails}>
                              <h3 className={styles.itemName}>{item.name}</h3>
                              <div className={styles.itemPrice}>${item.price}</div>
                              {item.licenseKey && (
                                <div className={styles.licenseKey}>
                                  License: <code>{item.licenseKey}</code>
                                </div>
                              )}
                            </div>

                            <div className={styles.itemActions}>
                              {order.status === 'completed' && item.downloadUrl ? (
                                <>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    leftIcon={<Download size={16} />}
                                    onClick={() => handleDownload(item)}
                                  >
                                    Download
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={<FileText size={16} />}
                                  >
                                    Docs
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={<Star size={16} />}
                                  >
                                    Review
                                  </Button>
                                </>
                              ) : (
                                <div className={styles.pendingActions}>
                                  <span>Processing...</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {order.status === 'completed' && (
                        <div className={styles.downloadInfo}>
                          <div className={styles.downloadStats}>
                            <span>Downloads: {order.downloadCount}/{order.maxDownloads}</span>
                            <span>License keys are permanent and don't expire</span>
                          </div>
                        </div>
                      )}

                      <div className={styles.orderActions}>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Eye size={16} />}
                          as={Link}
                          href={`/orders/${order.id}`}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<FileText size={16} />}
                        >
                          Download Invoice
                        </Button>
                        {order.status === 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<ExternalLink size={16} />}
                          >
                            Request Support
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Summary Stats */}
          <motion.div 
            className={styles.summaryStats}
            variants={itemVariants}
          >
            <div className={styles.statCard}>
              <div className={styles.statValue}>{orders.length}</div>
              <div className={styles.statLabel}>Total Orders</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {orders.filter(o => o.status === 'completed').length}
              </div>
              <div className={styles.statLabel}>Completed</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                ${orders.reduce((sum, order) => 
                  order.status === 'completed' ? sum + order.total : sum, 0
                ).toFixed(2)}
              </div>
              <div className={styles.statLabel}>Total Spent</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {orders.reduce((sum, order) => sum + order.downloadCount, 0)}
              </div>
              <div className={styles.statLabel}>Downloads</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
