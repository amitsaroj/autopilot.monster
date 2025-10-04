'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Zap,
  Database,
  Globe,
  Server,
  Wifi,
  Shield,
  AlertCircle,
  TrendingUp,
  Calendar,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import styles from './Status.module.scss'
import { systemApi } from '@/lib/api/client'

// Metadata for this page - should be handled by layout or metadata API
// export const metadata = {
//   title: 'Status | Autopilot.monster - Real-Time Service Status',
//   description: 'Real-time status monitoring for Autopilot.monster services. Check uptime, performance metrics, and incident history for our AI automation platform.',
//   keywords: ['status', 'uptime', 'service status', 'monitoring', 'incidents', 'performance'],
// }

// Mock service status data (in real app, this would come from monitoring APIs)
const services = [
  {
    name: 'API Gateway',
    status: 'operational',
    uptime: '99.98%',
    responseTime: '45ms',
    description: 'Core API endpoints and authentication'
  },
  {
    name: 'AI Processing',
    status: 'operational',
    uptime: '99.95%',
    responseTime: '180ms',
    description: 'AI agent execution and workflow processing'
  },
  {
    name: 'Database',
    status: 'operational', 
    uptime: '99.99%',
    responseTime: '12ms',
    description: 'User data and workflow storage'
  },
  {
    name: 'File Storage',
    status: 'operational',
    uptime: '99.97%',
    responseTime: '25ms',
    description: 'Asset storage and media delivery'
  },
  {
    name: 'Webhooks',
    status: 'degraded',
    uptime: '99.85%',
    responseTime: '340ms',
    description: 'Outbound webhook delivery system'
  },
  {
    name: 'Notifications',
    status: 'operational',
    uptime: '99.96%',
    responseTime: '95ms',
    description: 'Email and push notification delivery'
  }
]

// Mock incident history
const incidents = [
  {
    id: 'INC-001',
    title: 'Elevated webhook delivery latency',
    status: 'investigating',
    impact: 'minor',
    startTime: '2025-01-15T14:30:00Z',
    description: 'We are experiencing increased latency in webhook delivery. Our team is investigating the root cause.',
    updates: [
      {
        time: '2025-01-15T14:30:00Z',
        message: 'Issue identified - investigating elevated response times in webhook processing'
      },
      {
        time: '2025-01-15T14:45:00Z', 
        message: 'Scaling additional processing capacity to handle increased load'
      }
    ]
  },
  {
    id: 'INC-002',
    title: 'Scheduled maintenance - Database optimization',
    status: 'completed',
    impact: 'none',
    startTime: '2025-01-14T02:00:00Z',
    endTime: '2025-01-14T04:30:00Z',
    description: 'Scheduled database optimization and index rebuilding completed successfully.',
    updates: [
      {
        time: '2025-01-14T02:00:00Z',
        message: 'Maintenance window started - database optimization in progress'
      },
      {
        time: '2025-01-14T04:30:00Z',
        message: 'Maintenance completed successfully - all services restored'
      }
    ]
  }
]

// Mock uptime data for the last 90 days
const generateUptimeData = () => {
  const data = []
  const today = new Date()
  
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    
    // Generate mostly good uptime with occasional issues
    const uptime = Math.random() > 0.05 ? 
      95 + Math.random() * 5 : // 95-100% most days
      Math.random() * 30 + 60  // 60-90% for incident days
    
    data.push({
      date: date.toISOString().split('T')[0],
      uptime: Math.round(uptime * 100) / 100,
      status: uptime > 99 ? 'good' : uptime > 95 ? 'degraded' : 'down'
    })
  }
  
  return data
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'operational': return '#10b981'
    case 'degraded': return '#f59e0b'
    case 'outage': return '#ef4444'
    default: return '#6b7280'
  }
}

const getIncidentColor = (impact: string) => {
  switch (impact) {
    case 'critical': return '#ef4444'
    case 'major': return '#f59e0b'
    case 'minor': return '#f59e0b'
    case 'none': return '#10b981'
    default: return '#6b7280'
  }
}

export default function StatusPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const uptimeRef = useRef<HTMLDivElement>(null)
  const incidentsRef = useRef<HTMLDivElement>(null)
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const servicesInView = useInView(servicesRef, { once: true, amount: 0.2 })
  const uptimeInView = useInView(uptimeRef, { once: true, amount: 0.2 })
  const incidentsInView = useInView(incidentsRef, { once: true, amount: 0.2 })
  
  const [uptimeData, setUptimeData] = useState<{date: string, status: string, uptime: number}[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [systemStatus, setSystemStatus] = useState(null)
  const [systemHealth, setSystemHealth] = useState(null)

  useEffect(() => {
    const loadSystemData = async () => {
      try {
        const [statusData, healthData] = await Promise.all([
          systemApi.getStatus(),
          systemApi.getHealth()
        ])
        setSystemStatus(statusData)
        setSystemHealth(healthData)
      } catch (error) {
        console.error('Failed to load system data:', error)
      }
    }

    loadSystemData()
    setUptimeData(generateUptimeData())
    
    // Update timestamp every 30 seconds
    const interval = setInterval(() => {
      setLastUpdated(new Date())
      loadSystemData() // Refresh system data
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const overallStatus = systemStatus?.status || 
                       services.some(s => s.status === 'outage') ? 'outage' :
                       services.some(s => s.status === 'degraded') ? 'degraded' : 'operational'

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  return (
    <div className={styles.statusPage}>
      {/* Hero Section */}
      <section className={styles.hero} ref={heroRef}>
        <div className="container">
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 60 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
          >
            <div className={styles.badge}>
              <Activity size={16} />
              <span>Real-Time Monitoring</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              System Status
              <span className={styles.gradient}> & Performance</span>
            </h1>
            
            <div className={styles.overallStatus} data-status={overallStatus}>
              {overallStatus === 'operational' && <CheckCircle size={24} />}
              {overallStatus === 'degraded' && <AlertTriangle size={24} />}
              {overallStatus === 'outage' && <XCircle size={24} />}
              <div>
                <h2>All Systems {overallStatus === 'operational' ? 'Operational' : 
                                 overallStatus === 'degraded' ? 'Degraded Performance' : 'Service Outage'}</h2>
                <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>
              </div>
            </div>
            
            <div className={styles.heroActions}>
              <Button size="lg" variant="primary">
                Subscribe to Updates
                <Wifi size={20} />
              </Button>
              <Button size="lg" variant="outline">
                API Status
                <ExternalLink size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Status */}
      <section className={styles.services} ref={servicesRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Service Status</h2>
            <p>Real-time status of all platform components</p>
          </motion.div>

          <div className={styles.servicesList}>
            {(systemStatus?.services ? Object.entries(systemStatus.services).map(([name, status]) => ({
              name: name.charAt(0).toUpperCase() + name.slice(1),
              status: status,
              uptime: '99.9%',
              responseTime: '45ms',
              description: `${name} service status`
            })) : services).map((service, index) => (
              <motion.div
                key={service.name}
                className={styles.serviceCard}
                initial={{ opacity: 0, y: 40 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={styles.serviceMain}>
                  <div className={styles.serviceInfo}>
                    <div className={styles.serviceName}>
                      <div 
                        className={styles.statusIndicator} 
                        style={{ backgroundColor: getStatusColor(service.status) }}
                      />
                      <h3>{service.name}</h3>
                    </div>
                    <p>{service.description}</p>
                  </div>
                  
                  <div className={styles.serviceMetrics}>
                    <div className={styles.metric}>
                      <div className={styles.metricValue}>{service.uptime}</div>
                      <div className={styles.metricLabel}>Uptime</div>
                    </div>
                    <div className={styles.metric}>
                      <div className={styles.metricValue}>{service.responseTime}</div>
                      <div className={styles.metricLabel}>Response</div>
                    </div>
                    <div className={styles.statusBadge} data-status={service.status}>
                      {service.status}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Uptime History */}
      <section className={styles.uptime} ref={uptimeRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={uptimeInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>90-Day Uptime History</h2>
            <p>Historical performance and availability metrics</p>
          </motion.div>

          <motion.div
            className={styles.uptimeChart}
            initial={{ opacity: 0, y: 40 }}
            animate={uptimeInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.chartHeader}>
              <div className={styles.chartLegend}>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: '#10b981' }} />
                  <span>Good (99%+)</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: '#f59e0b' }} />
                  <span>Degraded (95-99%)</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: '#ef4444' }} />
                  <span>Down (&lt;95%)</span>
                </div>
              </div>
            </div>
            
            <div className={styles.chartGrid}>
              {uptimeData.map((day, index) => (
                <div
                  key={day.date}
                  className={styles.chartBar}
                  style={{
                    backgroundColor: day.status === 'good' ? '#10b981' :
                                   day.status === 'degraded' ? '#f59e0b' : '#ef4444',
                    height: `${Math.max(day.uptime, 10)}%`
                  }}
                  title={`${day.date}: ${day.uptime}% uptime`}
                />
              ))}
            </div>
            
            <div className={styles.chartLabels}>
              <span>90 days ago</span>
              <span>Today</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Incident History */}
      <section className={styles.incidents} ref={incidentsRef}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 40 }}
            animate={incidentsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Recent Incidents</h2>
            <p>Latest incidents and maintenance activities</p>
          </motion.div>

          <div className={styles.incidentsList}>
            {incidents.map((incident, index) => (
              <motion.div
                key={incident.id}
                className={styles.incidentCard}
                initial={{ opacity: 0, y: 40 }}
                animate={incidentsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={styles.incidentHeader}>
                  <div className={styles.incidentInfo}>
                    <div className={styles.incidentTitle}>
                      <div 
                        className={styles.impactIndicator}
                        style={{ backgroundColor: getIncidentColor(incident.impact) }}
                      />
                      <h3>{incident.title}</h3>
                    </div>
                    <div className={styles.incidentMeta}>
                      <span className={styles.incidentId}>{incident.id}</span>
                      <span className={styles.incidentTime}>
                        <Clock size={14} />
                        {formatTime(incident.startTime)}
                        {incident.endTime && ` - ${formatTime(incident.endTime)}`}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.incidentStatus}>
                    <div className={`${styles.statusBadge} ${styles[incident.status]}`}>
                      {incident.status}
                    </div>
                    <div className={`${styles.impactBadge} ${styles[incident.impact]}`}>
                      {incident.impact} impact
                    </div>
                  </div>
                </div>
                
                <p className={styles.incidentDescription}>{incident.description}</p>
                
                <div className={styles.incidentUpdates}>
                  <h4>Updates</h4>
                  {incident.updates.map((update, updateIndex) => (
                    <div key={updateIndex} className={styles.updateItem}>
                      <div className={styles.updateTime}>
                        {formatTime(update.time)}
                      </div>
                      <div className={styles.updateMessage}>
                        {update.message}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription CTA */}
      <section className={styles.subscription}>
        <div className="container">
          <motion.div
            className={styles.subscriptionContent}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={incidentsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2>Stay Updated on System Status</h2>
            <p>
              Subscribe to receive real-time notifications about service status, 
              planned maintenance, and incident updates directly to your inbox or Slack.
            </p>
            <div className={styles.subscriptionActions}>
              <Button size="lg" variant="primary">
                Subscribe via Email
                <Wifi size={20} />
              </Button>
              <Button size="lg" variant="outline">
                Slack Integration
                <ExternalLink size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
