'use client'

import { useState } from 'react'
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
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRemixing, setIsRemixing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTopic, setCurrentTopic] = useState('')
  const [currentTone, setCurrentTone] = useState('')

  const handleGenerate = async (topic: string, tone: string) => {
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
        body: JSON.stringify({ topic, tone }),
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

  const handleRemix = async (topic: string, tone: string) => {
    setIsRemixing(true)
    setError(null)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, tone, isRemix: true }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remix content')
      }

      const data = await response.json()
      setGeneratedContent(data)
      
      // Play remix success sound (using generate-pop for faster response)
      playSound('generate-pop.mp3')
      
      toast.success('🔄 Content remixed successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } catch (error) {
      console.error('Error remixing content:', error)
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
      setIsRemixing(false)
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
            isLoading={isLoading || isRemixing}
            canRemix={!!generatedContent}
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