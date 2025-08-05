'use client'

import { useState, useEffect } from 'react'
import styles from './HookOfTheDay.module.css'

interface HookTip {
  type: 'hook' | 'tip'
  title: string
  content: string
  emoji: string
  category: string
}

const hookTips: HookTip[] = [
  {
    type: 'hook',
    title: 'Creative Hook of the Day',
    content: '"What if I told you that the most successful creators have one thing in common? They all started with a hook that made people stop scrolling."',
    emoji: '🎣',
    category: 'Psychology'
  },
  {
    type: 'tip',
    title: 'Viral Tip from Hooksy AI',
    content: 'Use the "curiosity gap" technique: Give your audience a taste of what they\'ll learn, but leave them wanting more. It\'s the oldest trick in the book that still works!',
    emoji: '🧠',
    category: 'Strategy'
  },
  {
    type: 'hook',
    title: 'Creative Hook of the Day',
    content: '"The 3-second rule: If your hook doesn\'t grab attention in the first 3 seconds, you\'ve already lost 80% of your audience."',
    emoji: '⏱️',
    category: 'Timing'
  },
  {
    type: 'tip',
    title: 'Viral Tip from Hooksy AI',
    content: 'Start with a question that your audience can\'t help but answer in their head. Questions create instant engagement and make people feel involved.',
    emoji: '❓',
    category: 'Engagement'
  },
  {
    type: 'hook',
    title: 'Creative Hook of the Day',
    content: '"Behind every viral post is a creator who understood this simple truth: People don\'t share content, they share emotions."',
    emoji: '💫',
    category: 'Emotion'
  },
  {
    type: 'tip',
    title: 'Viral Tip from Hooksy AI',
    content: 'Use power words that trigger emotions: "Shocking," "Secret," "Hidden," "Exposed," "Revealed." These words are proven to increase click-through rates by 300%.',
    emoji: '⚡',
    category: 'Copywriting'
  },
  {
    type: 'hook',
    title: 'Creative Hook of the Day',
    content: '"The difference between a good hook and a great hook? One makes people think, the other makes people feel."',
    emoji: '❤️',
    category: 'Connection'
  },
  {
    type: 'tip',
    title: 'Viral Tip from Hooksy AI',
    content: 'Create urgency without being pushy. Use phrases like "Before you scroll past this" or "If you\'re still reading this" to create a sense of exclusivity.',
    emoji: '🚀',
    category: 'Urgency'
  }
]

export default function HookOfTheDay() {
  const [currentTip, setCurrentTip] = useState<HookTip>(hookTips[0])
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Show the card after a short delay
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    return () => clearTimeout(showTimer)
  }, [])

  useEffect(() => {
    // Rotate through tips every 30 seconds
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * hookTips.length)
        setCurrentTip(hookTips[randomIndex])
        setIsAnimating(false)
      }, 300) // Animation duration
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * hookTips.length)
      setCurrentTip(hookTips[randomIndex])
      setIsAnimating(false)
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div className={`${styles.hookOfTheDay} ${isVisible ? styles.visible : ''}`}>
      <div className={`${styles.card} ${isAnimating ? styles.animating : ''}`}>
        <div className={styles.header}>
          <div className={styles.emoji}>{currentTip.emoji}</div>
          <div className={styles.titleContainer}>
            <h3 className={styles.title}>{currentTip.title}</h3>
            <span className={styles.category}>{currentTip.category}</span>
          </div>
          <button 
            onClick={handleRefresh}
            className={styles.refreshButton}
            title="Get new tip"
          >
            🔄
          </button>
        </div>
        
        <div className={styles.content}>
          <p className={styles.tipText}>{currentTip.content}</p>
        </div>
        
        <div className={styles.footer}>
          <div className={styles.sparkle}>✨</div>
          <span className={styles.poweredBy}>Powered by Hooksy AI</span>
          <div className={styles.sparkle}>✨</div>
        </div>
      </div>
    </div>
  )
} 