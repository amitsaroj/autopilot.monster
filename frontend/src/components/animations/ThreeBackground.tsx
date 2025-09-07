'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Neural Network Particle System
function NeuralParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 2000
  const positions = new Float32Array(particleCount * 3)
  
  // Generate random positions
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100
  }

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime()
      pointsRef.current.rotation.x = time * 0.05
      pointsRef.current.rotation.y = time * 0.1
      
      // Animate particles
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        positions[i3 + 1] = Math.sin(time + i * 0.01) * 2
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00d4ff"
        size={0.5}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  )
}

// Flowing Circuit Lines
function CircuitLines() {
  const linesRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (linesRef.current) {
      const time = state.clock.getElapsedTime()
      linesRef.current.rotation.y = time * 0.02
    }
  })

  const lineGeometry = new THREE.BufferGeometry()
  const linePositions = new Float32Array([
    -50, 0, 0,
    50, 0, 0,
    0, -30, 0,
    0, 30, 0,
    -30, -30, 0,
    30, 30, 0
  ])
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))

  return (
    <group ref={linesRef}>
      <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: "#00ff88", opacity: 0.3, transparent: true }))} />
    </group>
  )
}

// Main Three.js Scene
function Scene() {
  return (
    <>
      <NeuralParticles />
      <CircuitLines />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
    </>
  )
}

interface ThreeBackgroundProps {
  className?: string
}

export default function ThreeBackground({ className = '' }: ThreeBackgroundProps) {
  return (
    <div className={`three-background ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 50], fov: 75 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
