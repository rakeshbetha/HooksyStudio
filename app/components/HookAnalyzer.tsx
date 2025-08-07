'use client'

import { useState } from 'react'
import { playSound } from '../utils/soundEffects'
import styles from './HookAnalyzer.module.css'

interface AnalysisScores {
  curiosity: number
  virality: number
  clarity: number
  emotion: number
}

interface AnalysisResult {
  scores: AnalysisScores
  suggestions: string[]
  weak_phrases: string[]
}

export default function HookAnalyzer() {
  const [hook, setHook] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')

  const analyzeHook = async () => {
    if (!hook.trim()) {
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
        body: JSON.stringify({ hook: hook.trim() }),
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
      // You can add toast notification here if you have it set up
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className={styles.analyzerContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>🎛️ Hook Analyzer</h2>
        <p className={styles.subtitle}>
          Paste any hook and get instant analysis with improvement suggestions
        </p>
      </div>

      <div className={styles.inputSection}>
        <textarea
          className={styles.hookInput}
          placeholder="Paste your hook here... (e.g., 'This one habit changed my life forever')"
          value={hook}
          onChange={(e) => setHook(e.target.value)}
          rows={4}
        />
        
        <button
          className={`${styles.analyzeButton} ${isAnalyzing ? styles.analyzing : ''}`}
          onClick={analyzeHook}
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
  )
} 