'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  Clock, 
  Zap, 
  Shield, 
  Mail,
  Twitter,
  Github,
  ArrowRight,
  CheckCircle,
  Wrench
} from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import styles from './Maintenance.module.scss'

export default function MaintenancePage() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30
  })

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev
        
        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        }
        
        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const upgrades = [
    {
      icon: <Zap size={24} />,
      title: 'Performance Boost',
      description: 'Optimizing our AI processing engines for 3x faster response times'
    },
    {
      icon: <Shield size={24} />,
      title: 'Enhanced Security',
      description: 'Implementing advanced encryption and security protocols'
    },
    {
      icon: <Settings size={24} />,
      title: 'New Features',
      description: 'Adding advanced workflow automation and collaboration tools'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className={styles.maintenancePage}>
      {/* Animated Background */}
      <div className={styles.backgroundAnimation}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.floatingElement}
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <Settings size={16} />
          </motion.div>
        ))}
      </div>

      <div className="container">
        <motion.div
          className={styles.maintenanceContainer}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Content */}
          <motion.div 
            className={styles.mainContent}
            variants={itemVariants}
          >
            <motion.div
              className={styles.maintenanceIcon}
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Wrench size={64} />
            </motion.div>

            <h1 className={styles.mainTitle}>
              We&apos;re Upgrading Our
              <span className={styles.gradientText}> AI Monster</span>
            </h1>

            <p className={styles.mainDescription}>
              Autopilot.monster is currently undergoing scheduled maintenance to bring you 
              powerful new features and enhanced performance. We&apos;ll be back soon with an even 
              better experience!
            </p>

            {/* Countdown Timer */}
            <div className={styles.countdown}>
              <h3>Estimated Time Remaining</h3>
              <div className={styles.timer}>
                <div className={styles.timeUnit}>
                  <div className={styles.timeValue}>{timeLeft.hours.toString().padStart(2, '0')}</div>
                  <div className={styles.timeLabel}>Hours</div>
                </div>
                <div className={styles.separator}>:</div>
                <div className={styles.timeUnit}>
                  <div className={styles.timeValue}>{timeLeft.minutes.toString().padStart(2, '0')}</div>
                  <div className={styles.timeLabel}>Minutes</div>
                </div>
                <div className={styles.separator}>:</div>
                <div className={styles.timeUnit}>
                  <div className={styles.timeValue}>{timeLeft.seconds.toString().padStart(2, '0')}</div>
                  <div className={styles.timeLabel}>Seconds</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* What's Being Upgraded */}
          <motion.div 
            className={styles.upgradesSection}
            variants={itemVariants}
          >
            <h2 className={styles.sectionTitle}>
              <Clock size={24} />
              What We&apos;re Working On
            </h2>
            <div className={styles.upgradesList}>
              {upgrades.map((upgrade, index) => (
                <motion.div
                  key={index}
                  className={styles.upgradeItem}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.upgradeIcon}>
                    {upgrade.icon}
                  </div>
                  <div className={styles.upgradeContent}>
                    <h3>{upgrade.title}</h3>
                    <p>{upgrade.description}</p>
                  </div>
                  <CheckCircle className={styles.checkIcon} size={20} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stay Connected */}
          <motion.div 
            className={styles.stayConnected}
            variants={itemVariants}
          >
            <h2 className={styles.sectionTitle}>Stay in the Loop</h2>
            <p>Follow us for real-time updates on our maintenance progress</p>
            
            <div className={styles.socialLinks}>
              <a 
                href="https://twitter.com/autopilotmonster" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <Twitter size={20} />
                <span>Twitter Updates</span>
                <ArrowRight size={16} />
              </a>
              <a 
                href="https://github.com/autopilotmonster" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <Github size={20} />
                <span>GitHub Status</span>
                <ArrowRight size={16} />
              </a>
              <a 
                href="mailto:support@autopilot.monster"
                className={styles.socialLink}
              >
                <Mail size={20} />
                <span>Email Support</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>

          {/* Emergency Contact */}
          <motion.div 
            className={styles.emergencyContact}
            variants={itemVariants}
          >
            <div className={styles.emergencyCard}>
              <h3>Need Immediate Support?</h3>
              <p>
                If you have an urgent business-critical issue that can&apos;t wait, 
                please contact our emergency support team.
              </p>
              <Button variant="secondary" size="lg" leftIcon={<Mail size={20} />}>
                Emergency Contact
              </Button>
            </div>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div 
            className={styles.progressSection}
            variants={itemVariants}
          >
            <h3>Maintenance Progress</h3>
            <div className={styles.progressBar}>
              <motion.div 
                className={styles.progressFill}
                initial={{ width: '0%' }}
                animate={{ width: '75%' }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </div>
            <div className={styles.progressText}>75% Complete</div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
