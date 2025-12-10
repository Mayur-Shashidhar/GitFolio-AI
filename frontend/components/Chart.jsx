'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Chart({ src, alt, title, theme = 'minimal' }) {
  const [imageSrc, setImageSrc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  
  useEffect(() => {
    let mounted = true
    let retries = 0
    const maxRetries = 5
    
    const loadImage = () => {
      const img = new Image()
      img.onload = () => {
        if (mounted) {
          setImageSrc(src)
          setLoading(false)
        }
      }
      img.onerror = () => {
        if (mounted && retries < maxRetries) {
          retries++
          setTimeout(loadImage, 300 * retries) // Exponential backoff
        } else if (mounted) {
          setError(true)
          setLoading(false)
        }
      }
      img.src = src
    }
    
    // Start loading after a small delay
    const timer = setTimeout(loadImage, 200)
    
    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [src])
  
  const getThemeClasses = () => {
    switch (theme) {
      case 'neon':
        return 'bg-neon-bg/50 border-neon-accent/30'
      case 'glass':
        return 'glass-dark'
      case 'dev':
        return 'bg-dev-bg border-dev-accent/30'
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }
  }

  const getAccentColor = () => {
    switch (theme) {
      case 'neon':
        return 'text-neon-accent neon-text'
      case 'glass':
        return 'text-glass-accent'
      case 'dev':
        return 'text-dev-accent'
      default:
        return 'text-gray-900 dark:text-white'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-xl border ${getThemeClasses()} card-hover`}
    >
      {title && (
        <h3 className={`text-xl font-bold mb-4 ${getAccentColor()}`}>
          {title}
        </h3>
      )}
      <div className="relative w-full bg-white rounded-lg overflow-hidden min-h-[300px] flex items-center justify-center">
        {loading && !error && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <p>Chart unavailable</p>
          </div>
        )}
        {imageSrc && !error && (
          <img
            src={imageSrc}
            alt={alt}
            className="w-full h-auto"
          />
        )}
      </div>
    </motion.div>
  )
}
