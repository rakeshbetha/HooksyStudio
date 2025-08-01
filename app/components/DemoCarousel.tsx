'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './DemoCarousel.module.css'

const demoSlides = [
  {
    id: 1,
    title: "Generate Viral Hooks",
    description: "Create scroll-stopping hooks in seconds",
    image: "🎯",
    features: ["AI-powered generation", "Multiple tone options", "Instant results"]
  },
  {
    id: 2,
    title: "Compelling Titles",
    description: "Craft titles that drive engagement",
    image: "📝",
    features: ["SEO optimized", "Engagement focused", "Brand aligned"]
  },
  {
    id: 3,
    title: "Trending Hashtags",
    description: "Discover viral hashtags for your niche",
    image: "🏷️",
    features: ["Trending analysis", "Niche specific", "Engagement boost"]
  },
  {
    id: 4,
    title: "Call-to-Actions",
    description: "Convert viewers into customers",
    image: "🎪",
    features: ["Conversion focused", "A/B tested", "High impact"]
  }
]

export default function DemoCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % demoSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + demoSlides.length) % demoSlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>See Hooksy in Action</h2>
        <p className={styles.subtitle}>
          Discover how our AI transforms your ideas into viral content
        </p>
      </div>

      <div className={styles.carouselContainer}>
        <button
          onClick={prevSlide}
          className={styles.navButton}
          aria-label="Previous slide"
        >
          ‹
        </button>

        <div className={styles.carousel}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className={styles.slide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.slideContent}>
                <div className={styles.slideImage}>
                  <span className={styles.emoji}>{demoSlides[currentSlide].image}</span>
                </div>
                <h3 className={styles.slideTitle}>
                  {demoSlides[currentSlide].title}
                </h3>
                <p className={styles.slideDescription}>
                  {demoSlides[currentSlide].description}
                </p>
                <div className={styles.features}>
                  {demoSlides[currentSlide].features.map((feature, index) => (
                    <div key={index} className={styles.feature}>
                      <span className={styles.featureDot}>•</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={nextSlide}
          className={styles.navButton}
          aria-label="Next slide"
        >
          ›
        </button>
      </div>

      <div className={styles.indicators}>
        {demoSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
} 