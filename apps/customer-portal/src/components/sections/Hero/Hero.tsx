'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Play, Zap, Bot, Brain, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import styles from './Hero.module.scss'

// Lottie animation data would be imported here
// For now, we'll use a placeholder

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section className={styles.hero} ref={containerRef}>
      <motion.div 
        className={styles.container}
        style={{ y, opacity }}
      >
        <div className={styles.content}>
          {/* Badge */}
          <motion.div
            className={styles.badge}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Zap className={styles.badgeIcon} size={16} />
            <span>Powered by Advanced AI Technology</span>
            <div className={styles.badgeGlow} />
          </motion.div>

          {/* Main heading */}
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Your Monster of{' '}
            <span className={styles.titleHighlight}>
              Automation
              <motion.div
                className={styles.titleUnderline}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Discover, purchase, and deploy AI agents and automation workflows 
            from the world&apos;s most innovative creators. Transform your business 
            with cutting-edge artificial intelligence.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Button 
              variant="holographic" 
              size="xl"
              rightIcon={<ArrowRight size={20} />}
              glow
            >
              Explore Marketplace
            </Button>
            
            <Button 
              variant="ghost" 
              size="xl"
              leftIcon={<Play size={20} />}
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className={styles.stats}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            {[
              { number: '10,000+', label: 'AI Agents' },
              { number: '50,000+', label: 'Workflows' },
              { number: '1M+', label: 'Downloads' },
              { number: '99.9%', label: 'Uptime' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className={styles.stat}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 1.2 + index * 0.1,
                  ease: [0.2, 0, 0, 1]
                }}
              >
                <span className={styles.statNumber}>{stat.number}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Visual */}
        <div className={styles.visual}>
          {/* AI Visualization */}
          <motion.div
            className={styles.aiVisualization}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* Central AI Core */}
            <motion.div
              className={styles.aiCore}
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                },
                scale: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <Brain className={styles.aiCoreIcon} size={60} />
              <div className={styles.aiCoreGlow} />
            </motion.div>

            {/* Orbiting Icons */}
            {[
              { icon: Bot, delay: 0, radius: 120, color: 'primary' },
              { icon: Cpu, delay: 1, radius: 160, color: 'neural' },
              { icon: Zap, delay: 2, radius: 200, color: 'cyber' },
            ].map(({ icon: Icon, delay, radius, color }, index) => (
              <motion.div
                key={index}
                className={`${styles.orbitIcon} ${styles[`orbit${color.charAt(0).toUpperCase() + color.slice(1)}`]}`}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 15 + delay * 5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: delay
                }}
                style={{
                  '--radius': `${radius}px`
                } as React.CSSProperties}
              >
                <Icon size={24} />
              </motion.div>
            ))}

            {/* Data Streams */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className={styles.dataStream}
                animate={{
                  scaleX: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: "easeInOut"
                }}
                style={{
                  transform: `rotate(${i * 45}deg)`,
                }}
              />
            ))}
          </motion.div>

          {/* Floating particles */}
          <div className={styles.particles}>
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className={styles.particle}
                animate={{
                  y: [-20, -60, -20],
                  x: [0, Math.random() * 40 - 20, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 2 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <motion.div
          className={styles.scrollMouse}
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <span className={styles.scrollText}>Scroll to explore</span>
      </motion.div>
    </section>
  )
}
