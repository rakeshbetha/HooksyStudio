export type HookScore = 'Weak' | 'Medium' | 'Viral'

export interface HookScoreResult {
  score: HookScore
  emoji: string
  reason: string
}

const emotionalWords = [
  'insane', 'crazy', 'unbelievable', 'amazing', 'incredible', 'mind-blowing',
  'secret', 'hidden', 'unknown', 'don\'t know', 'never told', 'shocking',
  'game-changing', 'revolutionary', 'breakthrough', 'discovery', 'revealed',
  'exposed', 'truth', 'reality', 'fact', 'proof', 'evidence',
  'mistake', 'error', 'wrong', 'fail', 'success', 'win',
  'lose', 'struggle', 'battle', 'fight', 'overcome', 'victory',
  'pain', 'suffering', 'happiness', 'joy', 'excitement', 'thrill',
  'fear', 'anxiety', 'confidence', 'courage', 'brave', 'bold',
  'genius', 'brilliant', 'smart', 'clever', 'wise', 'expert',
  'beginner', 'newbie', 'pro', 'master', 'guru', 'legend'
]

export function calculateHookScore(hook: string): HookScoreResult {
  const words = hook.toLowerCase().split(/\s+/)
  const wordCount = words.length
  
  // Count emotional words
  const emotionalWordCount = words.filter(word => 
    emotionalWords.some(emotionalWord => 
      word.includes(emotionalWord.toLowerCase())
    )
  ).length
  
  // Calculate score based on length and emotional words
  let score: HookScore
  let emoji: string
  let reason: string
  
  if (wordCount < 3 || (wordCount < 5 && emotionalWordCount === 0)) {
    score = 'Weak'
    emoji = '⚠️'
    reason = 'Too short or lacks emotional impact'
  } else if (wordCount >= 5 && wordCount <= 12 && emotionalWordCount >= 1) {
    score = 'Viral'
    emoji = '🚀'
    reason = 'Perfect length with emotional hooks'
  } else if (wordCount >= 5 && wordCount <= 15) {
    score = 'Medium'
    emoji = '😐'
    reason = 'Good length but could be more engaging'
  } else {
    score = 'Weak'
    emoji = '⚠️'
    reason = 'Too long or lacks engagement'
  }
  
  return { score, emoji, reason }
} 