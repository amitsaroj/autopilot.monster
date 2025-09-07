'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Package,
  Download,
  Star,
  Activity,
  Calendar,
  Filter,
  RefreshCw,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Eye,
  ShoppingCart,
  UserPlus,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import { Container } from '@/components/ui/Container/Container'
import styles from './AdminAnalytics.module.scss'

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

const overviewStats = [
  {
    label: 'Total Revenue',
    value: '$2.4M',
    change: '+31.7%',
    changeType: 'increase',
    icon: DollarSign,
    color: 'green',
    period: 'vs last month'
  },
  {
    label: 'Active Users',
    value: '18,642',
    change: '+8.2%',
    changeType: 'increase',
    icon: Users,
    color: 'blue',
    period: 'vs last month'
  },
  {
    label: 'Total Downloads',
    value: '245K',
    change: '+15.4%',
    changeType: 'increase',
    icon: Download,
    color: 'purple',
    period: 'vs last month'
  },
  {
    label: 'Conversion Rate',
    value: '3.2%',
    change: '-2.1%',
    changeType: 'decrease',
    icon: TrendingUp,
    color: 'orange',
    period: 'vs last month'
  }
]

const trafficStats = [
  {
    label: 'Page Views',
    value: '1.2M',
    change: '+12.5%',
    changeType: 'increase'
  },
  {
    label: 'Unique Visitors',
    value: '347K',
    change: '+8.7%',
    changeType: 'increase'
  },
  {
    label: 'Bounce Rate',
    value: '42.3%',
    change: '-5.2%',
    changeType: 'decrease'
  },
  {
    label: 'Avg. Session',
    value: '4m 23s',
    change: '+1.8%',
    changeType: 'increase'
  }
]

const topProducts = [
  {
    id: 1,
    title: 'AI Customer Service Agent',
    category: 'AI Agents',
    revenue: '$45,320',
    downloads: 2450,
    rating: 4.8,
    growth: '+23.5%'
  },
  {
    id: 2,
    title: 'E-commerce Automation Workflow',
    category: 'N8N Workflows',
    revenue: '$32,180',
    downloads: 3420,
    rating: 4.6,
    growth: '+18.2%'
  },
  {
    id: 3,
    title: 'Email Marketing Automation',
    category: 'N8N Workflows',
    revenue: '$28,670',
    downloads: 1870,
    rating: 4.9,
    growth: '+31.7%'
  },
  {
    id: 4,
    title: 'Social Media Manager Bot',
    category: 'AI Agents',
    revenue: '$24,450',
    downloads: 1340,
    rating: 4.7,
    growth: '+12.8%'
  },
  {
    id: 5,
    title: 'Analytics Dashboard Template',
    category: 'Templates',
    revenue: '$19,890',
    downloads: 2890,
    rating: 4.5,
    growth: '+8.9%'
  }
]

const recentActivity = [
  {
    id: 1,
    type: 'sale',
    description: 'New purchase: AI Customer Service Agent',
    user: 'john.doe@company.com',
    amount: '$299',
    time: '2 minutes ago',
    icon: ShoppingCart
  },
  {
    id: 2,
    type: 'user',
    description: 'New user registration',
    user: 'sarah.wilson@startup.io',
    amount: null,
    time: '5 minutes ago',
    icon: UserPlus
  },
  {
    id: 3,
    type: 'download',
    description: 'Product downloaded: E-commerce Workflow',
    user: 'mike.chen@business.com',
    amount: 'Free',
    time: '8 minutes ago',
    icon: Download
  },
  {
    id: 4,
    type: 'sale',
    description: 'New purchase: Email Marketing Automation',
    user: 'lisa.parker@agency.com',
    amount: '$79',
    time: '12 minutes ago',
    icon: ShoppingCart
  },
  {
    id: 5,
    type: 'vendor',
    description: 'New vendor application: AutoFlow Solutions',
    user: 'contact@autoflow.com',
    amount: null,
    time: '18 minutes ago',
    icon: Zap
  }
]

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState('30d')

  return (
    <div className={styles.adminAnalyticsPage}>
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
                <h1>Analytics Dashboard</h1>
                <p>Comprehensive insights into platform performance and user behavior</p>
              </div>
              <div className={styles.headerActions}>
                <div className={styles.timeRangeSelector}>
                  <Button 
                    variant={timeRange === '7d' ? 'primary' : 'ghost'} 
                    size="sm"
                    onClick={() => setTimeRange('7d')}
                  >
                    7D
                  </Button>
                  <Button 
                    variant={timeRange === '30d' ? 'primary' : 'ghost'} 
                    size="sm"
                    onClick={() => setTimeRange('30d')}
                  >
                    30D
                  </Button>
                  <Button 
                    variant={timeRange === '90d' ? 'primary' : 'ghost'} 
                    size="sm"
                    onClick={() => setTimeRange('90d')}
                  >
                    90D
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw size={16} />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink size={16} />
                  Export
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Overview Stats */}
          <motion.div className={styles.overviewStats} variants={fadeInUp}>
            {overviewStats.map((stat, index) => (
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
                  <div className={styles.statMeta}>
                    <div className={`${styles.statChange} ${styles[stat.changeType]}`}>
                      {stat.changeType === 'increase' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                      {stat.change}
                    </div>
                    <span className={styles.statPeriod}>{stat.period}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className={styles.contentGrid}>
            {/* Traffic Analytics */}
            <motion.div className={styles.trafficSection} variants={fadeInUp}>
              <div className={styles.sectionHeader}>
                <h2>Traffic Analytics</h2>
                <Button variant="ghost" size="sm">
                  <Eye size={16} />
                  View Details
                </Button>
              </div>
              
              <div className={styles.trafficGrid}>
                {trafficStats.map((stat, index) => (
                  <div key={stat.label} className={styles.trafficStat}>
                    <div className={styles.trafficValue}>{stat.value}</div>
                    <div className={styles.trafficLabel}>{stat.label}</div>
                    <div className={`${styles.trafficChange} ${styles[stat.changeType]}`}>
                      {stat.changeType === 'increase' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.chartPlaceholder}>
                <BarChart3 size={48} />
                <span>Traffic Analytics Chart</span>
                <p>Interactive chart showing page views, sessions, and user engagement over time</p>
              </div>
            </motion.div>

            {/* Top Products */}
            <motion.div className={styles.topProductsSection} variants={fadeInUp}>
              <div className={styles.sectionHeader}>
                <h2>Top Performing Products</h2>
                <Button variant="ghost" size="sm">
                  <Package size={16} />
                  View All
                </Button>
              </div>
              
              <div className={styles.productsList}>
                {topProducts.map((product, index) => (
                  <div key={product.id} className={styles.productItem}>
                    <div className={styles.productRank}>#{index + 1}</div>
                    <div className={styles.productInfo}>
                      <h4>{product.title}</h4>
                      <span className={styles.productCategory}>{product.category}</span>
                    </div>
                    <div className={styles.productStats}>
                      <div className={styles.productStat}>
                        <DollarSign size={14} />
                        <span>{product.revenue}</span>
                      </div>
                      <div className={styles.productStat}>
                        <Download size={14} />
                        <span>{product.downloads.toLocaleString()}</span>
                      </div>
                      <div className={styles.productStat}>
                        <Star size={14} />
                        <span>{product.rating}</span>
                      </div>
                      <div className={`${styles.productGrowth} ${styles.increase}`}>
                        <ArrowUp size={12} />
                        {product.growth}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div className={styles.activitySection} variants={fadeInUp}>
              <div className={styles.sectionHeader}>
                <h2>Recent Activity</h2>
                <Button variant="ghost" size="sm">
                  <Activity size={16} />
                  View All
                </Button>
              </div>
              
              <div className={styles.activityList}>
                {recentActivity.map((activity) => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={`${styles.activityIcon} ${styles[activity.type]}`}>
                      <activity.icon size={16} />
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityDescription}>
                        {activity.description}
                      </div>
                      <div className={styles.activityUser}>
                        {activity.user}
                      </div>
                    </div>
                    <div className={styles.activityMeta}>
                      {activity.amount && (
                        <div className={styles.activityAmount}>
                          {activity.amount}
                        </div>
                      )}
                      <div className={styles.activityTime}>
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div className={styles.metricsSection} variants={fadeInUp}>
              <div className={styles.sectionHeader}>
                <h2>Key Performance Metrics</h2>
                <Button variant="ghost" size="sm">
                  <BarChart3 size={16} />
                  Detailed View
                </Button>
              </div>
              
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>Monthly Recurring Revenue</div>
                  <div className={styles.metricValue}>$342K</div>
                  <div className={styles.metricChange}>
                    <ArrowUp size={12} />
                    +18.5% MoM
                  </div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>Customer Acquisition Cost</div>
                  <div className={styles.metricValue}>$24</div>
                  <div className={styles.metricChange}>
                    <ArrowDown size={12} />
                    -12.3% MoM
                  </div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>Customer Lifetime Value</div>
                  <div className={styles.metricValue}>$1,280</div>
                  <div className={styles.metricChange}>
                    <ArrowUp size={12} />
                    +8.7% MoM
                  </div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricLabel}>Churn Rate</div>
                  <div className={styles.metricValue}>2.1%</div>
                  <div className={styles.metricChange}>
                    <ArrowDown size={12} />
                    -0.8% MoM
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </div>
  )
}
