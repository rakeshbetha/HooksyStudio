'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import styles from './Saved.module.css'
import { SavedContent } from '../types'
import { playSound } from '../utils/soundEffects'

interface EditFormData {
  topic: string
  tone: string
  hook: string
  title: string
  hashtags: string
  cta: string
  notes: string
  customTags: string
}

export default function SavedPage() {
  const [savedContent, setSavedContent] = useState<SavedContent[]>([])
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState<EditFormData>({
    topic: '',
    tone: '',
    hook: '',
    title: '',
    hashtags: '',
    cta: '',
    notes: '',
    customTags: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTone, setFilterTone] = useState('all')
  const [filterTags, setFilterTags] = useState('all')
  const [sortBy, setSortBy] = useState<'date' | 'tone' | 'topic' | 'pinned'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)

  useEffect(() => {
    // Load saved content from localStorage
    const saved = localStorage.getItem('hooksy-saved-content')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Convert legacy format to new format if needed
        const convertedContent = parsed.map((item: any) => {
          // Check if it's legacy format (has 'hook' property)
          if (item.hook && !item.hooks) {
            return {
              id: item.id,
              topic: item.topic,
              tone: item.tone,
              hook: item.hook,
              title: item.title,
              hashtags: item.hashtags || [],
              cta: item.cta,
              timestamp: item.timestamp,
              isPinned: item.isPinned || false,
              customTags: item.customTags || [item.tone], // Add tone as tag if no customTags
              notes: item.notes || ''
            }
          }
          // Already in new format
          return {
            ...item,
            isPinned: item.isPinned || false,
            customTags: item.customTags || [item.tone], // Add tone as tag if no customTags
            notes: item.notes || ''
          }
        })
        setSavedContent(convertedContent)
      } catch (error) {
        console.error('Error loading saved content:', error)
      }
    }
  }, [])

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      playSound('copy-blip.mp3')
      toast.success(`✅ ${type} copied to clipboard!`, {
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

  const deleteContent = (id: string) => {
    const updated = savedContent.filter(item => item.id !== id)
    setSavedContent(updated)
    localStorage.setItem('hooksy-saved-content', JSON.stringify(updated))
    
    // Play delete sound
    playSound('delete-soft.mp3')
    
    toast.success('🗑️ Content deleted from saved collection', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  const togglePin = (id: string) => {
    const updated = savedContent.map(item => 
      item.id === id ? { ...item, isPinned: !item.isPinned } : item
    )
    setSavedContent(updated)
    localStorage.setItem('hooksy-saved-content', JSON.stringify(updated))
    toast.success('📌 Pin status updated!', {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  const startEditing = (item: SavedContent) => {
    setEditFormData({
      topic: item.topic,
      tone: item.tone,
      hook: item.hook,
      title: item.title,
      hashtags: Array.isArray(item.hashtags) ? item.hashtags.join(', ') : item.hashtags,
      cta: item.cta,
      notes: item.notes || '',
      customTags: Array.isArray(item.customTags) ? item.customTags.join(', ') : ''
    })
    setIsEditing(item.id)
    setShowEditModal(true)
  }

  const cancelEditing = () => {
    setIsEditing(null)
    setShowEditModal(false)
    setEditFormData({
      topic: '',
      tone: '',
      hook: '',
      title: '',
      hashtags: '',
      cta: '',
      notes: '',
      customTags: ''
    })
  }

  const saveChanges = () => {
    // Validate form data
    if (!editFormData.topic.trim() || !editFormData.hook.trim() || !editFormData.title.trim()) {
      toast.error('❌ Please fill in all required fields (Topic, Hook, Title)', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      return
    }

    try {
      const updatedContent = savedContent.map(item => {
        if (item.id === isEditing) {
          return {
            ...item,
            topic: editFormData.topic.trim(),
            tone: editFormData.tone,
            hook: editFormData.hook.trim(),
            title: editFormData.title.trim(),
            hashtags: editFormData.hashtags.trim() ? editFormData.hashtags.trim().split(' ').filter(tag => tag.startsWith('#')) : [],
            cta: editFormData.cta.trim(),
            notes: editFormData.notes.trim(),
            customTags: editFormData.customTags.trim() ? editFormData.customTags.trim().split(',').map(tag => tag.trim()) : [],
            timestamp: Date.now() // Update timestamp
          }
        }
        return item
      })

      setSavedContent(updatedContent)
      localStorage.setItem('hooksy-saved-content', JSON.stringify(updatedContent))
      setIsEditing(null)
      setShowEditModal(false)
      setEditFormData({
        topic: '',
        tone: '',
        hook: '',
        title: '',
        hashtags: '',
        cta: '',
        notes: '',
        customTags: ''
      })

      toast.success('✅ Changes saved successfully!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (error) {
      toast.error('❌ Failed to save changes. Try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  const exportToPDF = () => {
    // Simple PDF export using browser print
    const printContent = savedContent.map(item => `
      Topic: ${item.topic}
      Tone: ${item.tone}
      Hook: ${item.hook}
      Title: ${item.title}
      Hashtags: ${item.hashtags.join(' ')}
      CTA: ${item.cta}
      Notes: ${item.notes || 'No notes'}
      Tags: ${item.customTags?.join(', ') || 'No tags'}
      Date: ${formatDate(item.timestamp)}
      ---
    `).join('\n')

    const printWindow = window.open('', '_blank')
    printWindow?.document.write(`
      <html>
        <head><title>Hooksy Saved Content</title></head>
        <body>
          <h1>Hooksy Saved Content</h1>
          <pre>${printContent}</pre>
        </body>
      </html>
    `)
    printWindow?.print()
  }

  const exportToMarkdown = () => {
    const markdownContent = savedContent.map(item => `
# ${item.topic}

**Tone:** ${item.tone}  
**Hook:** ${item.hook}  
**Title:** ${item.title}  
**Hashtags:** ${item.hashtags.join(' ')}  
**CTA:** ${item.cta}  
**Notes:** ${item.notes || 'No notes'}  
**Tags:** ${item.customTags?.join(', ') || 'No tags'}  
**Date:** ${formatDate(item.timestamp)}  

---
    `).join('\n')

    const blob = new Blob([markdownContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hooksy-saved-content.md'
    a.click()
    URL.revokeObjectURL(url)

    toast.success('📄 Exported to Markdown!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Topic', 'Tone', 'Hook', 'Title', 'Hashtags', 'CTA', 'Notes', 'Tags', 'Date', 'Pinned'],
      ...savedContent.map(item => [
        item.topic,
        item.tone,
        item.hook,
        item.title,
        item.hashtags.join(' '),
        item.cta,
        item.notes || '',
        item.customTags?.join(', ') || '',
        formatDate(item.timestamp),
        item.isPinned ? 'Yes' : 'No'
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hooksy-saved-content.csv'
    a.click()
    URL.revokeObjectURL(url)

    toast.success('📊 Exported to CSV!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const refreshSavedContent = () => {
    const saved = localStorage.getItem('hooksy-saved-content')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const updatedContent = parsed.map((item: any) => ({
          ...item,
          customTags: item.customTags || [item.tone], // Ensure all items have customTags
          isPinned: item.isPinned || false,
          notes: item.notes || ''
        }))
        localStorage.setItem('hooksy-saved-content', JSON.stringify(updatedContent))
        setSavedContent(updatedContent)
        toast.success('🔄 Saved content refreshed with tags!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } catch (error) {
        console.error('Error refreshing saved content:', error)
      }
    }
  }

  const getToneIcon = (tone: string) => {
    const toneIcons: { [key: string]: string } = {
      professional: '💼',
      funny: '😂',
      emotional: '💝',
      shocking: '😱',
      educational: '🎓',
      motivational: '🔥'
    }
    return toneIcons[tone] || '📝'
  }

  const getToneColor = (tone: string) => {
    const toneColors: { [key: string]: string } = {
      professional: 'var(--color-primary)',
      funny: '#FF6B6B',
      emotional: '#FF8E8E',
      shocking: '#FF4757',
      educational: '#2ED573',
      motivational: '#FFA502'
    }
    return toneColors[tone] || 'var(--color-primary)'
  }

  // Get all unique tags for filtering
  const getAllTags = () => {
    const allTags = new Set<string>()
    savedContent.forEach(item => {
      if (item.customTags && item.customTags.length > 0) {
        item.customTags.forEach(tag => allTags.add(tag))
      }
    })
    console.log('Available tags:', Array.from(allTags))
    return Array.from(allTags).sort()
  }

  // Filter, search, and sort functionality
  const filteredAndSortedContent = savedContent
    .filter(item => {
      const hookText = item.hook
      const matchesSearch = item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hookText.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesTone = filterTone === 'all' || item.tone === filterTone
      const matchesTags = filterTags === 'all' || item.customTags?.includes(filterTags)
      const matchesPinned = !showPinnedOnly || item.isPinned
      
      return matchesSearch && matchesTone && matchesTags && matchesPinned
    })
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'date':
          comparison = a.timestamp - b.timestamp
          break
        case 'tone':
          comparison = a.tone.localeCompare(b.tone)
          break
        case 'topic':
          comparison = a.topic.localeCompare(b.topic)
          break
        case 'pinned':
          comparison = (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

  if (savedContent.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💾</div>
          <h1 className={styles.emptyTitle}>No Saved Content Yet</h1>
          <p className={styles.emptyDescription}>
            Your saved hooks, titles, hashtags, and CTAs will appear here.
            Start creating content to build your collection!
          </p>
          <a href="/" className={styles.ctaButton}>
            Start Creating 🚀
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Saved Collection 💾</h1>
        <p className={styles.subtitle}>
          Your saved content ({filteredAndSortedContent.length} of {savedContent.length} items)
        </p>
      </div>

      {/* Enhanced Search and Filter Controls */}
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search saved content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterContainer}>
          <select
            value={filterTone}
            onChange={(e) => setFilterTone(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Tones</option>
            <option value="professional">💼 Professional</option>
            <option value="funny">😂 Funny</option>
            <option value="emotional">💝 Emotional</option>
            <option value="shocking">😱 Shocking</option>
            <option value="educational">🎓 Educational</option>
            <option value="motivational">🔥 Motivational</option>
          </select>
        </div>
        <div className={styles.tagFilterContainer}>
          <select
            value={filterTags}
            onChange={(e) => setFilterTags(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Tags</option>
            {getAllTags().map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        <div className={styles.sortContainer}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'tone' | 'topic' | 'pinned')}
            className={styles.sortSelect}
          >
            <option value="date">📅 Date</option>
            <option value="tone">🎭 Tone</option>
            <option value="topic">📝 Topic</option>
            <option value="pinned">📌 Pinned</option>
          </select>
        </div>
        <div className={styles.orderContainer}>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className={styles.orderButton}
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
        <div className={styles.pinnedToggleContainer}>
          <button
            onClick={() => setShowPinnedOnly(!showPinnedOnly)}
            className={`${styles.pinnedToggle} ${showPinnedOnly ? styles.active : ''}`}
            title={showPinnedOnly ? "Show All" : "Show Pinned Only"}
          >
            📌 {showPinnedOnly ? "All" : "Pinned"}
          </button>
        </div>
      </div>

      {/* Export Controls */}
      <div className={styles.exportControls}>
        <button onClick={refreshSavedContent} className={styles.exportButton}>
          🔄 Refresh Tags
        </button>
        <button onClick={exportToPDF} className={styles.exportButton}>
          📄 PDF
        </button>
        <button onClick={exportToMarkdown} className={styles.exportButton}>
          📝 Markdown
        </button>
        <button onClick={exportToCSV} className={styles.exportButton}>
          📊 CSV
        </button>
      </div>

      <div className={styles.content}>
        {/* Enhanced Saved Items Grid with Framer Motion */}
        <div className={styles.savedGrid}>
          <AnimatePresence>
            {filteredAndSortedContent.map((item) => (
              <motion.div 
                key={item.id} 
                className={`${styles.card} ${selectedCard === item.id ? styles.expanded : ''} ${item.isPinned ? styles.pinned : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, scale: 1.02 }}
                layout
              >
                {/* Collapsed View - Always Visible */}
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitleSection}>
                    <h3 className={styles.cardTitle}>{item.topic}</h3>
                    {item.isPinned && <span className={styles.pinIndicator}>📌</span>}
                  </div>
                  <div className={styles.cardHeaderRight}>
                    {/* Remix Indicator */}
                    {item.customTags && item.customTags.includes('remix') && (
                      <span className={styles.remixIndicator} title="This is a remix">
                        🔁 Remix
                      </span>
                    )}
                    <span 
                      className={styles.cardTone}
                      style={{ backgroundColor: getToneColor(item.tone) }}
                    >
                      {getToneIcon(item.tone)} {item.tone}
                    </span>
                  </div>
                </div>
                
                <div className={styles.cardMeta}>
                  <span className={styles.cardDate}>{formatDate(item.timestamp)}</span>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.previewButton}
                      onClick={() => setSelectedCard(selectedCard === item.id ? null : item.id)}
                      title={selectedCard === item.id ? "Hide Details" : "Show Details"}
                    >
                      {selectedCard === item.id ? "👁️ Hide" : "👁️ Show"}
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={(e) => {
                        e.stopPropagation()
                        startEditing(item)
                      }}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={(e) => {
                        e.stopPropagation()
                        togglePin(item.id)
                      }}
                      title={item.isPinned ? "Unpin" : "Pin"}
                    >
                      {item.isPinned ? "📌" : "📍"}
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteContent(item.id)
                      }}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Custom Tags */}
                {item.customTags && item.customTags.length > 0 && (
                  <div className={styles.customTags}>
                    {item.customTags.map(tag => (
                      <span key={tag} className={styles.customTag}>{tag}</span>
                    ))}
                  </div>
                )}

                {/* Expanded Details - Only when selected */}
                <AnimatePresence>
                  {selectedCard === item.id && (
                    <motion.div 
                      className={styles.details}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Hook Section - Always show */}
                      <div className={styles.detailSection}>
                        <h4 className={styles.detailTitle}>🎣 Hook</h4>
                        <p className={styles.detailText}>{item.hook}</p>
                        <button
                          onClick={() => copyToClipboard(item.hook, 'Hook')}
                          className={styles.copyButton}
                        >
                          📋 Copy Hook
                        </button>
                      </div>
                      
                      {/* Title Section - Only show if not empty and not a placeholder */}
                      {item.title && 
                       item.title.trim() !== '' && 
                       !item.title.includes('[Remix]') && 
                       !item.title.startsWith('[') && (
                        <div className={styles.detailSection}>
                          <h4 className={styles.detailTitle}>📝 Title</h4>
                          <p className={styles.detailText}>{item.title}</p>
                          <button
                            onClick={() => copyToClipboard(item.title, 'Title')}
                            className={styles.copyButton}
                          >
                            📋 Copy Title
                          </button>
                        </div>
                      )}
                      
                      {/* Hashtags Section - Only show if hashtags exist */}
                      {item.hashtags && item.hashtags.length > 0 && (
                        <div className={styles.detailSection}>
                          <h4 className={styles.detailTitle}>🏷️ Hashtags</h4>
                          <p className={styles.detailText}>{item.hashtags.slice(0, 5).join(' ')}</p>
                          <button
                            onClick={() => copyToClipboard(item.hashtags.slice(0, 5).join(' '), 'Hashtags')}
                            className={styles.copyButton}
                          >
                            📋 Copy Hashtags
                          </button>
                        </div>
                      )}
                      
                      {/* CTA Section - Only show if CTA exists and not empty */}
                      {item.cta && item.cta.trim() !== '' && (
                        <div className={styles.detailSection}>
                          <h4 className={styles.detailTitle}>🎯 CTA</h4>
                          <p className={styles.detailText}>{item.cta}</p>
                          <button
                            onClick={() => copyToClipboard(item.cta, 'CTA')}
                            className={styles.copyButton}
                          >
                            📋 Copy CTA
                          </button>
                        </div>
                      )}

                      {/* Notes Section - Only show if notes exist and not empty */}
                      {item.notes && item.notes.trim() !== '' && (
                        <div className={styles.detailSection}>
                          <h4 className={styles.detailTitle}>📝 Notes</h4>
                          <p className={styles.detailText}>{item.notes}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => cancelEditing()}
          >
            <motion.div 
              className={styles.editModal}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>✏️ Edit Content</h2>
                <button 
                  className={styles.modalClose}
                  onClick={cancelEditing}
                >
                  ✕
                </button>
              </div>
              
              <div className={styles.modalContent}>
                <div className={styles.editFields}>
                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Topic *</label>
                    <input
                      type="text"
                      value={editFormData.topic}
                      onChange={(e) => setEditFormData({...editFormData, topic: e.target.value})}
                      className={styles.formInput}
                      placeholder="Enter topic..."
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Tone</label>
                    <select
                      value={editFormData.tone}
                      onChange={(e) => setEditFormData({...editFormData, tone: e.target.value})}
                      className={styles.formSelect}
                    >
                      <option value="professional">💼 Professional</option>
                      <option value="funny">😂 Funny</option>
                      <option value="emotional">💝 Emotional</option>
                      <option value="shocking">😱 Shocking</option>
                      <option value="educational">🎓 Educational</option>
                      <option value="motivational">🔥 Motivational</option>
                    </select>
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Hook *</label>
                    <textarea
                      value={editFormData.hook}
                      onChange={(e) => setEditFormData({...editFormData, hook: e.target.value})}
                      className={styles.formTextarea}
                      placeholder="Enter your hook..."
                      rows={3}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Title *</label>
                    <textarea
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                      className={styles.formTextarea}
                      placeholder="Enter your title..."
                      rows={2}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Hashtags</label>
                    <textarea
                      value={editFormData.hashtags}
                      onChange={(e) => setEditFormData({...editFormData, hashtags: e.target.value})}
                      className={styles.formTextarea}
                      placeholder="Enter hashtags (space separated, e.g., #AI #Business #Innovation)..."
                      rows={2}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.formLabel}>CTA</label>
                    <textarea
                      value={editFormData.cta}
                      onChange={(e) => setEditFormData({...editFormData, cta: e.target.value})}
                      className={styles.formTextarea}
                      placeholder="Enter your call to action..."
                      rows={2}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Custom Tags</label>
                    <input
                      type="text"
                      value={editFormData.customTags}
                      onChange={(e) => setEditFormData({...editFormData, customTags: e.target.value})}
                      className={styles.formInput}
                      placeholder="Enter custom tags (comma separated)..."
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.formLabel}>Notes</label>
                    <textarea
                      value={editFormData.notes}
                      onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                      className={styles.formTextarea}
                      placeholder="Add your notes..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className={styles.editActions}>
                  <button
                    onClick={saveChanges}
                    className={styles.saveButton}
                  >
                    💾 Save Changes
                  </button>
                  <button
                    onClick={cancelEditing}
                    className={styles.cancelButton}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 
