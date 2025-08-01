'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import styles from './EnhancedOutputDisplay.module.css'
import { GeneratedContent } from '../page'
import { calculateHookScore } from '../utils/hookScore'

interface SavedContent {
  id: string
  topic: string
  tone: string
  hook: string
  title: string
  hashtags: string[]
  cta: string
  timestamp: number
  hookScore?: 'Low' | 'Medium' | 'Viral'
}

interface EnhancedOutputDisplayProps {
  content: GeneratedContent
  topic: string
  tone: string
}

export default function EnhancedOutputDisplay({ content, topic, tone }: EnhancedOutputDisplayProps) {
  const [showSocialPreview, setShowSocialPreview] = useState(false)

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`✅ ${label} copied to clipboard!`, {
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
      console.error('Failed to copy text: ', err)
    }
  }

  const saveToCollection = () => {
    try {
      const savedContent: SavedContent = {
        id: Date.now().toString(),
        topic,
        tone,
        hook: content.hooks[0],
        title: content.titles[0],
        hashtags: content.hashtags,
        cta: content.ctas[0],
        timestamp: Date.now(),
        hookScore: 'Medium' // Placeholder for now
      }

      const existing = localStorage.getItem('hooksy-saved-content')
      const saved = existing ? JSON.parse(existing) : []
      saved.push(savedContent)
      localStorage.setItem('hooksy-saved-content', JSON.stringify(saved))

      toast.success('💾 Hook saved to collection!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (err) {
      toast.error('❌ Failed to save content', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      console.error('Failed to save content: ', err)
    }
  }

  const hookScore = calculateHookScore(content.hooks[0])

  return (
    <div className={styles.container}>
      <div className={styles.outputSection}>
        <h3 className={styles.sectionTitle}>
          Generated Content
        </h3>
        
        {/* Hook Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h4 className={styles.sectionLabel}>Hook</h4>
            <div className={styles.hookScore}>
              <span 
                className={`${styles.scoreBadge} ${styles[hookScore.score.toLowerCase()]}`} 
                title={hookScore.reason}
              >
                {hookScore.emoji} {hookScore.score}
              </span>
            </div>
          </div>
          <div className={styles.contentCard}>
            <p className={styles.hookText}>{content.hooks[0]}</p>
            <div className={styles.actionButtons}>
              <button
                onClick={() => copyToClipboard(content.hooks[0], 'Hook')}
                className={styles.copyButton}
                title="Copy to clipboard"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className={styles.section}>
          <h4 className={styles.sectionLabel}>Suggested Title</h4>
          <div className={styles.contentCard}>
            <p className={styles.titleText}>{content.titles[0]}</p>
            <div className={styles.actionButtons}>
              <button
                onClick={() => copyToClipboard(content.titles[0], 'Title')}
                className={styles.copyButton}
                title="Copy to clipboard"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Hashtags Section */}
        <div className={styles.section}>
          <h4 className={styles.sectionLabel}>Hashtags</h4>
          <div className={styles.contentCard}>
            <p className={styles.hashtagText}>{content.hashtags.slice(0, 5).join(' ')}</p>
            <div className={styles.actionButtons}>
              <button
                onClick={() => copyToClipboard(content.hashtags.slice(0, 5).join(' '), 'Hashtags')}
                className={styles.copyButton}
                title="Copy to clipboard"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={styles.section}>
          <h4 className={styles.sectionLabel}>CTA</h4>
          <div className={styles.contentCard}>
            <p className={styles.ctaText}>{content.ctas[0]}</p>
            <div className={styles.actionButtons}>
              <button
                onClick={() => copyToClipboard(content.ctas[0], 'CTA')}
                className={styles.copyButton}
                title="Copy to clipboard"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Main Action Buttons - Side by Side */}
        <div className={styles.actionButtons}>
          <button 
            onClick={saveToCollection} 
            className={styles.saveButton}
          >
            💾 Save to Collection
          </button>
          <button 
            onClick={() => setShowSocialPreview(!showSocialPreview)} 
            className={styles.previewButton}
          >
            📱 Social Preview
          </button>
        </div>

        {/* Social Preview */}
        {showSocialPreview && (
          <div className={styles.socialPreview}>
            <h4 className={styles.sectionLabel}>Social Caption Preview</h4>
            <div className={styles.previewCard}>
              <div className={styles.previewContent}>
                <p className={styles.previewHook}>{content.hooks[0]}</p>
                <p className={styles.previewTitle}>{content.titles[0]}</p>
                <p className={styles.previewHashtags}>{content.hashtags.slice(0, 5).join(' ')}</p>
              </div>
              <button
                onClick={() => copyToClipboard(`${content.hooks[0]}\n\n${content.titles[0]}\n\n${content.hashtags.slice(0, 5).join(' ')}`, 'Social caption')}
                className={styles.copyPreviewButton}
              >
                Copy Caption
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 