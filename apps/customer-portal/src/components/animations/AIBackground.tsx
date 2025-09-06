'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import styles from './AIBackground.module.scss'

export const AIBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Neural network nodes
    const nodes: Array<{
      x: number
      y: number
      vx: number
      vy: number
      connections: number[]
    }> = []

    // Create nodes
    const nodeCount = 50
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        connections: []
      })
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update node positions
      nodes.forEach((node, i) => {
        node.x += node.vx
        node.y += node.vy

        // Wrap around edges
        if (node.x < 0) node.x = canvas.width
        if (node.x > canvas.width) node.x = 0
        if (node.y < 0) node.y = canvas.height
        if (node.y > canvas.height) node.y = 0

        // Draw connections
        nodes.forEach((otherNode, j) => {
          if (i !== j) {
            const dx = node.x - otherNode.x
            const dy = node.y - otherNode.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 150) {
              const opacity = 1 - distance / 150
              ctx.strokeStyle = `rgba(14, 165, 233, ${opacity * 0.3})`
              ctx.lineWidth = 1
              ctx.beginPath()
              ctx.moveTo(node.x, node.y)
              ctx.lineTo(otherNode.x, otherNode.y)
              ctx.stroke()
            }
          }
        })

        // Draw node
        ctx.fillStyle = 'rgba(14, 165, 233, 0.6)'
        ctx.beginPath()
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
        ctx.fill()

        // Add glow effect
        ctx.shadowColor = 'rgba(14, 165, 233, 0.8)'
        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.arc(node.x, node.y, 1, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className={styles.aiBackground}>
      {/* Animated canvas */}
      <canvas 
        ref={canvasRef}
        className={styles.neuralCanvas}
      />
      
      {/* Floating particles */}
      <div className={styles.particles}>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className={styles.particle}
            animate={{
              y: [-20, -100, -20],
              x: [-10, 10, -10],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Data streams */}
      <div className={styles.dataStreams}>
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className={styles.dataStream}
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut"
            }}
            style={{
              top: `${20 + i * 15}%`,
            }}
          />
        ))}
      </div>

      {/* Cyber grid overlay */}
      <div className={styles.cyberGrid} />
      
      {/* Gradient overlays */}
      <div className={styles.gradientOverlay} />
    </div>
  )
}
