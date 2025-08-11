'use client'

import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './analyze.module.css'
import ErrorBoundary from '../components/ErrorBoundary'
import { playSound } from '../utils/soundEffects'
import { useSearchParams } from 'next/navigation'

interface AnalysisScores {
  curiosity: number
  virality: number
  clarity: number
  emotion: number
  originality: number
}

interface AnalysisResult {
  scores: AnalysisScores
  suggestions: string[]
  weak_phrases: string[]
}

export default function AnalyzePage() {
  const [hook, setHook] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if hook is provided in URL parameters
    const hookParam = searchParams.get('hook')
    if (hookParam) {
      setHook(hookParam)
      // Auto-analyze after a short delay
      setTimeout(() => {
        analyzeHook(hookParam)
      }, 500)
    }
  }, [searchParams])

  const analyzeHook = async (hookText?: string) => {
    const textToAnalyze = hookText || hook.trim()
    if (!textToAnalyze) {
      setError('Please enter a hook to analyze')
      return
    }

    setIsAnalyzing(true)
    setError('')
    setAnalysis(null)

    try {
      const response = await fetch('/api/analyze_hook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hook: textToAnalyze }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze hook')
      }

      const result = await response.json()
      setAnalysis(result)
      playSound('generate-pop.mp3')
    } catch (err) {
      setError('Failed to analyze hook. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return styles.scoreGreen
    if (score >= 5) return styles.scoreYellow
    return styles.scoreRed
  }

  const getScoreIcon = (score: number) => {
    if (score >= 8) return '🔥'
    if (score >= 5) return '⚡'
    return '💡'
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
      console.error('Failed to copy:', err)
    }
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>🎛️ Hook Analyzer</h1>
          <p className={styles.subtitle}>
            Paste any hook and get instant analysis with improvement suggestions
          </p>
        </div>

        <div className={styles.analyzerSection}>
          <div className={styles.inputSection}>
            <label htmlFor="hook-input" className={styles.inputLabel}>
              Paste your hook here
            </label>
            <textarea
              id="hook-input"
              className={styles.hookInput}
              placeholder="Paste your hook here... (e.g., 'This one habit changed my life forever')"
              value={hook}
              onChange={(e) => setHook(e.target.value)}
              rows={6}
            />
            
            <button
              className={`${styles.analyzeButton} ${isAnalyzing ? styles.analyzing : ''}`}
              onClick={() => analyzeHook()}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? '🔍 Analyzing...' : '🔍 Analyze Hook'}
            </button>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {analysis && (
            <div className={styles.results}>
              {/* Scores Section */}
              <div className={styles.scoresSection}>
                <h3 className={styles.sectionTitle}>📊 Analysis Scores</h3>
                <div className={styles.scoresGrid}>
                  <div className={`${styles.scoreCard} ${getScoreColor(analysis.scores.curiosity)}`}>
                    <div className={styles.scoreIcon}>{getScoreIcon(analysis.scores.curiosity)}</div>
                    <div className={styles.scoreLabel}>Curiosity</div>
                    <div className={styles.scoreValue}>{analysis.scores.curiosity}/10</div>
                  </div>
                  
                  <div className={`${styles.scoreCard} ${getScoreColor(analysis.scores.virality)}`}>
                    <div className={styles.scoreIcon}>{getScoreIcon(analysis.scores.virality)}</div>
                    <div className={styles.scoreLabel}>Virality</div>
                    <div className={styles.scoreValue}>{analysis.scores.virality}/10</div>
                  </div>
                  
                  <div className={`${styles.scoreCard} ${getScoreColor(analysis.scores.clarity)}`}>
                    <div className={styles.scoreIcon}>{getScoreIcon(analysis.scores.clarity)}</div>
                    <div className={styles.scoreLabel}>Clarity</div>
                    <div className={styles.scoreValue}>{analysis.scores.clarity}/10</div>
                  </div>
                  
                  <div className={`${styles.scoreCard} ${getScoreColor(analysis.scores.emotion)}`}>
                    <div className={styles.scoreIcon}>{getScoreIcon(analysis.scores.emotion)}</div>
                    <div className={styles.scoreLabel}>Emotion</div>
                    <div className={styles.scoreValue}>{analysis.scores.emotion}/10</div>
                  </div>
                  
                  <div className={`${styles.scoreCard} ${getScoreColor(analysis.scores.originality)}`}>
                    <div className={styles.scoreIcon}>{getScoreIcon(analysis.scores.originality)}</div>
                    <div className={styles.scoreLabel}>Originality</div>
                    <div className={styles.scoreValue}>{analysis.scores.originality}/10</div>
                  </div>
                </div>
              </div>

              {/* Suggestions Section */}
              <div className={styles.suggestionsSection}>
                <h3 className={styles.sectionTitle}>💡 Suggested Improvements</h3>
                <div className={styles.suggestionsList}>
                  {analysis.suggestions.map((suggestion, index) => (
                    <div key={index} className={styles.suggestionCard}>
                      <div className={styles.suggestionText}>{suggestion}</div>
                      <button
                        className={styles.copyButton}
                        onClick={() => copyToClipboard(suggestion, 'Suggestion')}
                        title="Copy suggestion"
                      >
                        📋 Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weak Phrases Section */}
              {analysis.weak_phrases.length > 0 && (
                <div className={styles.weakPhrasesSection}>
                  <h3 className={styles.sectionTitle}>⚠️ Weak Phrases to Avoid</h3>
                  <div className={styles.weakPhrasesList}>
                    {analysis.weak_phrases.map((phrase, index) => (
                      <div key={index} className={styles.weakPhrase}>
                        {phrase}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </ErrorBoundary>
  )
} 