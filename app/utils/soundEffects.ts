// Sound Effects Utility for Hooksy.studio
// Provides audio feedback for key user actions

interface SoundConfig {
  volume?: number
  playbackRate?: number
}

class SoundManager {
  private audioCache: Map<string, HTMLAudioElement> = new Map()
  private isEnabled: boolean = true
  private masterVolume: number = 0.4

  constructor() {
    // Check if user has previously disabled sounds
    if (typeof window !== 'undefined') {
      this.isEnabled = localStorage.getItem('hooksy-sound-enabled') !== 'false'
    }
  }

  /**
   * Play a sound effect with optimized loading
   */
  playSound(fileName: string, config: SoundConfig = {}) {
    if (!this.isEnabled) return

    try {
      const audio = this.getAudio(fileName)
      if (!audio) return

      // Apply configuration
      audio.volume = (config.volume || 1) * this.masterVolume
      audio.playbackRate = config.playbackRate || 1

      // Reset and play
      audio.currentTime = 0
      
      // Use a promise to handle the play operation more efficiently
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn(`Failed to play sound ${fileName}:`, error)
        })
      }
    } catch (error) {
      console.warn('Sound playback error:', error)
    }
  }

  /**
   * Get or create audio element with optimized loading
   */
  private getAudio(fileName: string): HTMLAudioElement | null {
    if (this.audioCache.has(fileName)) {
      return this.audioCache.get(fileName) || null
    }

    try {
      const audio = new Audio(`/sounds/${fileName}`)
      
      // Optimize loading for better performance
      audio.preload = 'auto'
      
      // Cache the audio element
      this.audioCache.set(fileName, audio)
      
      return audio
    } catch (error) {
      console.warn(`Failed to load sound ${fileName}:`, error)
      return null
    }
  }

  /**
   * Enable/disable sound effects
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('hooksy-sound-enabled', enabled.toString())
    }
  }

  /**
   * Set master volume (0-1)
   */
  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Get current enabled state
   */
  isSoundEnabled(): boolean {
    return this.isEnabled
  }

  /**
   * Preload all sounds with priority for remix sound
   */
  preloadSounds() {
    const sounds = [
      'toggle-click.mp3', // Load smallest sound first (used for save and toggle)
      'generate-pop.mp3', // Load generate sound (used for both generate and remix)
      'copy-blip.mp3', // Small sound for copy actions
      'delete-soft.mp3', // Medium sound for delete
      'save-confirm.mp3', // Large sound, load last (kept for potential future use)
      'remix-bounce.mp3' // Largest sound, load last (kept for potential future use)
    ]
    
    // Load sounds with a small delay between each to avoid blocking
    sounds.forEach((sound, index) => {
      setTimeout(() => {
        this.getAudio(sound)
      }, index * 100) // 100ms delay between each sound load
    })
  }
}

// Create singleton instance
const soundManager = new SoundManager()

// Export convenience functions
export const playSound = (fileName: string, config?: SoundConfig) => {
  soundManager.playSound(fileName, config)
}

export const setSoundEnabled = (enabled: boolean) => {
  soundManager.setEnabled(enabled)
}

export const setSoundVolume = (volume: number) => {
  soundManager.setVolume(volume)
}

export const isSoundEnabled = () => {
  return soundManager.isSoundEnabled()
}

export const preloadSounds = () => {
  soundManager.preloadSounds()
}

// Preload sounds when module is imported
if (typeof window !== 'undefined') {
  // Preload after a short delay to avoid blocking initial load
  setTimeout(() => {
    preloadSounds()
  }, 1000)
} 