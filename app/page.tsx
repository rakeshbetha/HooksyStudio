'use client'

import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './page.module.css'
import Hero from './components/Hero'
import HookOfTheDay from './components/HookOfTheDay'
import EnhancedOutputDisplay from './components/EnhancedOutputDisplay'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'

interface GeneratedContent {
  hooks: string[]
  titles: string[]
  hashtags: string[]
  ctas: string[]
}

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
      
      toast.success('🔄 Hook remixed successfully!', {
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
      <div className={styles.layout}>
        <main className={styles.main}>
          <Hero 
            onGenerate={handleGenerate}
            onRemix={handleRemix}
            isLoading={isLoading || isRemixing}
            canRemix={!!generatedContent}
          />
          
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
          
          {generatedContent && (
            <div className={styles.resultsSection}>
              <EnhancedOutputDisplay
                content={generatedContent}
                topic={currentTopic}
                tone={currentTone}
              />
            </div>
          )}
        </main>
        
        <Footer />
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </ErrorBoundary>
  )
} 