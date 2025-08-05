'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import styles from './HookRemix.module.css'
import { playSound } from '../utils/soundEffects'

interface HookRemixProps {
  originalHook: string
  originalTopic?: string
}

interface Remixes {
  funny: string
  emotional: string
  shocking: string
  educational: string
  motivational: string
  professional: string
}

interface SavedContent {
  id: string
  topic: string
  tone: string
  hook: string
  title: string
  hashtags: string[]
  cta: string
  timestamp: number
  notes?: string
  customTags?: string[]
  isPinned?: boolean
}

const toneIcons = {
  funny: '😂',
  emotional: '💝',
  shocking: '😱',
  educational: '🎓',
  motivational: '🔥',
  professional: '💼'
}

const toneLabels = {
  funny: 'Funny',
  emotional: 'Emotional',
  shocking: 'Shocking',
  educational: 'Educational',
  motivational: 'Motivational',
  professional: 'Professional'
}

export default function HookRemix({ originalHook, originalTopic = 'Custom Hook' }: HookRemixProps) {
  const [hook, setHook] = useState(originalHook)
  const [remixes, setRemixes] = useState<Partial<Remixes>>({})
  const [loading, setLoading] = useState(false)
  const [savedRemixes, setSavedRemixes] = useState<Set<string>>(new Set())

  const handleRemix = async () => {
    if (!hook.trim()) {
      toast.error('❌ Please enter a hook to remix')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/remix-hook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hook: hook.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate remixes')
      }

      const data = await response.json()
      setRemixes(data)
      
      // Play remix success sound (using generate-pop for faster response)
      playSound('generate-pop.mp3')
      
      toast.success('🎉 Remixes generated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (error) {
      console.error('Remix generation error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate remixes'
      
      // Note: No error sound file available, so we'll skip this
      
      toast.error(`❌ ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, tone: string) => {
    try {
      await navigator.clipboard.writeText(text)
      playSound('copy-blip.mp3')
      toast.success(`✅ ${toneLabels[tone as keyof typeof toneLabels]} remix copied!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (err) {
      // Note: No error sound file available, so we'll skip this
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

  const saveRemix = (remixText: string, tone: string) => {
    try {
      // Check if this remix is already saved
      if (savedRemixes.has(remixText)) {
        toast.info('ℹ️ This remix is already saved!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        return
      }

      // Create new saved content object
      const newSavedContent: SavedContent = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        topic: `Remix of: ${originalTopic}`,
        tone: toneLabels[tone as keyof typeof toneLabels],
        hook: remixText,
        title: `[${toneLabels[tone as keyof typeof toneLabels]} Remix]`,
        hashtags: [],
        cta: '',
        timestamp: Date.now(),
        notes: `Saved from remix generator - Original: "${originalHook}"`,
        customTags: ['remix', tone],
        isPinned: false
      }

      // Get existing saved content
      const existing = localStorage.getItem('hooksy-saved-content')
      const saved = existing ? JSON.parse(existing) : []
      
      // Add new remix to saved content
      saved.push(newSavedContent)
      localStorage.setItem('hooksy-saved-content', JSON.stringify(saved))

      // Update saved remixes set
      setSavedRemixes(prev => new Set([...Array.from(prev), remixText]))

      // Play save sound
      playSound('toggle-click.mp3') // Updated to faster sound

      toast.success(`✅ ${toneLabels[tone as keyof typeof toneLabels]} remix saved to your collection!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (error) {
      console.error('Failed to save remix:', error)
      
      // Note: No error sound file available, so we'll skip this
      
      toast.error('❌ Failed to save remix to collection', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const hasRemixes = Object.keys(remixes).length > 0

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          🔁 Remix This Hook
        </h3>
        <p className={styles.description}>
          Transform your hook into 6 unique tones instantly.
        </p>
      </div>

      <div className={styles.inputSection}>
        <textarea
          value={hook}
          onChange={(e) => setHook(e.target.value)}
          placeholder="Paste or edit your hook here..."
          className={styles.textarea}
          rows={3}
        />
        
        <button
          onClick={handleRemix}
          disabled={loading || !hook.trim()}
          className={styles.generateButton}
        >
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              Generating Remixes...
            </div>
          ) : (
            'Generate Remixes'
          )}
        </button>
      </div>

      <div className={styles.outputSection}>
        {hasRemixes ? (
          <div className={styles.remixGrid}>
            {Object.entries(remixes).map(([tone, remixHook]) => (
              <div key={tone} className={styles.remixCard}>
                <div className={styles.cardHeader}>
                  <h4 className={styles.toneTitle}>
                    {toneIcons[tone as keyof typeof toneIcons]} {toneLabels[tone as keyof typeof toneLabels]}
                  </h4>
                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => copyToClipboard(remixHook, tone)}
                      className={styles.copyButton}
                      title={`Copy ${toneLabels[tone as keyof typeof toneLabels]} remix`}
                    >
                      📋
                    </button>
                    <button
                      onClick={() => saveRemix(remixHook, tone)}
                      className={`${styles.saveButton} ${savedRemixes.has(remixHook) ? styles.saved : ''}`}
                      title={savedRemixes.has(remixHook) ? 'Already saved' : `Save ${toneLabels[tone as keyof typeof toneLabels]} remix`}
                      disabled={savedRemixes.has(remixHook)}
                    >
                      {savedRemixes.has(remixHook) ? '✅' : '💾'}
                    </button>
                  </div>
                </div>
                <p className={styles.remixText}>
                  "{remixHook}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              No remix generated yet. Generate your first remix using the button above.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 