'use client'

import { motion } from 'framer-motion'
import styles from './HowItWorks.module.css'

const steps = [
  {
    id: 1,
    icon: "💡",
    title: "Enter Your Topic",
    description: "Describe what you want to create content about. Be specific to get better results.",
    color: "var(--color-primary)"
  },
  {
    id: 2,
    icon: "🎭",
    title: "Choose Your Tone",
    description: "Select from professional, funny, emotional, shocking, educational, or motivational tones.",
    color: "var(--color-accent)"
  },
  {
    id: 3,
    icon: "🚀",
    title: "Generate & Save",
    description: "Get viral hooks, titles, hashtags, and CTAs instantly. Save your favorites to your collection.",
    color: "var(--color-success)"
  }
]

export default function HowItWorks() {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>How It Works</h2>
        <p className={styles.subtitle}>
          Create viral content in just 3 simple steps
        </p>
      </div>

      <div className={styles.stepsContainer}>
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className={styles.step}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className={styles.stepNumber}>
              <span className={styles.number}>{step.id}</span>
            </div>
            
            <div className={styles.stepIcon} style={{ backgroundColor: step.color }}>
              <span className={styles.icon}>{step.icon}</span>
            </div>
            
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className={styles.ctaSection}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <p className={styles.ctaText}>
          Ready to create viral content? Start generating now!
        </p>
        <a href="#hero" className={styles.ctaButton}>
          🚀 Start Creating
        </a>
      </motion.div>
    </section>
  )
} 