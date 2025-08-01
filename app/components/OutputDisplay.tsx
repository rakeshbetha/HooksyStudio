'use client'

import { useState } from 'react'
import styles from './OutputDisplay.module.css'
import { GeneratedContent } from '../page'

interface OutputDisplayProps {
  content: GeneratedContent
}

export default function OutputDisplay({ content }: OutputDisplayProps) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.outputSection}>
        <h3 className={styles.sectionTitle}>Generated Content</h3>
        
        {/* Hook Section */}
        <div className={styles.section}>
          <h4 className={styles.sectionLabel}>Hook</h4>
          <div className={styles.contentCard}>
            <p className={styles.hookText}>{content.hooks[0]}</p>
            <button
              onClick={() => copyToClipboard(content.hooks[0])}
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

        {/* Title Section */}
        <div className={styles.section}>
          <h4 className={styles.sectionLabel}>Suggested Title</h4>
          <div className={styles.contentCard}>
            <p className={styles.titleText}>{content.titles[0]}</p>
            <button
              onClick={() => copyToClipboard(content.titles[0])}
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

        {/* Hashtags Section */}
        <div className={styles.section}>
          <h4 className={styles.sectionLabel}>Hashtags</h4>
          <div className={styles.contentCard}>
            <p className={styles.hashtagText}>{content.hashtags.slice(0, 5).join(' ')}</p>
            <button
              onClick={() => copyToClipboard(content.hashtags.slice(0, 5).join(' '))}
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

        {/* CTA Section */}
        <div className={styles.section}>
          <h4 className={styles.sectionLabel}>CTA</h4>
          <div className={styles.contentCard}>
            <p className={styles.ctaText}>{content.ctas[0]}</p>
            <button
              onClick={() => copyToClipboard(content.ctas[0])}
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
    </div>
  )
} 