'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import styles from './Saved.module.css'
import { useAuth } from '../contexts/AuthContext'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { 
  getCollections, 
  createCollection, 
  saveHook, 
  updateCollection, 
  deleteCollection,
  updateHook,
  deleteHook
} from '../../lib/supabase-operations'
import { playSound } from '../utils/soundEffects'

interface Collection {
  id: string
  title: string
  created_at: string
  hooks: Hook[]
}

interface Hook {
  id: string
  text: string
  platform?: string
  scores?: any
  created_at: string
}

export default function SavedPage() {
  const { user } = useAuth()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateCollection, setShowCreateCollection] = useState(false)
  const [newCollectionTitle, setNewCollectionTitle] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlatform, setFilterPlatform] = useState('all')
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (user) {
      loadCollections()
    }
  }, [user])

  const loadCollections = async () => {
    try {
      setLoading(true)
      const data = await getCollections()
      setCollections(data || [])
    } catch (error) {
      console.error('Error loading collections:', error)
      toast.error('Failed to load collections')
    } finally {
      setLoading(false)
    }
  }

  const createNewCollection = async () => {
    if (!newCollectionTitle.trim()) return
    
    try {
      await createCollection(newCollectionTitle.trim())
      setNewCollectionTitle('')
      setShowCreateCollection(false)
      await loadCollections()
      toast.success('Collection created successfully!')
      playSound('save-confirm.mp3')
    } catch (error) {
      console.error('Error creating collection:', error)
      toast.error('Failed to create collection')
    }
  }

  const deleteCollectionHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this collection? This will also delete all hooks within it.')) {
      try {
        await deleteCollection(id)
        await loadCollections()
        toast.success('Collection deleted successfully!')
        playSound('delete-soft.mp3')
      } catch (error) {
        console.error('Error deleting collection:', error)
        toast.error('Failed to delete collection')
      }
    }
  }

  const deleteHookHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this hook?')) {
      try {
        await deleteHook(id)
        await loadCollections()
        toast.success('Hook deleted successfully!')
        playSound('delete-soft.mp3')
      } catch (error) {
        console.error('Error deleting hook:', error)
        toast.error('Failed to delete hook')
      }
    }
  }

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFilteredCollections = () => {
    let filtered = collections

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(collection =>
        collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.hooks.some(hook =>
          hook.text.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Filter by platform
    if (filterPlatform !== 'all') {
      filtered = filtered.map(collection => ({
        ...collection,
        hooks: collection.hooks.filter(hook => hook.platform === filterPlatform)
      })).filter(collection => collection.hooks.length > 0)
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue
      
      if (sortBy === 'date') {
        aValue = new Date(a.created_at).getTime()
        bValue = new Date(b.created_at).getTime()
      } else {
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }

  const getAllPlatforms = () => {
    const platforms = new Set<string>()
    collections.forEach(collection => {
      collection.hooks.forEach(hook => {
        if (hook.platform) {
          platforms.add(hook.platform)
        }
      })
    })
    return Array.from(platforms).sort()
  }

  const filteredCollections = getFilteredCollections()
  const platforms = getAllPlatforms()

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your collections...</p>
      </div>
    )
  }

  const toggleCollectionExpansion = (collectionId: string) => {
    const newExpanded = new Set(expandedCollections)
    if (newExpanded.has(collectionId)) {
      newExpanded.delete(collectionId)
    } else {
      newExpanded.add(collectionId)
    }
    setExpandedCollections(newExpanded)
  }

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>💾 Saved Collections</h1>
            <p className={styles.subtitle}>
              Your curated hooks and content organized in collections
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateCollection(true)}
            className={styles.createButton}
          >
            + New Collection
          </button>
        </div>

        {/* Create Collection Modal */}
        {showCreateCollection && (
          <div className={styles.modalOverlay} onClick={() => setShowCreateCollection(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h3>Create New Collection</h3>
              <input
                type="text"
                placeholder="Collection title"
                value={newCollectionTitle}
                onChange={(e) => setNewCollectionTitle(e.target.value)}
                className={styles.modalInput}
                onKeyPress={(e) => e.key === 'Enter' && createNewCollection()}
              />
              <div className={styles.modalActions}>
                <button
                  onClick={() => setShowCreateCollection(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={createNewCollection}
                  className={styles.saveButton}
                  disabled={!newCollectionTitle.trim()}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className={styles.filters}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search collections and hooks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterControls}>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Platforms</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
              className={styles.filterSelect}
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className={styles.sortButton}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Collections Grid */}
        <div className={styles.content}>
          {filteredCollections.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyContent}>
                <h2>No collections yet</h2>
                <p>Start building your content library by creating your first collection</p>
                <button
                  onClick={() => setShowCreateCollection(true)}
                  className={styles.createFirstButton}
                >
                  ✨ Create Your First Collection
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.collectionsGrid}>
              {filteredCollections.map((collection, index) => (
                <div key={collection.id} className={styles.collectionCard}>
                  <div className={styles.collectionHeader}>
                    <h3 className={styles.collectionTitle}>{collection.title}</h3>
                    <div className={styles.collectionActions}>
                      <button
                        onClick={() => toggleCollectionExpansion(collection.id)}
                        className={styles.showButton}
                        title={expandedCollections.has(collection.id) ? "Hide details" : "Show details"}
                      >
                        {expandedCollections.has(collection.id) ? "👁️" : "👁️‍🗨️"}
                      </button>
                      <button
                        className={styles.pinButton}
                        title="Pin collection"
                      >
                        📌
                      </button>
                      <button
                        className={styles.editButton}
                        title="Edit collection"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteCollectionHandler(collection.id)}
                        className={styles.deleteButton}
                        title="Delete collection"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.collectionMeta}>
                    <span className={styles.collectionDate}>
                      {formatDate(collection.created_at)}
                    </span>
                    <span className={styles.hookCount}>
                      {collection.hooks.length} hook{collection.hooks.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {expandedCollections.has(collection.id) && (
                    <>
                      {collection.hooks.length > 0 ? (
                        <div className={styles.hooksList}>
                          {collection.hooks.map((hook) => (
                            <div key={hook.id} className={styles.hookItem}>
                              <div className={styles.hookContent}>
                                <p className={styles.hookText}>{hook.text}</p>
                                {hook.platform && (
                                  <span className={styles.hookPlatform}>{hook.platform}</span>
                                )}
                              </div>
                              
                              <div className={styles.hookActions}>
                                <button
                                  onClick={() => copyToClipboard(hook.text, 'Hook')}
                                  className={styles.copyButton}
                                  title="Copy hook"
                                >
                                  📋
                                </button>
                                <button
                                  className={styles.editButton}
                                  title="Edit hook"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => deleteHookHandler(hook.id)}
                                  className={styles.deleteButton}
                                  title="Delete hook"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={styles.emptyCollection}>
                          <p>No hooks in this collection yet</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
} 
