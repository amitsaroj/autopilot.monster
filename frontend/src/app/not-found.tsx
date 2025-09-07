'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Home, Search, ArrowLeft, AlertTriangle, Bot } from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import Link from 'next/link'
import styles from './NotFound.module.scss'

export default function NotFound() {
  return (
    <div className={styles.notFoundPage}>
      <div className="container">
        <motion.div
          className={styles.notFoundContent}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className={styles.errorAnimation}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={styles.glitchWrapper}>
              <div className={styles.glitch404} data-text="404">404</div>
            </div>
            <motion.div
              className={styles.botIcon}
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 0.9, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Bot size={60} />
            </motion.div>
          </motion.div>

          <motion.div
            className={styles.errorMessage}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1 className={styles.errorTitle}>Oops! Page Not Found</h1>
            <p className={styles.errorDescription}>
              The AI automation you&apos;re looking for seems to have wandered off into the digital void. 
              Don&apos;t worry, our robots are working hard to bring it back!
            </p>
          </motion.div>

          <motion.div
            className={styles.suggestions}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className={styles.suggestionsTitle}>Here&apos;s what you can do:</h3>
            <div className={styles.suggestionsList}>
              <div className={styles.suggestion}>
                <Search size={20} />
                <span>Try searching for AI agents or workflows</span>
              </div>
              <div className={styles.suggestion}>
                <Home size={20} />
                <span>Go back to the homepage and explore</span>
              </div>
              <div className={styles.suggestion}>
                <AlertTriangle size={20} />
                <span>Check if the URL is typed correctly</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.actionButtons}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link href="/">
              <Button 
                variant="primary" 
                size="lg" 
                leftIcon={<Home size={20} />}
                glow
              >
                Back to Home
              </Button>
            </Link>
            
            <Link href="/marketplace">
              <Button 
                variant="ghost" 
                size="lg" 
                leftIcon={<Search size={20} />}
              >
                Browse Marketplace
              </Button>
            </Link>

            <Button 
              variant="outline" 
              size="lg" 
              leftIcon={<ArrowLeft size={20} />}
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </motion.div>

          <motion.div
            className={styles.helpText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <p>
              Still need help? <Link href="/contact" className={styles.helpLink}>Contact our support team</Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated background elements */}
      <div className={styles.backgroundElements}>
        <motion.div
          className={styles.floatingBot}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Bot size={24} />
        </motion.div>
        
        <motion.div
          className={styles.glowOrb}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  )
}
