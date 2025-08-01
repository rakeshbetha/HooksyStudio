'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import styles from './OutputDisplay.module.css'
import { GeneratedContent } from '../types'

interface OutputDisplayProps {
  content: GeneratedContent
  topic: string
  tone: string
}

export default function OutputDisplay({ content, topic, tone }: OutputDisplayProps) {
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
      const savedContent = {
        id: Date.now().toString(),
        topic,
        tone,
        hook: content.hooks[0],
        title: content.titles[0],
        hashtags: content.hashtags,
        cta: content.ctas[0],
        timestamp: Date.now()
      }

      const existing = localStorage.getItem('hooksy-saved-content')
      const saved = existing ? JSON.parse(existing) : []
      saved.push(savedContent)
      localStorage.setItem('hooksy-saved-content', JSON.stringify(saved))

      toast.success('💾 Content saved to collection!', {
        position: "top-right",
        autoClose: 2000,
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
          </div>
          <div className={styles.contentCard}>
            <p className={styles.hookText}>{content.hooks[0]}</p>
            <div className={styles.actionButtons}>
              <button
                onClick={() => copyToClipboard(content.hooks[0], 'Hook')}
                className={styles.copyButton}
                title="Copy to clipboard"
              >
                📋
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
                📋
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
                📋
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
                📋
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
                📋 Copy Caption
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 