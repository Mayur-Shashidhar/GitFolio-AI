'use client'

import { motion } from 'framer-motion'
import { FaUsers, FaCodeBranch, FaComments, FaHandshake, FaProjectDiagram, FaStar, FaNetworkWired } from 'react-icons/fa'

export default function CollaborationScore({ score, theme = 'minimal' }) {
  if (!score) return null

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

  const getScoreColor = (scoreValue) => {
    if (scoreValue >= 75) return 'text-green-500'
    if (scoreValue >= 60) return 'text-blue-500'
    if (scoreValue >= 40) return 'text-yellow-500'
    if (scoreValue >= 20) return 'text-orange-500'
    return 'text-gray-500'
  }

  const getProgressColor = (scoreValue) => {
    if (scoreValue >= 75) return 'from-green-500 to-emerald-500'
    if (scoreValue >= 60) return 'from-blue-500 to-cyan-500'
    if (scoreValue >= 40) return 'from-yellow-500 to-amber-500'
    if (scoreValue >= 20) return 'from-orange-500 to-red-500'
    return 'from-gray-500 to-gray-600'
  }

  const metrics = [
    {
      icon: FaCodeBranch,
      label: 'Fork Activity',
      value: score.metrics.fork_activity,
      description: 'Contributing to other projects',
    },
    {
      icon: FaComments,
      label: 'Issue Engagement',
      value: score.metrics.issue_engagement,
      description: 'Discussions and problem solving',
    },
    {
      icon: FaHandshake,
      label: 'Pull Requests',
      value: score.metrics.pull_request_activity,
      description: 'Code contributions',
    },
    {
      icon: FaUsers,
      label: 'Code Reviews',
      value: score.metrics.code_review_participation,
      description: 'Reviewing team code',
    },
    {
      icon: FaProjectDiagram,
      label: 'Team Projects',
      value: score.metrics.team_projects,
      description: 'Collaborative repositories',
    },
    {
      icon: FaStar,
      label: 'Community Impact',
      value: score.metrics.community_impact,
      description: 'Repos forked by others',
    },
    {
      icon: FaNetworkWired,
      label: 'Network Size',
      value: score.metrics.network_size,
      description: 'Collaborators + Contributors',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-8 rounded-2xl border ${getThemeClasses()}`}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className={`text-2xl font-bold mb-2 ${getAccentColor()}`}>
          Collaboration Score
        </h3>
        <p className="text-sm opacity-70">
          How well this developer works in team environments
        </p>
      </div>

      {/* Overall Score Circle */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <svg className="transform -rotate-90" width="200" height="200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="opacity-20"
            />
            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - score.overall_score / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className={getScoreColor(score.overall_score)} />
                <stop offset="100%" className={getScoreColor(score.overall_score)} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-5xl font-bold ${getScoreColor(score.overall_score)}`}>
              {score.overall_score}
            </div>
            <div className="text-sm opacity-70">out of 100</div>
          </div>
        </div>
      </div>

      {/* Level Badge */}
      <div className="text-center mb-8">
        <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${getProgressColor(score.overall_score)} text-white font-semibold text-lg mb-2`}>
          {score.level}
        </div>
        <p className="text-sm opacity-80 max-w-md mx-auto">
          {score.description}
        </p>
      </div>

      {/* Team Fit */}
      <div className="text-center mb-8 p-4 rounded-lg bg-black/10">
        <div className="text-sm font-semibold opacity-70 mb-1">Team Fit</div>
        <div className={`text-xl font-bold ${getAccentColor()}`}>
          {score.team_fit}
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="text-center p-4 rounded-lg bg-black/10"
          >
            <metric.icon className={`text-3xl mx-auto mb-2 ${getAccentColor()}`} />
            <div className={`text-2xl font-bold mb-1 ${getScoreColor(metric.value)}`}>
              {metric.value}
            </div>
            <div className="text-xs font-semibold mb-1">{metric.label}</div>
            <div className="text-xs opacity-60">{metric.description}</div>
          </motion.div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-9 gap-4 text-center text-sm">
        <div>
          <div className="font-bold text-lg">{score.stats.forked_repos}</div>
          <div className="opacity-70">Forked Repos</div>
        </div>
        <div>
          <div className="font-bold text-lg">{score.stats.total_issues}</div>
          <div className="opacity-70">Issues</div>
        </div>
        <div>
          <div className="font-bold text-lg">{score.stats.total_pull_requests}</div>
          <div className="opacity-70">Pull Requests</div>
        </div>
        <div>
          <div className="font-bold text-lg">{score.stats.pr_reviews}</div>
          <div className="opacity-70">PR Reviews</div>
        </div>
        <div>
          <div className="font-bold text-lg">{score.stats.collaborative_projects}</div>
          <div className="opacity-70">Team Projects</div>
        </div>
        <div>
          <div className="font-bold text-lg">{score.stats.repos_forked_by_others}</div>
          <div className="opacity-70">Repos Forked</div>
        </div>
        <div>
          <div className="font-bold text-lg">{score.stats.unique_collaborators}</div>
          <div className="opacity-70">Collaborators</div>
        </div>
        <div>
          <div className="font-bold text-lg">{score.stats.unique_contributors}</div>
          <div className="opacity-70">Contributors</div>
        </div>
        <div>
          <div className="font-bold text-lg">{score.stats.total_unique_people}</div>
          <div className="opacity-70">Total Network</div>
        </div>
      </div>
    </motion.div>
  )
}
