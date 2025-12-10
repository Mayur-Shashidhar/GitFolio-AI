'use client'

import { motion } from 'framer-motion'

export default function Skills({ languages, theme = 'minimal' }) {
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
        return 'from-neon-accent to-neon-secondary'
      case 'glass':
        return 'from-glass-accent to-blue-500'
      case 'dev':
        return 'from-dev-accent to-dev-keyword'
      default:
        return 'from-blue-500 to-purple-500'
    }
  }

  const getLanguageColor = (index) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-yellow-500 to-orange-500',
      'from-green-500 to-emerald-500',
      'from-purple-500 to-pink-500',
      'from-red-500 to-rose-500',
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="space-y-6">
      {languages.map((lang, index) => (
        <motion.div
          key={lang.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">{lang.name}</span>
            <span className={`font-bold ${theme === 'neon' ? 'neon-text' : ''}`}>
              {lang.percentage.toFixed(1)}%
            </span>
          </div>
          <div className={`h-3 rounded-full overflow-hidden ${getThemeClasses()}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${lang.percentage}%` }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
              className={`h-full bg-gradient-to-r ${getLanguageColor(index)} ${
                theme === 'neon' ? 'neon-glow' : ''
              }`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
