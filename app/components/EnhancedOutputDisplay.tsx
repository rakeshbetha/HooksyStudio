'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import styles from './EnhancedOutputDisplay.module.css'
import { GeneratedContent, SavedContent } from '../types'
import { calculateHookScore } from '../utils/hookScore'
import HookRemix from './HookRemix'
import { playSound } from '../utils/soundEffects'

interface EnhancedOutputDisplayProps {
  content: GeneratedContent
  topic: string
  tone: string
}

export default function EnhancedOutputDisplay({ content, topic, tone }: EnhancedOutputDisplayProps) {
  const [showSocialPreview, setShowSocialPreview] = useState(false)
  
  // Default brand settings - can be customized in the future
  const brandName = 'YourBrand'
  const brandInitials = 'Y'

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      playSound('copy.mp3')
      toast.success(`✅ ${label} copied to clipboard!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (err) {
      playSound('error.mp3')
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

      // Play save sound
      playSound('save.mp3')

      toast.success('💾 Hook saved to collection!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (err) {
      // Play error sound
      playSound('error.mp3')
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

  const hookScoreResult = calculateHookScore(content.hooks[0])

  return (
    <div className={styles.container}>
      <div className={styles.outputSection}>
        <h3 className={styles.sectionTitle}>
          Generated Content
        </h3>
        
        {/* Hook Section */}
        <div className={styles.contentCard}>
          <div className={styles.cardHeader}>
            <h4 className={styles.cardTitle}>
              🎯 Viral Hook
              <span className={`${styles.scoreBadge} ${styles[hookScoreResult.score.toLowerCase()]}`}>
                {hookScoreResult.emoji} {hookScoreResult.score}
              </span>
            </h4>
            <button
              onClick={() => copyToClipboard(content.hooks[0], 'Hook')}
              className={styles.copyButton}
              title="Copy hook"
            >
              📋
            </button>
          </div>
          <p className={styles.contentText}>{content.hooks[0]}</p>
        </div>

        {/* Title Section */}
        <div className={styles.contentCard}>
          <div className={styles.cardHeader}>
            <h4 className={styles.cardTitle}>📝 Compelling Title</h4>
            <button
              onClick={() => copyToClipboard(content.titles[0], 'Title')}
              className={styles.copyButton}
              title="Copy title"
            >
              📋
            </button>
          </div>
          <p className={styles.contentText}>{content.titles[0]}</p>
        </div>

        {/* Hashtags Section */}
        <div className={styles.contentCard}>
          <div className={styles.cardHeader}>
            <h4 className={styles.cardTitle}>🏷️ Trending Hashtags</h4>
            <button
              onClick={() => copyToClipboard(content.hashtags.join(' '), 'Hashtags')}
              className={styles.copyButton}
              title="Copy hashtags"
            >
              📋
            </button>
          </div>
          <div className={styles.hashtagContainer}>
            {content.hashtags.map((hashtag, index) => (
              <span key={index} className={styles.hashtag}>
                {hashtag}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className={styles.contentCard}>
          <div className={styles.cardHeader}>
            <h4 className={styles.cardTitle}>🎪 Call-to-Action</h4>
            <button
              onClick={() => copyToClipboard(content.ctas[0], 'CTA')}
              className={styles.copyButton}
              title="Copy CTA"
            >
              📋
            </button>
          </div>
          <p className={styles.contentText}>{content.ctas[0]}</p>
        </div>

        {/* Action Buttons */}
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
            {showSocialPreview ? '👁️ Hide Preview' : '👁️ Show Social Preview'}
          </button>
        </div>

        {/* Social Media Preview */}
        {showSocialPreview && (
          <div className={styles.socialPreview}>
            <h4 className={styles.previewTitle}>
              📱 How Your Content Will Look
              <span className={styles.previewNote}> (Preview for your brand)</span>
            </h4>
            <div className={styles.previewCard}>
              <div className={styles.previewHeader}>
                <div className={styles.previewAvatar}>{brandInitials}</div>
                <div className={styles.previewInfo}>
                  <div className={styles.previewName}>{brandName}</div>
                  <div className={styles.previewTime}>Just now</div>
                </div>
              </div>
              <div className={styles.previewContent}>
                <p className={styles.previewText}>{content.hooks[0]}</p>
                <p className={styles.previewText}>{content.titles[0]}</p>
                <div className={styles.previewHashtags}>
                  {content.hashtags.slice(0, 3).map((hashtag, index) => (
                    <span key={index} className={styles.previewHashtag}>
                      {hashtag}
                    </span>
                  ))}
                </div>
                <p className={styles.previewCTA}>{content.ctas[0]}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hook Remix Section */}
      <HookRemix originalHook={content.hooks[0]} originalTopic={topic} />
    </div>
  )
} 