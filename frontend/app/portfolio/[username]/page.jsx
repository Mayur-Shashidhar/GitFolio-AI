'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Hero from '@/components/Hero'
import StatsCard from '@/components/StatsCard'
import ProjectCard from '@/components/ProjectCard'
import Skills from '@/components/Skills'
import Chart from '@/components/Chart'
import CollaborationScore from '@/components/CollaborationScore'
import Collaborators from '@/components/Collaborators'
import { FaPalette, FaArrowLeft, FaSyncAlt } from 'react-icons/fa'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const themes = [
  { id: 'minimal', name: 'Minimal', description: 'Clean and professional' },
  { id: 'neon', name: 'Neon Dark', description: 'Vibrant cyberpunk' },
  { id: 'glass', name: 'Glassmorphism', description: 'Modern frosted glass' },
  { id: 'dev', name: 'Developer', description: 'Terminal inspired' },
]

export default function PortfolioPage() {
  const params = useParams()
  const username = params.username

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [theme, setTheme] = useState('minimal')
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [username])

  const fetchProfile = async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)

      // Try to fetch existing data first (unless forcing refresh)
      let response = forceRefresh ? { ok: false } : await fetch(`${API_URL}/data/${username}`)
      
      if (!response.ok) {
        // If not found or forcing refresh, analyze the profile
        response = await fetch(`${API_URL}/analyze/${username}`)
        
        if (!response.ok) {
          throw new Error('Failed to analyze profile')
        }
        
        const result = await response.json()
        
        // Wait a moment for chart files to be fully written
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setProfile(result.data)
      } else {
        const data = await response.json()
        setProfile(data)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchProfile(true)
  }

  const getThemeBackground = () => {
    switch (theme) {
      case 'neon':
        return 'bg-gradient-to-br from-neon-bg via-purple-900 to-neon-bg'
      case 'glass':
        return 'bg-gradient-to-br from-glass-bg via-blue-900 to-glass-bg'
      case 'dev':
        return 'bg-dev-bg'
      default:
        return 'bg-gray-900'
    }
  }

  const getTextColor = () => {
    switch (theme) {
      case 'neon':
        return 'text-neon-text'
      case 'glass':
        return 'text-glass-text'
      case 'dev':
        return 'text-dev-text'
      default:
        return 'text-white'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-xl">Analyzing {username}'s profile...</p>
          <p className="text-gray-400 mt-2">This may take a few moments</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-white mb-4">Analysis Failed</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <FaArrowLeft />
            Try Another Profile
          </Link>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className={`min-h-screen ${getThemeBackground()} ${getTextColor()} transition-colors duration-300`}>
      {/* Fixed Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-3 bg-white backdrop-blur-lg rounded-lg hover:bg-gray-100 transition-all border border-gray-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh Profile Data"
        >
          <FaSyncAlt className={`text-xl text-black ${refreshing ? 'animate-spin' : ''}`} />
        </button>

        {/* Theme Selector Button */}
        <button
          onClick={() => setShowThemeSelector(!showThemeSelector)}
          className="p-3 bg-white backdrop-blur-lg rounded-lg hover:bg-gray-100 transition-all border border-gray-200 shadow-lg"
          title="Change Theme"
        >
          <FaPalette className="text-xl text-black" />
        </button>

        {/* Back Button */}
        <Link
          href="/"
          className="p-3 bg-white backdrop-blur-lg rounded-lg hover:bg-gray-100 transition-all border border-gray-200 shadow-lg"
          title="Back to Home"
        >
          <FaArrowLeft className="text-xl text-black" />
        </Link>
      </div>

      {/* Theme Selector Panel */}
      {showThemeSelector && (
        <div className="fixed top-20 right-4 z-50 bg-white backdrop-blur-lg rounded-xl p-4 border border-gray-200 shadow-xl space-y-2 animate-slide-down">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTheme(t.id)
                setShowThemeSelector(false)
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                theme === t.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              <div className="font-semibold">{t.name}</div>
              <div className="text-xs opacity-70">{t.description}</div>
            </button>
          ))}
        </div>
      )}

      {/* Hero Section */}
      <Hero profile={profile} theme={theme} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Stats Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">GitHub Statistics</h2>
          <StatsCard stats={profile.stats} theme={theme} />
        </section>

        {/* Skills Section */}
        {profile.top_languages && profile.top_languages.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Top Languages</h2>
            <div className="max-w-3xl mx-auto">
              <Skills languages={profile.top_languages} theme={theme} />
            </div>
          </section>
        )}

        {/* Charts Section */}
        {profile.charts && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Analytics</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {profile.charts.languages && (
                <Chart
                  src={`${API_URL}${profile.charts.languages}?t=${Date.now()}`}
                  alt="Language Distribution"
                  title="Language Distribution"
                  theme={theme}
                />
              )}
              {profile.charts.stars && (
                <Chart
                  src={`${API_URL}${profile.charts.stars}?t=${Date.now()}`}
                  alt="Star Growth"
                  title="Star Growth Timeline"
                  theme={theme}
                />
              )}
              {profile.charts.contributions && (
                <Chart
                  src={`${API_URL}${profile.charts.contributions}?t=${Date.now()}`}
                  alt="Contribution Heatmap"
                  title="Contribution Activity"
                  theme={theme}
                />
              )}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {profile.top_repositories && profile.top_repositories.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Top Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.top_repositories.map((repo, index) => (
                <ProjectCard
                  key={repo.full_name}
                  project={repo}
                  theme={theme}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}

        {/* Collaboration Score */}
        {profile.collaboration_score && (
          <section className="mb-16">
            <CollaborationScore score={profile.collaboration_score} theme={theme} />
          </section>
        )}

        {/* Collaborators */}
        {profile.collaborators && (
          <section className="mb-16">
            <Collaborators collaborators={profile.collaborators} theme={theme} />
          </section>
        )}

        {/* Contribution Summary */}
        {profile.contribution_summary && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Activity Summary</h2>
            <div className={`max-w-3xl mx-auto p-8 rounded-2xl ${
              theme === 'glass' ? 'glass-dark text-white' :
              theme === 'neon' ? 'bg-gradient-to-r from-neon-accent/10 to-neon-secondary/10 border border-neon-accent/30 text-white' :
              theme === 'dev' ? 'bg-dev-bg border border-dev-accent/30 text-dev-text' :
              'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
            }`}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-4xl font-bold mb-2">
                    {profile.contribution_summary.repos_updated_last_month || 0}
                  </div>
                  <div className="opacity-70">Repos Updated This Month</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">
                    {profile.contribution_summary.contribution_streak || 0}
                  </div>
                  <div className="opacity-70">Day Contribution Streak</div>
                </div>
                {profile.contribution_summary.most_active_day && (
                  <div>
                    <div className="text-4xl font-bold mb-2">
                      {profile.contribution_summary.most_active_day}
                    </div>
                    <div className="opacity-70">Most Active Day</div>
                  </div>
                )}
                <div>
                  <div className="text-4xl font-bold mb-2">
                    {profile.contribution_summary.repos_updated_last_year || 0}
                  </div>
                  <div className="opacity-70">Repos Updated This Year</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center py-8 border-t border-white/10">
          <p className="opacity-70">
            Generated by <span className="font-bold gradient-text">GitFolio AI</span>
          </p>
          <p className="text-sm opacity-50 mt-2">
            Last updated: {new Date(profile.analyzed_at).toLocaleDateString()}
          </p>
        </footer>
      </div>
    </div>
  )
}
