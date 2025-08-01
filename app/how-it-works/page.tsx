'use client'

import styles from './HowItWorks.module.css'

export default function HowItWorksPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.heading}>How It Works 🚀</h1>
        <p className={styles.subheading}>
          Generate viral content in 3 simple steps
        </p>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Enter Your Topic</h3>
              <p className={styles.stepDescription}>
                Describe what you want to create content about. Be specific and detailed 
                to get better results. Examples: "How to start a business", "Fitness tips", 
                "Cooking recipes", etc.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Choose Your Tone</h3>
              <p className={styles.stepDescription}>
                Select from 6 different tones: Professional, Funny, Emotional, Shocking, 
                Educational, or Motivational. Each tone will generate content that matches 
                your brand voice and audience preferences.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>Generate & Copy</h3>
              <p className={styles.stepDescription}>
                Our AI instantly creates viral hooks, titles, hashtags, and CTAs. 
                Copy any piece with one click, save to your collection, or remix for 
                more variations. Ready to use on any platform!
              </p>
            </div>
          </div>
        </div>

        <div className={styles.features}>
          <h2 className={styles.featuresTitle}>Why Choose Hooksy.studio?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🤖</div>
              <h3 className={styles.featureTitle}>AI-Powered</h3>
              <p className={styles.featureDescription}>
                Trained on millions of viral posts to understand what makes content shareable
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚡</div>
              <h3 className={styles.featureTitle}>Lightning Fast</h3>
              <p className={styles.featureDescription}>
                Generate complete content sets in seconds, not hours
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎯</div>
              <h3 className={styles.featureTitle}>Multiple Tones</h3>
              <p className={styles.featureDescription}>
                From professional to funny, match your brand voice perfectly
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📱</div>
              <h3 className={styles.featureTitle}>Platform Ready</h3>
              <p className={styles.featureDescription}>
                Optimized for Instagram, TikTok, LinkedIn, Twitter, and more
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>💾</div>
              <h3 className={styles.featureTitle}>Save & Organize</h3>
              <p className={styles.featureDescription}>
                Build your content library and reuse your best-performing pieces
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔄</div>
              <h3 className={styles.featureTitle}>Remix & Iterate</h3>
              <p className={styles.featureDescription}>
                Generate multiple variations to find the perfect hook
              </p>
            </div>
          </div>
        </div>

        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>Ready to Create Viral Content?</h2>
          <p className={styles.ctaDescription}>
            Join thousands of creators who are already using Hooksy.studio to grow their audience
          </p>
          <a href="/" className={styles.ctaButton}>
            Start Creating Now 🚀
          </a>
        </div>
      </div>
    </div>
  )
} 