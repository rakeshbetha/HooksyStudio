'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import styles from './Hero.module.css'

interface HeroProps {
  onGenerate: (topic: string, tone: string) => void
  onRemix?: (topic: string, tone: string) => void
  isLoading: boolean
  canRemix?: boolean
}

const toneOptions = [
  { value: 'professional', label: 'Professional', emoji: '💼' },
  { value: 'funny', label: 'Funny', emoji: '😂' },
  { value: 'emotional', label: 'Emotional', emoji: '💝' },
  { value: 'shocking', label: 'Shocking', emoji: '😱' },
  { value: 'educational', label: 'Educational', emoji: '🎓' },
  { value: 'motivational', label: 'Motivational', emoji: '🔥' }
]

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

export default function Hero({ onGenerate, onRemix, isLoading, canRemix = false }: HeroProps) {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('professional')
  const [currentHook, setCurrentHook] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    // Get today's date as a seed for consistent daily rotation
    const today = new Date()
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    const hookIndex = seed % dailyHooks.length
    setCurrentHook(dailyHooks[hookIndex])
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim()) {
      await onGenerate(topic.trim(), tone)
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
      await onRemix(topic.trim(), tone)
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

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Generate Viral Hooks, Titles, Hashtags & CTAs with AI
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
              <button
                onClick={copyToClipboard}
                className={`${styles.copyHookButton} ${isCopied ? styles.copied : ''}`}
                disabled={isCopied}
              >
                {isCopied ? '✓ Copied!' : '📋 Copy Hook'}
              </button>
            </div>
          )}
          
          <div className={styles.card}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="topic" className={styles.label}>
                  📝 What's your topic?
                </label>
                <textarea
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., How to start a successful business, Fitness tips for beginners, Cooking healthy meals..."
                  className={styles.textarea}
                  rows={3}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="tone" className={styles.label}>
                  🎭 Choose your tone
                </label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className={styles.select}
                >
                  {toneOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.emoji} {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.buttonGroup}>
                <button
                  type="submit"
                  disabled={!topic.trim() || isLoading}
                  className={styles.button}
                >
                  {isLoading ? (
                    <div className={styles.loading}>
                      <div className={styles.spinner}></div>
                      Generating...
                    </div>
                  ) : (
                    'Generate Viral Content'
                  )}
                </button>
                
                {canRemix && onRemix && (
                  <button
                    type="button"
                    onClick={handleRemix}
                    disabled={!topic.trim() || isLoading}
                    className={styles.remixButton}
                  >
                    {isLoading ? (
                      <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        Remixing...
                      </div>
                    ) : (
                      <>
                        🔁 Remix Hook
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
} 