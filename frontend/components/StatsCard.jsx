'use client'

import { motion } from 'framer-motion'
import { FaStar, FaCodeBranch, FaUsers, FaBook, FaFire, FaCode } from 'react-icons/fa'

export default function StatsCard({ stats, theme = 'minimal' }) {
  const getThemeClasses = () => {
    switch (theme) {
      case 'neon':
        return 'bg-neon-bg/50 border-neon-accent/30 text-white'
      case 'glass':
        return 'glass-dark text-white'
      case 'dev':
        return 'bg-dev-bg border-dev-accent/30 text-dev-text'
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
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

  const statItems = [
    {
      icon: FaBook,
      label: 'Repositories',
      value: stats.total_repos || 0,
      color: 'text-blue-500',
    },
    {
      icon: FaStar,
      label: 'Total Stars',
      value: stats.total_stars || 0,
      color: 'text-yellow-500',
    },
    {
      icon: FaCodeBranch,
      label: 'Total Forks',
      value: stats.total_forks || 0,
      color: 'text-green-500',
    },
    {
      icon: FaCode,
      label: 'Total Commits',
      value: stats.total_commits || 0,
      color: 'text-purple-500',
    },
    {
      icon: FaUsers,
      label: 'Followers',
      value: stats.followers || 0,
      color: 'text-pink-500',
    },
    {
      icon: FaFire,
      label: 'Following',
      value: stats.following || 0,
      color: 'text-orange-500',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className={`p-6 rounded-xl border ${getThemeClasses()} card-hover`}
        >
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getAccentColor()} flex items-center justify-center mb-3 ${
                theme === 'neon' ? 'neon-glow' : ''
              }`}
            >
              <item.icon className="text-white text-xl" />
            </div>
            <div className={`text-3xl font-bold mb-1 ${theme === 'neon' ? 'neon-text' : ''}`}>
              {item.value.toLocaleString()}
            </div>
            <div className="text-sm opacity-70">{item.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
