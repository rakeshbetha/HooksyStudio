'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import styles from './Hero.module.css'
import { playSound } from '../utils/soundEffects'

interface HeroProps {
  onGenerate: (topic: string, tone: string, platform?: string) => Promise<void>
  onRemix: (topic: string, tone: string, platform?: string) => Promise<void>
  isLoading: boolean
  canRemix: boolean
}

const toneOptions = [
  { value: 'professional', label: 'Professional', emoji: '💼' },
  { value: 'funny', label: 'Funny', emoji: '😂' },
  { value: 'emotional', label: 'Emotional', emoji: '💝' },
  { value: 'shocking', label: 'Shocking', emoji: '😱' },
  { value: 'educational', label: 'Educational', emoji: '🎓' },
  { value: 'motivational', label: 'Motivational', emoji: '🔥' }
]

const platformOptions = [
  { value: '', label: 'All Platforms', emoji: '🌐' },
  { value: 'instagram', label: 'Instagram', emoji: '📸' },
  { value: 'youtube', label: 'YouTube', emoji: '📺' },
  { value: 'twitter', label: 'Twitter', emoji: '🐦' },
  { value: 'email', label: 'Email', emoji: '📧' }
]

const dailyHooks = [
  "This 5-second mindset shift will change how you create forever.",
  "The secret to viral content that nobody talks about.",
  "Why 90% of creators fail (and how to avoid it).",
  "The one thing that separates successful creators from everyone else.",
  "How to turn any topic into engaging content in 30 seconds.",
  "The psychology behind why people share content.",
  "Why your content isn't getting the reach it deserves.",
  "The hidden pattern in all viral posts."
]

export default function Hero({ onGenerate, onRemix, isLoading, canRemix }: HeroProps) {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('professional')
  const [platform, setPlatform] = useState('')
  const [currentHook, setCurrentHook] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    // Set current hook based on date
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const hookIndex = dayOfYear % dailyHooks.length
    setCurrentHook(dailyHooks[hookIndex])
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentHook)
      setIsCopied(true)
      playSound('copy.mp3')
      toast.success('✅ Hook copied to clipboard!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      toast.error('❌ Failed to copy to clipboard', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const scrollToForm = () => {
    const formElement = document.querySelector('#content-form')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim()) {
      playSound('generate.mp3')
      await onGenerate(topic.trim(), tone, platform)
      // Smooth scroll to output section after generation
      setTimeout(() => {
        const outputSection = document.querySelector('[data-output-section]')
        if (outputSection) {
          outputSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }, 100)
    }
  }

  const handleRemix = async () => {
    if (topic.trim() && onRemix) {
      playSound('remix.mp3')
      await onRemix(topic.trim(), tone, platform)
      // Smooth scroll to output section after remix
      setTimeout(() => {
        const outputSection = document.querySelector('[data-output-section]')
        if (outputSection) {
          outputSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }, 100)
    }
  }

  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Create Viral Content in Seconds
        </h1>
        <p className={styles.subtitle}>
          Craft scroll-stopping content in seconds
        </p>

        {/* Hook of the Day Section */}
        {currentHook && (
          <div className={styles.hookOfTheDay}>
            <h3 className={styles.hookTitle}>
              🔥 Hooksy's Hook of the Day
            </h3>
            <p className={styles.hookText}>
              "{currentHook}"
            </p>
            <div className={styles.actionButtons}>
              <button
                onClick={copyToClipboard}
                className={`${styles.copyHookButton} ${isCopied ? styles.copied : ''}`}
                disabled={isCopied}
              >
                {isCopied ? '✓ Copied!' : '📋 Copy Hook'}
              </button>
              <button
                onClick={scrollToForm}
                className={styles.ctaButton}
              >
                Want more like this? → Try similar hook
              </button>
            </div>
          </div>
        )}

        <div className={styles.card} id="content-form">
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="topic" className={styles.label}>
                What's your topic? 🎯
              </label>
              <textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How to build a successful business, The psychology of motivation, AI tools for productivity..."
                className={styles.textarea}
                rows={3}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="tone" className={styles.label}>
                Choose your tone 🎭
              </label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className={styles.select}
              >
                {toneOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.emoji} {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="platform" className={styles.label}>
                Select Platform 📱
                {platform && platform !== '' && (
                  <span className={styles.platformIndicator}>
                    {platformOptions.find(p => p.value === platform)?.emoji} {platformOptions.find(p => p.value === platform)?.label}
                  </span>
                )}
              </label>
              <select
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className={styles.select}
              >
                {platformOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.emoji} {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="submit"
                disabled={isLoading || !topic.trim()}
                className={styles.generateButton}
              >
                {isLoading ? 'Generating...' : 'Generate Viral Content'}
              </button>
              
              {canRemix && (
                <button
                  type="button"
                  onClick={handleRemix}
                  disabled={isLoading || !topic.trim()}
                  className={styles.remixButton}
                >
                  Remix Hook
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 