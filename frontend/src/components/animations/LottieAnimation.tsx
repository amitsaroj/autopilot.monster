'use client'

import React from 'react'
// import Lottie from 'lottie-react'

interface LottieAnimationProps {
  animationData?: object
  className?: string
  loop?: boolean
  autoplay?: boolean
  speed?: number
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  className
}) => {
  // Placeholder for now - would use actual Lottie component
  return (
    <div className={className}>
      {/* Lottie animation would go here */}
      <div style={{ 
        width: '100%', 
        height: '100%', 
        background: 'rgba(14, 165, 233, 0.1)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '12px'
      }}>
        AI Animation
      </div>
    </div>
  )
}
