'use client'

import { useState, useEffect } from 'react'
import { setSoundEnabled, isSoundEnabled } from '../utils/soundEffects'
import styles from './SoundToggle.module.css'

export default function SoundToggle() {
  const [isEnabled, setIsEnabled] = useState(true)

  useEffect(() => {
    // Initialize with current setting
    setIsEnabled(isSoundEnabled())
  }, [])

  const handleToggle = () => {
    const newState = !isEnabled
    setIsEnabled(newState)
    setSoundEnabled(newState)
  }

  return (
    <button
      onClick={handleToggle}
      className={`${styles.soundToggle} ${isEnabled ? styles.enabled : styles.disabled}`}
      title={isEnabled ? 'Disable Sound Effects' : 'Enable Sound Effects'}
    >
      {isEnabled ? '🔊' : '🔇'}
    </button>
  )
} 