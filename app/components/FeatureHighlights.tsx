'use client'

import { motion } from 'framer-motion'
import styles from './FeatureHighlights.module.css'

const features = [
  {
    id: 1,
    icon: "🤖",
    title: "AI-Powered Generation",
    description: "Advanced AI creates viral hooks, titles, hashtags, and CTAs tailored to your niche and tone."
  },
  {
    id: 2,
    icon: "⚡",
    title: "Lightning Fast",
    description: "Generate high-quality content in seconds, not hours. Save time and focus on what matters."
  },
  {
    id: 3,
    icon: "🎯",
    title: "Multiple Tones",
    description: "Choose from professional, funny, emotional, shocking, educational, or motivational tones."
  },
  {
    id: 4,
    icon: "💾",
    title: "Save & Organize",
    description: "Save your favorite content to your collection, organize with tags, and export in multiple formats."
  },
  {
    id: 5,
    icon: "📱",
    title: "Social Ready",
    description: "Get content optimized for Instagram, TikTok, LinkedIn, and other social platforms."
  }
]

export default function FeatureHighlights() {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Why Choose Hooksy?</h2>
        <p className={styles.subtitle}>
          Everything you need to create viral content that converts
        </p>
      </div>

      <div className={styles.featuresGrid}>
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            className={styles.feature}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className={styles.featureIcon}>
              <span className={styles.icon}>{feature.icon}</span>
            </div>
            
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className={styles.statsSection}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className={styles.statsGrid}>
          <div className={styles.stat}>
            <div className={styles.statNumber}>10K+</div>
            <div className={styles.statLabel}>Content Generated</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>500+</div>
            <div className={styles.statLabel}>Happy Users</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>99%</div>
            <div className={styles.statLabel}>Satisfaction Rate</div>
          </div>
        </div>
      </motion.div>
    </section>
  )
} 