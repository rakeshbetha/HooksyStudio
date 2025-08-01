'use client'

import { useState } from 'react'
import styles from './Header.module.css'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <a href="/" className={styles.logoLink}>
            <h1 className={styles.title}>Hooksy.studio</h1>
          </a>
        </div>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <a href="/" className={styles.navLink} onClick={closeMenu}>
                Home
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="/saved" className={styles.navLink} onClick={closeMenu}>
                Saved
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="/how-it-works" className={styles.navLink} onClick={closeMenu}>
                How It Works
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="/contact" className={styles.navLink} onClick={closeMenu}>
                Contact
              </a>
            </li>
          </ul>
        </nav>

        <button 
          className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
      </div>
    </header>
  )
} 