'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaGithub, FaMapMarkerAlt, FaLink, FaTwitter, FaBuilding } from 'react-icons/fa'

export default function Hero({ profile, theme = 'minimal' }) {
  const getThemeClasses = () => {
    switch (theme) {
      case 'neon':
        return 'bg-neon-bg text-neon-text'
      case 'glass':
        return 'glass-dark text-glass-text'
      case 'dev':
        return 'bg-dev-bg text-dev-text'
      default:
        return 'bg-white text-gray-900 dark:bg-gray-900 dark:text-white'
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

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative overflow-hidden ${getThemeClasses()} py-20 px-4`}
    >
      {/* Background Effects */}
      {theme === 'neon' && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-neon-accent/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-neon-secondary/20 rounded-full blur-3xl"></div>
        </div>
      )}

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex-shrink-0"
          >
            <div className={`relative ${theme === 'neon' ? 'neon-glow' : ''}`}>
              <Image
                src={profile.avatar_url || '/default-avatar.png'}
                alt={profile.name}
                width={200}
                height={200}
                className="rounded-full border-4 border-white/20"
                priority
              />
              {theme === 'neon' && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-accent to-neon-secondary opacity-20 blur-xl"></div>
              )}
            </div>
          </motion.div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`text-4xl md:text-6xl font-bold mb-4 ${
                theme === 'neon' ? 'neon-text' : ''
              }`}
            >
              {profile.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className={`text-xl mb-2 ${getAccentColor()}`}
            >
              @{profile.username}
            </motion.p>

            {profile.bio && (
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-lg mb-6 opacity-80 max-w-2xl"
              >
                {profile.bio}
              </motion.p>
            )}

            {/* Meta Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap gap-4 justify-center md:justify-start text-sm mb-6"
            >
              {profile.location && (
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className={getAccentColor()} />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.company && (
                <div className="flex items-center gap-2">
                  <FaBuilding className={getAccentColor()} />
                  <span>{profile.company}</span>
                </div>
              )}
              {profile.blog && (
                <a
                  href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 hover:underline ${getAccentColor()}`}
                >
                  <FaLink />
                  <span>Website</span>
                </a>
              )}
              {profile.twitter_username && (
                <a
                  href={`https://twitter.com/${profile.twitter_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 hover:underline ${getAccentColor()}`}
                >
                  <FaTwitter />
                  <span>@{profile.twitter_username}</span>
                </a>
              )}
            </motion.div>

            {/* GitHub Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <a
                href={`https://github.com/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  theme === 'neon'
                    ? 'bg-gradient-to-r from-neon-accent to-neon-secondary hover:shadow-lg hover:shadow-neon-accent/50'
                    : theme === 'glass'
                    ? 'glass hover:bg-white/20'
                    : 'bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900'
                }`}
              >
                <FaGithub className="text-xl" />
                <span>View GitHub Profile</span>
              </a>
            </motion.div>
          </div>
        </div>

        {/* AI Summary Section */}
        {profile.ai_summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className={`mt-12 p-6 rounded-2xl ${
              theme === 'glass'
                ? 'glass-dark'
                : theme === 'neon'
                ? 'bg-gradient-to-r from-neon-accent/10 to-neon-secondary/10 border border-neon-accent/30'
                : theme === 'dev'
                ? 'bg-gray-800 border border-dev-accent/30'
                : 'bg-gray-100 dark:bg-gray-800'
            }`}
          >
            <h3 className={`text-xl font-bold mb-3 ${getAccentColor()}`}>
              About
            </h3>
            <p className="leading-relaxed opacity-90">{profile.ai_summary}</p>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}
