'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Neural Network Particles for page backgrounds
function PageParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 1500
  const positions = new Float32Array(particleCount * 3)
  
  // Generate random positions
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 80
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80
  }

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.getElapsedTime()
      pointsRef.current.rotation.x = time * 0.03
      pointsRef.current.rotation.y = time * 0.05
      
      // Animate particles
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        positions[i3 + 1] = Math.sin(time * 0.5 + i * 0.01) * 1.5
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00d4ff"
        size={0.3}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  )
}

// Flowing Circuit Lines for page backgrounds
function PageCircuitLines() {
  const linesRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (linesRef.current) {
      const time = state.clock.getElapsedTime()
      linesRef.current.rotation.y = time * 0.01
    }
  })

  const lineGeometry = new THREE.BufferGeometry()
  const linePositions = new Float32Array([
    -40, 0, 0,
    40, 0, 0,
    0, -25, 0,
    0, 25, 0,
    -25, -25, 0,
    25, 25, 0
  ])
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))

  return (
    <group ref={linesRef}>
      <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: "#00ff88", opacity: 0.2, transparent: true }))} />
    </group>
  )
}

// Data Stream Lines
function DataStreams() {
  const streamsRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (streamsRef.current) {
      const time = state.clock.getElapsedTime()
      streamsRef.current.children.forEach((stream, index) => {
        stream.rotation.z = time * 0.02 + index * 0.5
      })
    }
  })

  return (
    <group ref={streamsRef}>
      {Array.from({ length: 6 }).map((_, i) => {
        const streamGeometry = new THREE.BufferGeometry()
        const streamPositions = new Float32Array([
          0, 0, 0,
          Math.cos(i * Math.PI / 3) * 30, Math.sin(i * Math.PI / 3) * 30, 0
        ])
        streamGeometry.setAttribute('position', new THREE.BufferAttribute(streamPositions, 3))

        return (
          <primitive
            key={i}
            object={new THREE.Line(streamGeometry, new THREE.LineBasicMaterial({ 
              color: "#8b5cf6", 
              opacity: 0.3, 
              transparent: true 
            }))}
          />
        )
      })}
    </group>
  )
}

// Main Page Scene
function PageScene() {
  return (
    <>
      <PageParticles />
      <PageCircuitLines />
      <DataStreams />
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.3} />
    </>
  )
}

interface PageBackgroundProps {
  className?: string
}

export default function PageBackground({ className = '' }: PageBackgroundProps) {
  return (
    <div className={`page-background ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 40], fov: 75 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        performance={{ min: 0.3 }}
      >
        <PageScene />
      </Canvas>
    </div>
  )
}
