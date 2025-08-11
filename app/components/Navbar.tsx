'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Navbar.module.css'
import SettingsToggle from './SettingsToggle'
import { useAuth } from '@/app/contexts/AuthContext'
import { LogoutButton } from './LogoutButton'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { user, loading } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className={styles.container}>
        {/* Logo and Brand */}
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <div className={styles.logoIcon}>
            <div className={styles.hookShape}>
              <div className={styles.star}></div>
            </div>
          </div>
          <span className={styles.logoText}>Hooksy.studio</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <Link 
            href="/" 
            className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
          >
            Generate
          </Link>
          <Link 
            href="/analyze" 
            className={`${styles.navLink} ${isActive('/analyze') ? styles.active : ''}`}
          >
            Analyze
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
          <SettingsToggle /> {/* Updated: Replaced SoundToggle with SettingsToggle */}
          
          {/* Auth Controls */}
          {!loading && (
            <>
              {user ? (
                <div className={styles.authControls}>
                  <span className={styles.userEmail}>{user.email}</span>
                  <LogoutButton />
                </div>
              ) : (
                <Link href="/login" className={styles.loginButton}>
                  Login
                </Link>
              )}
            </>
          )}
          
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
              Generate
            </Link>
            <Link 
              href="/analyze" 
              className={`${styles.mobileNavLink} ${isActive('/analyze') ? styles.active : ''}`}
              onClick={closeMenu}
            >
              Analyze
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
            
            {/* Mobile Auth */}
            {!loading && (
              <>
                {user ? (
                  <>
                    <div className={styles.mobileAuthInfo}>
                      <span className={styles.mobileUserEmail}>{user.email}</span>
                    </div>
                    <div className={styles.mobileAuthControls}>
                      <LogoutButton />
                    </div>
                  </>
                ) : (
                  <Link 
                    href="/login" 
                    className={`${styles.mobileNavLink} ${styles.loginLink}`}
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
} 