'use client'

import { motion } from 'framer-motion'
import { FaStar, FaCodeBranch, FaEye, FaExternalLinkAlt } from 'react-icons/fa'

export default function ProjectCard({ project, theme = 'minimal', index = 0 }) {
  const getThemeClasses = () => {
    switch (theme) {
      case 'neon':
        return 'bg-gradient-to-br from-neon-bg to-neon-accent/10 border-neon-accent/30 text-white'
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
        return 'text-neon-accent'
      case 'glass':
        return 'text-glass-accent'
      case 'dev':
        return 'text-dev-accent'
      default:
        return 'text-blue-600'
    }
  }

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      C: '#555555',
      Ruby: '#701516',
      Go: '#00ADD8',
      Rust: '#dea584',
      PHP: '#4F5D95',
      Swift: '#ffac45',
      Kotlin: '#A97BFF',
      Dart: '#00B4AB',
    }
    return colors[language] || '#858585'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`p-6 rounded-xl border ${getThemeClasses()} card-hover h-full flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`text-xl font-bold mb-2 ${getAccentColor()}`}>
            {project.name}
          </h3>
          {project.language && (
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getLanguageColor(project.language) }}
              ></span>
              <span className="text-sm opacity-70">{project.language}</span>
            </div>
          )}
        </div>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${getAccentColor()} hover:opacity-70 transition-opacity`}
        >
          <FaExternalLinkAlt />
        </a>
      </div>

      {/* Description */}
      <p className="text-sm opacity-80 mb-4 flex-1 line-clamp-3">
        {project.description || 'No description provided'}
      </p>

      {/* Topics */}
      {project.topics && project.topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.topics.slice(0, 5).map((topic) => (
            <span
              key={topic}
              className={`px-2 py-1 rounded-md text-xs ${
                theme === 'neon'
                  ? 'bg-neon-accent/20 text-neon-accent'
                  : theme === 'glass'
                  ? 'glass text-glass-accent'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <FaStar className="text-yellow-500" />
          <span>{project.stars.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaCodeBranch className="text-green-500" />
          <span>{project.forks.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaEye className="text-blue-500" />
          <span>{project.watchers.toLocaleString()}</span>
        </div>
      </div>

      {/* Homepage Link */}
      {project.homepage && (
        <a
          href={project.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-4 text-sm ${getAccentColor()} hover:underline flex items-center gap-1`}
        >
          <span>Visit Homepage</span>
          <FaExternalLinkAlt className="text-xs" />
        </a>
      )}
    </motion.div>
  )
}
