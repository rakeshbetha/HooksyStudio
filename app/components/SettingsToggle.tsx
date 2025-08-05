'use client'

import { useState, useEffect } from 'react'
import { playSound, setSoundEnabled, isSoundEnabled } from '../utils/soundEffects'
import styles from './SettingsToggle.module.css'

export default function SettingsToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const [soundEnabled, setSoundEnabledState] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    // Initialize with current settings
    setSoundEnabledState(isSoundEnabled())
    
    // Check for dark mode preference
    const savedTheme = localStorage.getItem('hooksy-theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
      document.documentElement.className = savedTheme
    } else {
      // Default to dark mode
      setIsDarkMode(true)
      document.documentElement.className = 'dark'
    }
  }, [])

  const handleSoundToggle = () => {
    const newState = !soundEnabled
    setSoundEnabledState(newState)
    setSoundEnabled(newState)
    
    // Play toggle sound effect
    playSound('toggle-click.mp3')
  }

  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? 'light' : 'dark'
    setIsDarkMode(!isDarkMode)
    
    // Apply theme
    document.documentElement.className = newTheme
    localStorage.setItem('hooksy-theme', newTheme)
    
    // Play toggle sound effect
    playSound('toggle-click.mp3')
  }

  const handleToggleMenu = () => {
    setIsOpen(!isOpen)
    playSound('toggle-click.mp3')
  }

  return (
    <div className={styles.settingsContainer}>
      <button
        onClick={handleToggleMenu}
        className={styles.settingsButton}
        title="Settings"
      >
        ⚙️
      </button>
      
      {isOpen && (
        <div className={styles.settingsMenu}>
          <div className={styles.settingsHeader}>
            <h3>Settings</h3>
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeButton}
            >
              ✕
            </button>
          </div>
          
          <div className={styles.settingsOptions}>
            {/* Sound Toggle */}
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingIcon}>🔊</span>
                <div className={styles.settingText}>
                  <span className={styles.settingLabel}>Sound Effects</span>
                  <span className={styles.settingDescription}>
                    Enable audio feedback for actions
                  </span>
                </div>
              </div>
              <button
                onClick={handleSoundToggle}
                className={`${styles.toggleButton} ${soundEnabled ? styles.enabled : styles.disabled}`}
                title={soundEnabled ? 'Disable Sound Effects' : 'Enable Sound Effects'}
              >
                <div className={styles.toggleSlider} />
              </button>
            </div>
            
            {/* Theme Toggle */}
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingIcon}>🌙</span>
                <div className={styles.settingText}>
                  <span className={styles.settingLabel}>Dark Mode</span>
                  <span className={styles.settingDescription}>
                    Switch between light and dark themes
                  </span>
                </div>
              </div>
              <button
                onClick={handleThemeToggle}
                className={`${styles.toggleButton} ${isDarkMode ? styles.enabled : styles.disabled}`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <div className={styles.toggleSlider} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 