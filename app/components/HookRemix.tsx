'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import styles from './HookRemix.module.css'

interface HookRemixProps {
  originalHook: string
}

interface Remixes {
  funny: string
  emotional: string
  shocking: string
  educational: string
  motivational: string
  professional: string
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

export default function HookRemix({ originalHook }: HookRemixProps) {
  const [hook, setHook] = useState(originalHook)
  const [remixes, setRemixes] = useState<Partial<Remixes>>({})
  const [loading, setLoading] = useState(false)

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
      toast.success(`✅ ${toneLabels[tone as keyof typeof toneLabels]} remix copied!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
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
                  <button
                    onClick={() => copyToClipboard(remixHook, tone)}
                    className={styles.copyButton}
                    title={`Copy ${toneLabels[tone as keyof typeof toneLabels]} remix`}
                  >
                    📋
                  </button>
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