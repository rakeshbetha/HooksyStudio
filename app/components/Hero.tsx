'use client'

import { useState } from 'react'
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

export default function Hero({ onGenerate, onRemix, isLoading, canRemix = false }: HeroProps) {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('professional')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim()) {
      onGenerate(topic.trim(), tone)
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
                    onClick={() => onRemix(topic, tone)}
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