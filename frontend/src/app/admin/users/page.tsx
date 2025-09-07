'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash, 
  Ban, 
  Shield,
  Mail,
  Calendar,
  ArrowUpDown,
  Plus,
  Download,
  UserCheck,
  UserX,
  Crown,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import { Container } from '@/components/ui/Container/Container'
import styles from './AdminUsers.module.scss'

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

const users = [
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.com',
    avatar: '/avatars/sarah.jpg',
    role: 'Premium User',
    status: 'Active',
    joinDate: '2024-01-15',
    lastActive: '2 hours ago',
    totalSpent: '$2,450',
    orders: 12,
    downloads: 45,
    isVerified: true
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    email: 'michael@startupai.io',
    avatar: '/avatars/michael.jpg',
    role: 'Enterprise',
    status: 'Active',
    joinDate: '2023-12-08',
    lastActive: '1 day ago',
    totalSpent: '$8,920',
    orders: 28,
    downloads: 156,
    isVerified: true
  },
  {
    id: 3,
    name: 'Emma Johnson',
    email: 'emma.j@freelancer.com',
    avatar: '/avatars/emma.jpg',
    role: 'Free User',
    status: 'Active',
    joinDate: '2024-02-01',
    lastActive: '3 hours ago',
    totalSpent: '$320',
    orders: 5,
    downloads: 12,
    isVerified: false
  },
  {
    id: 4,
    name: 'David Park',
    email: 'david.park@enterprise.com',
    avatar: '/avatars/david.jpg',
    role: 'Enterprise',
    status: 'Suspended',
    joinDate: '2023-11-20',
    lastActive: '2 weeks ago',
    totalSpent: '$5,680',
    orders: 19,
    downloads: 87,
    isVerified: true
  },
  {
    id: 5,
    name: 'Lisa Wang',
    email: 'lisa.wang@agency.co',
    avatar: '/avatars/lisa.jpg',
    role: 'Premium User',
    status: 'Active',
    joinDate: '2024-01-03',
    lastActive: '5 minutes ago',
    totalSpent: '$1,850',
    orders: 15,
    downloads: 63,
    isVerified: true
  }
]

const stats = [
  {
    label: 'Total Users',
    value: '24,857',
    change: '+12.5%',
    icon: Users,
    color: 'blue'
  },
  {
    label: 'Active Users',
    value: '18,642',
    change: '+8.2%',
    icon: Activity,
    color: 'green'
  },
  {
    label: 'Premium Users',
    value: '3,421',
    change: '+15.7%',
    icon: Crown,
    color: 'purple'
  },
  {
    label: 'Verified Users',
    value: '21,203',
    change: '+5.1%',
    icon: Shield,
    color: 'orange'
  }
]

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedUsers, setSelectedUsers] = React.useState<number[]>([])

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    setSelectedUsers(selectedUsers.length === users.length ? [] : users.map(u => u.id))
  }

  return (
    <div className={styles.adminUsersPage}>
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
                <h1>User Management</h1>
                <p>Manage user accounts, permissions, and activities</p>
              </div>
              <div className={styles.headerActions}>
                <Button variant="outline" size="sm">
                  <Download size={16} />
                  Export
                </Button>
                <Button variant="primary" size="sm">
                  <Plus size={16} />
                  Add User
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
                placeholder="Search users by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.filterButtons}>
              <Button variant="outline" size="sm">
                <Filter size={16} />
                All Users
              </Button>
              <Button variant="outline" size="sm">
                <UserCheck size={16} />
                Active
              </Button>
              <Button variant="outline" size="sm">
                <UserX size={16} />
                Suspended
              </Button>
              <Button variant="outline" size="sm">
                <Crown size={16} />
                Premium
              </Button>
            </div>
          </motion.div>

          {/* Users Table */}
          <motion.div className={styles.tableContainer} variants={fadeInUp}>
            <div className={styles.tableHeader}>
              <div className={styles.tableActions}>
                <label className={styles.selectAll}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length}
                    onChange={handleSelectAll}
                  />
                  <span>Select All ({selectedUsers.length})</span>
                </label>
                {selectedUsers.length > 0 && (
                  <div className={styles.bulkActions}>
                    <Button variant="outline" size="sm">
                      <Mail size={16} />
                      Send Email
                    </Button>
                    <Button variant="outline" size="sm">
                      <Ban size={16} />
                      Suspend
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash size={16} />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
              <div className={styles.sortOptions}>
                <Button variant="ghost" size="sm">
                  <ArrowUpDown size={16} />
                  Sort by Date
                </Button>
              </div>
            </div>

            <div className={styles.table}>
              <div className={styles.tableHead}>
                <div className={styles.tableRow}>
                  <div className={styles.tableCell}>User</div>
                  <div className={styles.tableCell}>Role</div>
                  <div className={styles.tableCell}>Status</div>
                  <div className={styles.tableCell}>Activity</div>
                  <div className={styles.tableCell}>Stats</div>
                  <div className={styles.tableCell}>Actions</div>
                </div>
              </div>
              <div className={styles.tableBody}>
                {users.map((user) => (
                  <motion.div
                    key={user.id}
                    className={styles.tableRow}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={styles.tableCell}>
                      <div className={styles.userInfo}>
                        <label className={styles.userSelect}>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                          />
                        </label>
                        <img src={user.avatar} alt={user.name} className={styles.userAvatar} />
                        <div className={styles.userDetails}>
                          <div className={styles.userName}>
                            {user.name}
                            {user.isVerified && <Shield size={14} className={styles.verifiedIcon} />}
                          </div>
                          <div className={styles.userEmail}>{user.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.tableCell}>
                      <span className={`${styles.roleBadge} ${styles[user.role.toLowerCase().replace(' ', '')]}`}>
                        {user.role}
                      </span>
                    </div>
                    <div className={styles.tableCell}>
                      <span className={`${styles.statusBadge} ${styles[user.status.toLowerCase()]}`}>
                        {user.status}
                      </span>
                    </div>
                    <div className={styles.tableCell}>
                      <div className={styles.activityInfo}>
                        <div className={styles.joinDate}>
                          <Calendar size={14} />
                          Joined {user.joinDate}
                        </div>
                        <div className={styles.lastActive}>
                          Active {user.lastActive}
                        </div>
                      </div>
                    </div>
                    <div className={styles.tableCell}>
                      <div className={styles.userStats}>
                        <div className={styles.statItem}>
                          <span className={styles.statValue}>{user.totalSpent}</span>
                          <span className={styles.statLabel}>Spent</span>
                        </div>
                        <div className={styles.statItem}>
                          <span className={styles.statValue}>{user.orders}</span>
                          <span className={styles.statLabel}>Orders</span>
                        </div>
                        <div className={styles.statItem}>
                          <span className={styles.statValue}>{user.downloads}</span>
                          <span className={styles.statLabel}>Downloads</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.tableCell}>
                      <div className={styles.userActions}>
                        <Button variant="ghost" size="sm">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical size={16} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  )
}
