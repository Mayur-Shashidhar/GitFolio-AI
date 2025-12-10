'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaGithub, FaSearch, FaChartLine, FaRocket } from 'react-icons/fa'

export default function Home() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!username.trim()) {
      setError('Please enter a GitHub username')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Remove @ symbol if present and navigate to portfolio page
      const cleanUsername = username.trim().replace(/^@/, '')
      router.push(`/portfolio/${cleanUsername}`)
    } catch (err) {
      setError('Failed to analyze profile. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center items-center mb-6">
            <FaGithub className="text-6xl text-white mr-4" />
            <h1 className="text-6xl font-bold text-white">
              GitFolio <span className="gradient-text">AI</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your GitHub profile into a stunning portfolio website
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-16 animate-slide-up">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username..."
                className="flex-1 bg-transparent text-white px-6 py-4 outline-none text-lg placeholder-gray-400"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <FaSearch />
                    <span>Analyze</span>
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="text-red-400 mt-3 text-center">{error}</p>
            )}
          </form>

          {/* Example usernames */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm mb-3">Try these examples:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['torvalds', 'gaearon', 'sindresorhus', 'tj'].map((user) => (
                <button
                  key={user}
                  onClick={() => setUsername(user)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm transition-all duration-200 border border-white/10"
                >
                  @{user}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-slide-up">
          <FeatureCard
            icon={<FaChartLine className="text-4xl" />}
            title="Deep Analysis"
            description="Comprehensive analysis of your GitHub activity, languages, and contributions"
            color="from-blue-500 to-cyan-500"
          />
          <FeatureCard
            icon={<FaRocket className="text-4xl" />}
            title="Auto-Generated"
            description="Beautiful portfolio websites generated automatically from your profile"
            color="from-purple-500 to-pink-500"
          />
          <FeatureCard
            icon={<FaGithub className="text-4xl" />}
            title="Live Updates"
            description="Your portfolio updates daily with the latest GitHub activity"
            color="from-green-500 to-emerald-500"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 border-t border-white/10">
        <p>Made with ❤️ for developers, by developers</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, color }) {
  return (
    <div className="glass-dark rounded-2xl p-6 card-hover">
      <div className={`bg-gradient-to-r ${color} w-16 h-16 rounded-xl flex items-center justify-center mb-4 text-white`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
