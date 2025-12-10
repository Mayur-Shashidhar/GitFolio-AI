'use client'

import { motion } from 'framer-motion'
import { FaUsers, FaGithub } from 'react-icons/fa'
import Image from 'next/image'

export default function Collaborators({ collaborators, theme = 'minimal' }) {
  if (!collaborators || collaborators.total_unique_collaborators === 0) return null

  const getThemeClasses = () => {
    switch (theme) {
      case 'neon':
        return 'bg-gradient-to-br from-neon-bg/50 to-neon-accent/10 border-neon-accent/30 text-white'
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
        return 'text-blue-600 dark:text-blue-400'
    }
  }

  const getCardClasses = () => {
    switch (theme) {
      case 'neon':
        return 'bg-black/30 border-neon-accent/20 hover:border-neon-accent/50'
      case 'glass':
        return 'bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/30'
      case 'dev':
        return 'bg-dev-card border-dev-accent/20 hover:border-dev-accent/50'
      default:
        return 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-8 rounded-2xl border ${getThemeClasses()}`}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <FaUsers className={`text-3xl ${getAccentColor()}`} />
          <h3 className={`text-2xl font-bold ${getAccentColor()}`}>
            Collaborators & Contributors
          </h3>
        </div>
        <p className="text-sm opacity-70">
          People who collaborate on and contribute to repositories
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className={`p-4 rounded-lg border ${getCardClasses()} text-center`}>
          <div className={`text-3xl font-bold mb-1 ${getAccentColor()}`}>
            {collaborators.total_unique_people}
          </div>
          <div className="text-sm opacity-70">Total People</div>
        </div>
        <div className={`p-4 rounded-lg border ${getCardClasses()} text-center`}>
          <div className={`text-3xl font-bold mb-1 ${getAccentColor()}`}>
            {collaborators.total_unique_collaborators}
          </div>
          <div className="text-sm opacity-70">Collaborators</div>
        </div>
        <div className={`p-4 rounded-lg border ${getCardClasses()} text-center`}>
          <div className={`text-3xl font-bold mb-1 ${getAccentColor()}`}>
            {collaborators.total_unique_contributors}
          </div>
          <div className="text-sm opacity-70">Contributors</div>
        </div>
        <div className={`p-4 rounded-lg border ${getCardClasses()} text-center`}>
          <div className={`text-3xl font-bold mb-1 ${getAccentColor()}`}>
            {collaborators.collaborators_by_repo.length}
          </div>
          <div className="text-sm opacity-70">Active Repos</div>
        </div>
      </div>

      {/* Top Collaborators & Contributors */}
      {collaborators.top_people && collaborators.top_people.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xl font-semibold mb-4">Top Collaborators & Contributors</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {collaborators.top_people.slice(0, 15).map((person, index) => (
              <motion.a
                key={person.username}
                href={`https://github.com/${person.username}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border ${getCardClasses()} transition-all hover:scale-105 cursor-pointer`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-16 h-16 mb-3">
                    <img
                      src={person.avatar_url}
                      alt={person.name}
                      className="rounded-full w-full h-full object-cover"
                    />
                  </div>
                  <div className="font-semibold text-sm mb-1 truncate w-full">
                    {person.name}
                  </div>
                  <div className={`text-xs opacity-70 mb-2 truncate w-full`}>
                    @{person.username}
                  </div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    <div className={`text-xs px-2 py-1 rounded-full bg-black/20 ${getAccentColor()}`}>
                      {person.repo_count} {person.repo_count === 1 ? 'repo' : 'repos'}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      person.type === 'collaborator' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {person.type}
                    </div>
                  </div>
                  {person.total_contributions && (
                    <div className="text-xs opacity-60 mt-1">
                      {person.total_contributions} commits
                    </div>
                  )}
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      )}

      {/* Repositories with Collaborators & Contributors */}
      {collaborators.collaborators_by_repo.length > 0 && (
        <div>
          <h4 className="text-xl font-semibold mb-4">Repositories with Collaborators & Contributors</h4>
          <div className="space-y-4">
            {collaborators.collaborators_by_repo.slice(0, 10).map((repo, index) => (
              <motion.div
                key={repo.repo_name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border ${getCardClasses()}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <a
                    href={repo.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-semibold hover:underline ${getAccentColor()}`}
                  >
                    {repo.repo_name}
                  </a>
                  <span className="text-xs opacity-70">
                    {repo.total_people} {repo.total_people === 1 ? 'person' : 'people'}
                  </span>
                </div>
                
                {/* Collaborators */}
                {repo.collaborators && repo.collaborators.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs font-semibold opacity-70 mb-2">Collaborators ({repo.collaborators.length})</div>
                    <div className="flex flex-wrap gap-2">
                      {repo.collaborators.slice(0, 5).map((collab) => (
                        <a
                          key={collab.username}
                          href={`https://github.com/${collab.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors text-xs"
                          title={collab.name}
                        >
                          <img
                            src={collab.avatar_url}
                            alt={collab.username}
                            className="w-5 h-5 rounded-full"
                          />
                          <span>@{collab.username}</span>
                        </a>
                      ))}
                      {repo.collaborators.length > 5 && (
                        <span className="px-3 py-1 rounded-full bg-black/20 text-xs opacity-70">
                          +{repo.collaborators.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Contributors */}
                {repo.contributors && repo.contributors.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold opacity-70 mb-2">Contributors ({repo.contributors.length})</div>
                    <div className="flex flex-wrap gap-2">
                      {repo.contributors.slice(0, 5).map((contrib) => (
                        <a
                          key={contrib.username}
                          href={`https://github.com/${contrib.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 hover:bg-green-500/30 transition-colors text-xs"
                          title={`${contrib.name} - ${contrib.contributions} commits`}
                        >
                          <img
                            src={contrib.avatar_url}
                            alt={contrib.username}
                            className="w-5 h-5 rounded-full"
                          />
                          <span>@{contrib.username}</span>
                          <span className="opacity-70">({contrib.contributions})</span>
                        </a>
                      ))}
                      {repo.contributors.length > 5 && (
                        <span className="px-3 py-1 rounded-full bg-black/20 text-xs opacity-70">
                          +{repo.contributors.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          {collaborators.collaborators_by_repo.length > 10 && (
            <p className="text-sm text-center mt-4 opacity-70">
              And {collaborators.collaborators_by_repo.length - 10} more repositories
            </p>
          )}
        </div>
      )}
    </motion.div>
  )
}
