'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Zap, ShoppingCart, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import styles from './Navigation.module.scss'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
]

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      className={`${styles.navigation} ${isScrolled ? styles.scrolled : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
    >
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <motion.div
            className={styles.logoIcon}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Zap className={styles.logoSvg} />
            <div className={styles.logoGlow} />
          </motion.div>
          <span className={styles.logoText}>
            <span className={styles.logoMain}>autopilot</span>
            <span className={styles.logoSub}>.monster</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${
                    pathname === item.href ? styles.active : ''
                  }`}
                >
                  <span>{item.label}</span>
                  {pathname === item.href && (
                    <motion.div
                      className={styles.activeIndicator}
                      layoutId="activeNav"
                      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <motion.button
            className={styles.searchBtn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search size={20} />
          </motion.button>

          <motion.button
            className={styles.cartBtn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart size={20} />
            <span className={styles.cartCount}>3</span>
          </motion.button>

          <div className={styles.authButtons}>
            <Button variant="ghost" size="sm">
              Login
            </Button>
            <Button variant="holographic" size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <motion.button
            className={styles.mobileMenuBtn}
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.mobileNav}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
          >
            <div className={styles.mobileNavContent}>
              <ul className={styles.mobileNavList}>
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.1,
                      ease: [0.2, 0, 0, 1] 
                    }}
                  >
                    <Link
                      href={item.href}
                      className={`${styles.mobileNavLink} ${
                        pathname === item.href ? styles.active : ''
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className={styles.mobileAuthActions}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Button variant="outline" fullWidth>
                  Login
                </Button>
                <Button variant="holographic" fullWidth>
                  Get Started
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
