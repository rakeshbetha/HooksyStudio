'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './page.module.css'
import Hero from './components/Hero'
import DemoCarousel from './components/DemoCarousel'
import EnhancedOutputDisplay from './components/EnhancedOutputDisplay'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import { GeneratedContent } from './types'
import { playSound } from './utils/soundEffects'
import HookOfTheDay from './components/HookOfTheDay'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [canRemix, setCanRemix] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [isRetraining, setIsRetraining] = useState(false)
  const [isRemixing, setIsRemixing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTopic, setCurrentTopic] = useState('')
  const [currentTone, setCurrentTone] = useState('')

  const handleGenerate = async (topic: string, tone: string, platform?: string) => {
    setIsLoading(true)
    setError(null)
    setCurrentTopic(topic)
    setCurrentTone(tone)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, tone, platform }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate content')
      }

      const data = await response.json()
      setGeneratedContent(data)
      
      // Play generate success sound
      playSound('generate-pop.mp3')
      
      toast.success('🎉 Content generated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (error) {
      console.error('Error generating content:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setError(errorMessage)
      
      toast.error(`❌ ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemix = async (topic: string, tone: string, platform?: string) => {
    setIsRemixing(true)
    setError(null)
    playSound('generate-pop.mp3')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          tone,
          isRemix: true,
          platform
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to remix content')
      }

      const result = await response.json()
      setGeneratedContent(result)
      setCanRemix(true)
    } catch (err) {
      setError('Failed to remix content. Please try again.')
      console.error('Remix error:', err)
    } finally {
      setIsRemixing(false)
    }
  }

  const handleRetrain = async (topic: string, tone: string, platform?: string) => {
    setIsRetraining(true)
    setError(null)
    playSound('generate-pop.mp3')

    try {
      const response = await fetch('/api/retrain_hook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          tone,
          platform
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to retrain hook')
      }

      const result = await response.json()
      setGeneratedContent(result.content)
      setCanRemix(true)
      
      // Show success message with attempts info
      toast.success(`🔥 Generated viral hook after ${result.attempts} attempts! Virality: ${result.scores.virality}/10`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (err) {
      setError('Failed to retrain hook. Please try again.')
      console.error('Retrain error:', err)
    } finally {
      setIsRetraining(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        {/* Hero Section with Form */}
        <section id="hero" className={styles.heroSection}>
          <Hero 
            onGenerate={handleGenerate}
            onRemix={handleRemix}
            onRetrain={handleRetrain}
            isLoading={isLoading}
            canRemix={canRemix}
            isRetraining={isRetraining}
          />
        </section>
        
        {/* Generated Content Section - Directly below form */}
        {(generatedContent || error) && (
          <section className={styles.outputSection} data-output-section>
            <div className={styles.contentSection}>
              {error && (
                <div className={styles.error}>
                  {error}
                </div>
              )}
              
              {generatedContent && (
                <EnhancedOutputDisplay
                  content={generatedContent}
                  topic={currentTopic}
                  tone={currentTone}
                />
              )}
            </div>
          </section>
        )}
        
        {/* Hook of the Day - Shows after content generation */}
        <HookOfTheDay />
        
        {/* Demo and Feature Sections - Below output */}
        <DemoCarousel />
        
        {/* CTA Section - Learn More */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContainer}>
            <p className={styles.ctaText}>
              Want to see how it works? 👉 <a href="/how-it-works" className={styles.ctaLink}>Learn More →</a>
            </p>
          </div>
        </section>
        
        {/* Mini Feature Row */}
        <section className={styles.miniFeatures}>
          <div className={styles.featuresRow}>
            <div className={styles.miniFeature}>
              <span className={styles.miniFeatureIcon}>⚡</span>
              <span className={styles.miniFeatureText}>Fast AI generation</span>
            </div>
            <div className={styles.miniFeature}>
              <span className={styles.miniFeatureIcon}>🎯</span>
              <span className={styles.miniFeatureText}>Tailored to your tone</span>
            </div>
          </div>
        </section>
        
        <Footer />
        <ToastContainer />
      </div>
    </ErrorBoundary>
  )
} 