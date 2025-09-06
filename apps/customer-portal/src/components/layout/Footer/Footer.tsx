'use client'

import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer style={{ padding: '4rem 0', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          © 2024 Autopilot.monster. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
