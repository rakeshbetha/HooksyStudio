'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import styles from './HookOfTheDay.module.css'

const dailyHooks = [
  "This 5-second mindset shift will change how you create forever.",
  "The secret to viral content that nobody talks about.",
  "Why 99% of creators fail (and how to be the 1%).",
  "The one thing that separates successful creators from everyone else.",
  "This simple trick will 10x your engagement overnight.",
  "The truth about going viral that most people don't want to hear.",
  "How I went from 0 to 100k followers in 30 days.",
  "The biggest mistake creators make (and how to avoid it).",
  "Why your content isn't getting the views it deserves.",
  "The psychology behind viral hooks that convert.",
  "This mindset change made me a top 1% creator.",
  "The formula for creating content that spreads like wildfire.",
  "Why most people will never go viral (and how to be different).",
  "The hidden pattern in every viral post.",
  "How to make your audience obsessed with your content."
]

export default function HookOfTheDay() {
  const [currentHook, setCurrentHook] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    // Get today's date as a seed for consistent daily rotation
    const today = new Date()
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    const hookIndex = seed % dailyHooks.length
    setCurrentHook(dailyHooks[hookIndex])
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentHook)
      toast.success('✅ Hook of the Day copied!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      toast.error('❌ Failed to copy hook', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  if (!currentHook) return null

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          ✨ Hook of the Day
        </h3>
        <p className={styles.subtitle}>
          Get inspired by today's viral hook
        </p>
      </div>
      
      <div className={styles.hookCard}>
        <p className={styles.hookText}>
          "{currentHook}"
        </p>
        <button
          onClick={copyToClipboard}
          className={`${styles.copyButton} ${isCopied ? styles.copied : ''}`}
          disabled={isCopied}
        >
          {isCopied ? '✓ Copied!' : '📋 Copy Hook'}
        </button>
      </div>
    </div>
  )
} 