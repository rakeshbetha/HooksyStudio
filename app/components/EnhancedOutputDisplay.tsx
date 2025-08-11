'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import styles from './EnhancedOutputDisplay.module.css'
import { playSound } from '../utils/soundEffects'
import { calculateHookScore } from '../utils/hookScore'
import { useAuth } from '../contexts/AuthContext'
import { getCollections, createCollection, saveHook } from '../../lib/supabase-operations'
import { GeneratedContent } from '../types'
import HookRemix from './HookRemix'

interface EnhancedOutputDisplayProps {
  content: GeneratedContent
  topic: string
  tone: string
}

interface Collection {
  id: string
  title: string
  created_at: string
}

export default function EnhancedOutputDisplay({ content, topic, tone }: EnhancedOutputDisplayProps) {
  const { user } = useAuth()
  const [showSocialPreview, setShowSocialPreview] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCollection, setSelectedCollection] = useState<string>('')
  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [newCollectionTitle, setNewCollectionTitle] = useState('')
  const [isCreatingCollection, setIsCreatingCollection] = useState(false)
  
  // Default brand settings - can be customized in the future
  const brandName = 'YourBrand'
  const brandInitials = 'Y'

  useEffect(() => {
    if (user) {
      loadCollections()
    }
  }, [user])

  const loadCollections = async () => {
    try {
      const data = await getCollections()
      setCollections(data || [])
      if (data && data.length > 0) {
        setSelectedCollection(data[0].id)
      }
    } catch (error) {
      console.error('Error loading collections:', error)
    }
  }

  const createNewCollection = async () => {
    if (!newCollectionTitle.trim()) return
    
    try {
      setIsCreatingCollection(true)
      const newCollection = await createCollection(newCollectionTitle.trim())
      setCollections(prev => [newCollection, ...prev])
      setSelectedCollection(newCollection.id)
      setNewCollectionTitle('')
      setShowCollectionModal(false)
      toast.success('Collection created successfully!')
      playSound('save-confirm.mp3')
    } catch (error) {
      console.error('Error creating collection:', error)
      toast.error('Failed to create collection')
    } finally {
      setIsCreatingCollection(false)
    }
  }

  const getPlatformInfo = () => {
    if (!content.platform || content.platform === 'general') return null
    
    const platformMap: { [key: string]: { icon: string, name: string, color: string, charLimit: number } } = {
      instagram: { icon: '📸', name: 'Instagram', color: '#E4405F', charLimit: 150 },
      youtube: { icon: '📺', name: 'YouTube', color: '#FF0000', charLimit: 100 },
      twitter: { icon: '🐦', name: 'Twitter', color: '#1DA1F2', charLimit: 280 },
      email: { icon: '📧', name: 'Email', color: '#EA4335', charLimit: 200 }
    }
    
    return platformMap[content.platform]
  }

  const platformInfo = getPlatformInfo()

  const getCharacterCount = (text: string) => {
    return text.length
  }

  const getCharacterStatus = (text: string, limit: number) => {
    const count = text.length
    const percentage = (count / limit) * 100
    
    if (percentage >= 90) return 'warning'
    if (percentage >= 100) return 'error'
    return 'good'
  }

  const getHookQualityBadge = () => {
    // This would be calculated from the actual analysis
    // For now, we'll show it based on a simple heuristic
    const hookText = content.hooks[0].toLowerCase()
    const hasSpecificLanguage = hookText.includes('cricket') || hookText.includes('bat') || hookText.includes('ball')
    const hasEmotionalTriggers = hookText.includes('dream') || hookText.includes('passion') || hookText.includes('success')
    const hasNumbers = /\d+/.test(hookText)
    
    if (hasSpecificLanguage && hasEmotionalTriggers && hasNumbers) {
      return { show: true, type: 'excellent' as const, text: '🔥 Viral Potential' }
    } else if (hasSpecificLanguage || hasEmotionalTriggers) {
      return { show: true, type: 'good' as const, text: '⚡ Strong Hook' }
    }
    return { show: false, type: undefined, text: '' }
  }

  const qualityBadge = getHookQualityBadge()

  const saveToCollection = async () => {
    if (!user) {
      toast.error('Please log in to save hooks')
      return
    }

    if (!selectedCollection) {
      setShowCollectionModal(true)
      return
    }

    try {
      await saveHook(selectedCollection, content.hooks[0], 'social-media', {
        topic,
        tone,
        title: content.titles[0],
        hashtags: content.hashtags,
        cta: content.ctas[0]
      })
      
      toast.success('💾 Hook saved to collection!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      playSound('save-confirm.mp3')
    } catch (error) {
      console.error('Error saving hook:', error)
      toast.error('Failed to save hook')
    }
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      playSound('copy-blip.mp3')
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

  const hookScoreResult = calculateHookScore(content.hooks[0])

  return (
    <div className={styles.container}>
      <div className={styles.outputSection}>
        <h3 className={styles.sectionTitle}>
          Generated Content
        </h3>
        
        {/* Platform Info */}
        {platformInfo && (
          <div className={styles.platformInfo}>
            <span className={styles.platformIcon}>{platformInfo.icon}</span>
            <span className={styles.platformName}>{platformInfo.name}</span>
            <span className={styles.platformOptimized}>Optimized</span>
          </div>
        )}
        
        {/* Hook Section */}
        <div className={styles.contentCard}>
          <div className={styles.cardHeader}>
            <h4 className={styles.cardTitle}>
              🎯 Viral Hook
              <span className={`${styles.scoreBadge} ${styles[hookScoreResult.score.toLowerCase()]}`}>
                {hookScoreResult.emoji} {hookScoreResult.score}
              </span>
              {qualityBadge.show && qualityBadge.type && (
                <span className={`${styles.qualityBadge} ${styles[qualityBadge.type]}`}>
                  {qualityBadge.text}
                </span>
              )}
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
          {platformInfo && (
            <div className={styles.characterCount}>
              <span className={`${styles.charCount} ${styles[getCharacterStatus(content.hooks[0], platformInfo.charLimit)]}`}>
                {getCharacterCount(content.hooks[0])}/{platformInfo.charLimit} characters
              </span>
              <span className={styles.platformTag}>
                {platformInfo.icon} {platformInfo.name}
              </span>
            </div>
          )}
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
            onClick={() => {
              // Navigate to analyze page with the hook pre-filled
              const analyzeUrl = `/analyze?hook=${encodeURIComponent(content.hooks[0])}`
              window.open(analyzeUrl, '_blank')
            }}
            className={styles.analyzeButton}
          >
            🔍 Quick Analyze
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

      {/* Collection Selection Modal */}
      {showCollectionModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Save to Collection</h3>
            <p>Choose a collection or create a new one:</p>
            
            {collections.length > 0 && (
              <div className={styles.collectionSelect}>
                <label htmlFor="collection-select">Select Collection:</label>
                <select
                  id="collection-select"
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                >
                  {collections.map(collection => (
                    <option key={collection.id} value={collection.id}>
                      {collection.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className={styles.createNew}>
              <label htmlFor="new-collection">Or create new collection:</label>
              <input
                id="new-collection"
                type="text"
                placeholder="Collection name"
                value={newCollectionTitle}
                onChange={(e) => setNewCollectionTitle(e.target.value)}
              />
            </div>
            
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowCollectionModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={createNewCollection}
                disabled={isCreatingCollection || !newCollectionTitle.trim()}
                className={styles.saveButton}
              >
                {isCreatingCollection ? 'Creating...' : 'Create & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 