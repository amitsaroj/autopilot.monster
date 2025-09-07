'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Store, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Ban, 
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  Star,
  TrendingUp,
  Users,
  Award,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import { Container } from '@/components/ui/Container/Container'
import styles from './AdminVendors.module.scss'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const vendors = [
  {
    id: 1,
    name: 'TechCorp Solutions',
    email: 'contact@techcorp.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    logo: '/vendors/techcorp.jpg',
    status: 'approved',
    joinDate: '2023-11-15',
    lastActive: '2 hours ago',
    totalProducts: 12,
    totalRevenue: '$45,320',
    rating: 4.8,
    totalSales: 2450,
    category: 'AI Solutions',
    verified: true
  },
  {
    id: 2,
    name: 'Automation Pro',
    email: 'hello@automationpro.io',
    phone: '+1 (555) 987-6543',
    location: 'New York, NY',
    logo: '/vendors/automation-pro.jpg',
    status: 'approved',
    joinDate: '2023-12-03',
    lastActive: '1 day ago',
    totalProducts: 8,
    totalRevenue: '$28,670',
    rating: 4.6,
    totalSales: 1870,
    category: 'Workflow Automation',
    verified: true
  },
  {
    id: 3,
    name: 'DataViz Masters',
    email: 'info@datavizmasters.com',
    phone: '+1 (555) 456-7890',
    location: 'Austin, TX',
    logo: '/vendors/dataviz-masters.jpg',
    status: 'pending',
    joinDate: '2024-02-10',
    lastActive: '3 hours ago',
    totalProducts: 3,
    totalRevenue: '$0',
    rating: 0,
    totalSales: 0,
    category: 'Data Analytics',
    verified: false
  },
  {
    id: 4,
    name: 'Social Automation Inc',
    email: 'team@socialautomation.com',
    phone: '+1 (555) 321-0987',
    location: 'Seattle, WA',
    logo: '/vendors/social-automation.jpg',
    status: 'suspended',
    joinDate: '2024-01-08',
    lastActive: '2 weeks ago',
    totalProducts: 5,
    totalRevenue: '$12,450',
    rating: 3.2,
    totalSales: 450,
    category: 'Social Media',
    verified: false
  },
  {
    id: 5,
    name: 'Marketing Masters',
    email: 'support@marketingmasters.ai',
    phone: '+1 (555) 654-3210',
    location: 'Chicago, IL',
    logo: '/vendors/marketing-masters.jpg',
    status: 'approved',
    joinDate: '2024-01-20',
    lastActive: '5 minutes ago',
    totalProducts: 6,
    totalRevenue: '$18,920',
    rating: 4.9,
    totalSales: 890,
    category: 'Marketing Automation',
    verified: true
  }
]

const stats = [
  {
    label: 'Total Vendors',
    value: '347',
    change: '+18.5%',
    icon: Store,
    color: 'blue'
  },
  {
    label: 'Approved',
    value: '298',
    change: '+12.3%',
    icon: CheckCircle,
    color: 'green'
  },
  {
    label: 'Pending Review',
    value: '42',
    change: '+67.2%',
    icon: Clock,
    color: 'orange'
  },
  {
    label: 'Total Revenue',
    value: '$1.8M',
    change: '+24.1%',
    icon: DollarSign,
    color: 'purple'
  }
]

export default function AdminVendorsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedVendors, setSelectedVendors] = React.useState<number[]>([])

  const handleSelectVendor = (vendorId: number) => {
    setSelectedVendors(prev =>
      prev.includes(vendorId)
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    )
  }

  const handleSelectAll = () => {
    setSelectedVendors(selectedVendors.length === vendors.length ? [] : vendors.map(v => v.id))
  }

  return (
    <div className={styles.adminVendorsPage}>
      <Container>
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          {/* Header */}
          <motion.div className={styles.header} variants={fadeInUp}>
            <div className={styles.headerContent}>
              <div className={styles.headerText}>
                <h1>Vendor Management</h1>
                <p>Manage vendor applications, approvals, and performance</p>
              </div>
              <div className={styles.headerActions}>
                <Button variant="outline" size="sm">
                  <Mail size={16} />
                  Send Invite
                </Button>
                <Button variant="primary" size="sm">
                  <CheckCircle size={16} />
                  Bulk Approve
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div className={styles.stats} variants={fadeInUp}>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`${styles.statCard} ${styles[stat.color]}`}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.statIcon}>
                  <stat.icon size={24} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                  <div className={styles.statChange}>{stat.change}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div className={styles.filters} variants={fadeInUp}>
            <div className={styles.searchBox}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search vendors by name, email, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.filterButtons}>
              <Button variant="outline" size="sm">
                <Filter size={16} />
                All Vendors
              </Button>
              <Button variant="outline" size="sm">
                <CheckCircle size={16} />
                Approved
              </Button>
              <Button variant="outline" size="sm">
                <Clock size={16} />
                Pending
              </Button>
              <Button variant="outline" size="sm">
                <XCircle size={16} />
                Suspended
              </Button>
            </div>
          </motion.div>

          {/* Vendors Grid */}
          <motion.div className={styles.vendorsGrid} variants={fadeInUp}>
            {vendors.map((vendor) => (
              <motion.div
                key={vendor.id}
                className={styles.vendorCard}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.vendorHeader}>
                  <div className={styles.vendorLogo}>
                    <img src={vendor.logo} alt={vendor.name} />
                    {vendor.verified && (
                      <div className={styles.verifiedBadge}>
                        <Award size={12} />
                      </div>
                    )}
                  </div>
                  <div className={styles.vendorActions}>
                    <Button variant="ghost" size="sm">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className={styles.vendorContent}>
                  <div className={styles.vendorInfo}>
                    <h3>{vendor.name}</h3>
                    <span className={styles.category}>{vendor.category}</span>
                    <span className={`${styles.statusBadge} ${styles[vendor.status]}`}>
                      {vendor.status === 'approved' && <CheckCircle size={12} />}
                      {vendor.status === 'pending' && <Clock size={12} />}
                      {vendor.status === 'suspended' && <XCircle size={12} />}
                      {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className={styles.vendorContact}>
                    <div className={styles.contactItem}>
                      <Mail size={14} />
                      <span>{vendor.email}</span>
                    </div>
                    <div className={styles.contactItem}>
                      <Phone size={14} />
                      <span>{vendor.phone}</span>
                    </div>
                    <div className={styles.contactItem}>
                      <MapPin size={14} />
                      <span>{vendor.location}</span>
                    </div>
                  </div>
                  
                  <div className={styles.vendorStats}>
                    <div className={styles.statRow}>
                      <div className={styles.stat}>
                        <Package size={14} />
                        <span>{vendor.totalProducts} Products</span>
                      </div>
                      <div className={styles.stat}>
                        <DollarSign size={14} />
                        <span>{vendor.totalRevenue}</span>
                      </div>
                    </div>
                    <div className={styles.statRow}>
                      <div className={styles.stat}>
                        <TrendingUp size={14} />
                        <span>{vendor.totalSales} Sales</span>
                      </div>
                      <div className={styles.stat}>
                        <Star size={14} />
                        <span>{vendor.rating > 0 ? `${vendor.rating} Rating` : 'No Rating'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.vendorDates}>
                    <div className={styles.date}>
                      <Calendar size={12} />
                      <span>Joined {vendor.joinDate}</span>
                    </div>
                    <div className={styles.date}>
                      <span>Active {vendor.lastActive}</span>
                    </div>
                  </div>
                  
                  {vendor.status === 'pending' && (
                    <div className={styles.pendingActions}>
                      <Button variant="primary" size="sm" className={styles.approveBtn}>
                        <CheckCircle size={16} />
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" className={styles.rejectBtn}>
                        <XCircle size={16} />
                        Reject
                      </Button>
                    </div>
                  )}
                  
                  {vendor.status === 'suspended' && (
                    <div className={styles.suspendedInfo}>
                      <AlertTriangle size={16} />
                      <span>Account suspended for policy violations</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </div>
  )
}
