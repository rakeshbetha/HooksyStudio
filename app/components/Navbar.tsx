'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Navbar.module.css'
import SoundToggle from './SoundToggle'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('hooksy-theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
    }
  }, [])

  useEffect(() => {
    // Apply theme to document
    document.documentElement.className = isDarkMode ? 'dark' : 'light'
    localStorage.setItem('hooksy-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <motion.nav 
      className={`${styles.navbar} ${isDarkMode ? styles.dark : styles.light} ${isScrolled ? styles.scrolled : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className={styles.container}>
        {/* Logo and Brand */}
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <div className={styles.logoIcon}>🎣</div>
          <span className={styles.logoText}>Hooksy.studio</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <Link 
            href="/" 
            className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/saved" 
            className={`${styles.navLink} ${isActive('/saved') ? styles.active : ''}`}
          >
            Saved
          </Link>
          <Link 
            href="/how-it-works" 
            className={`${styles.navLink} ${isActive('/how-it-works') ? styles.active : ''}`}
          >
            How It Works
          </Link>
          <Link 
            href="/contact" 
            className={`${styles.navLink} ${isActive('/contact') ? styles.active : ''}`}
          >
            Contact
          </Link>
        </div>

        {/* Right Side Controls */}
        <div className={styles.controls}>
          <SoundToggle />
          <button
            onClick={toggleDarkMode}
            className={styles.darkModeToggle}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={styles.hamburger}
            aria-label="Toggle menu"
          >
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className={styles.mobileNav}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link 
              href="/" 
              className={`${styles.mobileNavLink} ${isActive('/') ? styles.active : ''}`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              href="/saved" 
              className={`${styles.mobileNavLink} ${isActive('/saved') ? styles.active : ''}`}
              onClick={closeMenu}
            >
              Saved
            </Link>
            <Link 
              href="/how-it-works" 
              className={`${styles.mobileNavLink} ${isActive('/how-it-works') ? styles.active : ''}`}
              onClick={closeMenu}
            >
              How It Works
            </Link>
            <Link 
              href="/contact" 
              className={`${styles.mobileNavLink} ${isActive('/contact') ? styles.active : ''}`}
              onClick={closeMenu}
            >
              Contact
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
} 