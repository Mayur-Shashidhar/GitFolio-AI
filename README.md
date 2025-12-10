# 🚀 GitFolio AI

**A GitHub Profile Analyzer + Auto-Generated Portfolio Website with Advanced Collaboration Analytics**

GitFolio AI is a complete system that analyzes GitHub profiles and automatically generates beautiful, dynamic portfolio websites. The system combines a Python backend for deep data analysis with a Next.js frontend for stunning presentation, featuring unique collaboration scoring and network visualization that no competitor offers.

## 🌟 Features

### Core Analytics
- **📊 GitHub Profile Analysis**: Comprehensive analysis of repositories, languages, commits, and contributions
- **📈 Data Visualization**: Beautiful charts showing language distribution, star growth, and contribution patterns
- **🤖 AI-Generated Summary**: Automatic "About Me" generation based on your GitHub activity
- **💾 Smart Caching**: 24-hour cache with manual refresh capability

### 🏆 Unique Features (No Competitor Has This!)
- **🤝 Collaboration Score**: 7-metric scoring system analyzing:
  - Fork Activity - Contributing to other projects
  - Issue Engagement - Discussions and problem solving
  - Pull Request Activity - Code contributions
  - Code Review Participation - Reviewing team code
  - Team Projects - Collaborative repositories
  - Community Impact - How many times your repos are forked
  - Network Size - Total collaborators + contributors
- **👥 Collaborators & Contributors Analysis**: Detailed breakdown of:
  - Unique collaborators (people with push access)
  - Unique contributors (commit authors with contribution counts)
  - Repository-wise collaboration mapping
  - Top people in your network
- **🎯 Team Fit Assessment**: Determines collaboration style and team compatibility
- **📊 Network Visualization**: Visual representation of your developer network

### User Experience
- **🎨 4 Premium Themes**: Minimal, Neon Dark, Glassmorphism, Developer
- **⚡ Auto-Updates**: Daily automated analysis and deployment via GitHub Actions
- **🔄 Manual Refresh**: Force refresh with animated loading states
- **📱 Fully Responsive**: Beautiful UI that works on all devices
- **♿ Accessible**: WCAG compliant with proper ARIA labels

## 🏗️ Architecture

```
GitFolio AI
├── Backend (Python + FastAPI)
│   ├── GitHub API integration
│   ├── Data analysis engine
│   └── Chart generation
├── Frontend (Next.js 14 + TailwindCSS)
│   ├── Dynamic portfolio pages
│   ├── Theme system
│   └── Responsive components
└── Automation (GitHub Actions)
    ├── Daily cron jobs
    └── Auto-deployment
```

## 🛠️ Tech Stack

### Backend
- **Python 3.13+**
- **FastAPI 0.109.0** - Modern async web framework
- **PyGithub 2.1.1** - GitHub API wrapper
- **Matplotlib >=3.9.0** - Static chart generation
- **Plotly 5.18.0** - Interactive visualizations
- **Pandas >=2.2.0** - Data manipulation
- **SciPy >=1.11.0** - Scientific computing

### Frontend
- **Next.js 14.1.0** - React framework with App Router
- **React 18** - UI library
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Icons** - Comprehensive icon library

### DevOps
- **GitHub Actions** - CI/CD automation
- **Vercel** - Deployment platform (recommended)
- **GitHub Pages** - Alternative deployment option

## 📦 Installation

### Prerequisites
- Python 3.13+
- Node.js 18+
- GitHub Personal Access Token ([Create one here](https://github.com/settings/tokens))

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
echo "GITHUB_TOKEN=your_github_token_here" > .env

# Run the server
uvicorn main:app --reload
```

The backend will be available at `http://localhost:8000`

**API Documentation**: Visit `http://localhost:8000/docs` for interactive Swagger UI

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🚀 Usage

### 1. Analyze a GitHub Profile

Visit `http://localhost:3000` and enter a GitHub username (with or without @).

Or use the API directly:
```bash
# Analyze a profile
curl http://localhost:8000/analyze/octocat

# Force refresh (bypass 24h cache)
curl http://localhost:8000/analyze/octocat?force_refresh=true
```

### 2. View Generated Portfolio

Navigate to `/portfolio/[username]` to see the beautifully generated portfolio.

Features:
- **Hero Section**: Profile info with avatar and bio
- **Stats Cards**: Key metrics and achievements
- **Skills**: Top programming languages with percentages
- **Charts**: Language distribution, star timeline, contribution heatmap
- **Top Projects**: Showcased repositories with stars and forks
- **Collaboration Score**: Unique 7-metric scoring system
- **Collaborators & Contributors**: Network visualization
- **Activity Summary**: Recent contributions and streaks

### 3. Theme Selection

Choose from 4 stunning themes using the palette icon:
- 🎨 **Minimal**: Clean and professional
- 🌈 **Neon Dark**: Vibrant cyberpunk aesthetic
- 🔷 **Glassmorphism**: Modern frosted glass effect
- 💻 **Developer**: Terminal-inspired design

### 4. Manual Refresh

Click the refresh button to force update the analysis (bypasses 24h cache).

### 5. Access Generated Data

```bash
# Get cached profile data
curl http://localhost:8000/data/octocat

# Get specific chart
curl http://localhost:8000/charts/octocat/languages.png --output languages.png
```

## 🤖 GitHub Actions Automation

The project includes automated workflows:

1. **Daily Analysis** (00:00 UTC)
   - Runs GitHub profile analysis
   - Generates updated charts
   - Commits changes
   - Triggers deployment

2. **Manual Trigger**
   - Run analysis on-demand via GitHub Actions UI

3. **Auto-Deploy**
   - Automatically deploys to Vercel/GitHub Pages
   - Updates live portfolio

### Setup GitHub Actions

1. Add secrets to your repository:
   - `GITHUB_TOKEN`: Your GitHub personal access token
   - `VERCEL_TOKEN`: Your Vercel deployment token (if using Vercel)

2. The workflow will run automatically

## 📊 Generated Data

The analyzer generates comprehensive profile data:

### JSON Output (`data/{username}.json`)
```json
{
  "username": "octocat",
  "name": "The Octocat",
  "bio": "...",
  "avatar_url": "https://...",
  "stats": {
    "total_repos": 50,
    "total_stars": 1000,
    "total_commits": 5000,
    "total_forks": 200,
    "followers": 200,
    "following": 100
  },
  "top_languages": [
    {"name": "Python", "percentage": 45.2, "bytes": 1234567},
    {"name": "JavaScript", "percentage": 30.5, "bytes": 987654}
  ],
  "top_repositories": [
    {
      "name": "awesome-project",
      "description": "...",
      "stars": 1000,
      "forks": 50,
      "language": "Python",
      "url": "https://..."
    }
  ],
  "contribution_summary": {
    "repos_updated_last_month": 10,
    "repos_updated_last_year": 35,
    "star_timeline": [...],
    "most_active_day": "Monday",
    "contribution_streak": 45
  },
  "collaboration_score": {
    "overall_score": 78.5,
    "level": "Strong Collaborator",
    "description": "Regular contributor to collaborative projects...",
    "metrics": {
      "fork_activity": 85.0,
      "issue_engagement": 70.0,
      "pull_request_activity": 80.0,
      "code_review_participation": 75.0,
      "team_projects": 82.0,
      "community_impact": 90.0,
      "network_size": 88.0
    },
    "stats": {
      "forked_repos": 15,
      "total_issues": 50,
      "total_pull_requests": 40,
      "pr_reviews": 30,
      "collaborative_projects": 8,
      "repos_forked_by_others": 120,
      "unique_collaborators": 12,
      "unique_contributors": 25,
      "total_unique_people": 37
    },
    "team_fit": "Collaborative"
  },
  "collaborators": {
    "total_unique_people": 37,
    "total_unique_collaborators": 12,
    "total_unique_contributors": 25,
    "collaborators_by_repo": [
      {
        "repo_name": "project-alpha",
        "repo_url": "https://...",
        "collaborators": [...],
        "contributors": [...],
        "total_people": 8
      }
    ],
    "top_people": [
      {
        "username": "developer1",
        "name": "Jane Doe",
        "avatar_url": "https://...",
        "repo_count": 5,
        "type": "contributor",
        "total_contributions": 127
      }
    ]
  },
  "ai_summary": "Octocat is a passionate full-stack developer...",
  "analyzed_at": "2025-12-10T10:30:00Z",
  "charts": {
    "languages": "/charts/octocat/languages.png",
    "stars": "/charts/octocat/stars.png",
    "contributions": "/charts/octocat/contributions.png"
  }
}
```

### Charts (stored in `charts/{username}/`)
- `languages.png` - Language distribution pie chart
- `stars.png` - Star growth timeline
- `contributions.png` - Contribution heatmap

### File Structure
```
backend/
├── data/
│   ├── {username}.json    # User-specific data
│   └── profile.json       # Default/latest
└── charts/
    └── {username}/        # User-specific charts
        ├── languages.png
        ├── stars.png
        └── contributions.png
```

## 🎨 Themes

Four professionally designed themes, each with dark backgrounds and optimized contrast:

### 1. 🎨 Minimal
- Clean and professional aesthetic
- Perfect for corporate portfolios
- Neutral color palette
- High readability

### 2. 🌈 Neon Dark
- Vibrant cyberpunk aesthetic
- Purple and cyan accents
- High-energy design
- Perfect for creative developers

### 3. 🔷 Glassmorphism
- Modern frosted glass effect
- Translucent elements
- Depth and layering
- Sophisticated and contemporary

### 4. 💻 Developer
- Terminal-inspired design
- Monospace typography
- Green matrix-style accents
- Perfect for backend engineers

All themes support:
- ✅ Fully responsive design
- ✅ Smooth animations
- ✅ Consistent component styling
- ✅ Accessibility standards

## 🔧 Configuration

### Backend Configuration

The backend automatically handles caching and file organization:

**Cache Strategy**:
- 24-hour automatic cache expiration
- Manual refresh via `force_refresh=true` parameter
- Username-specific data files: `data/{username}.json`
- Username-specific chart folders: `charts/{username}/`

**Rate Limiting**:
- Analyzes up to 30 repositories per user (prevents API rate limits)
- Up to 15 repositories for collaborator/contributor analysis
- Smart retry logic with exponential backoff

### Frontend Configuration

**Environment Variables** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Theme Customization** (`tailwind.config.js`):
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'neon-bg': '#0a0a1f',
        'neon-accent': '#00f0ff',
        // ... customize colors
      }
    }
  }
}
```

## 📝 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs` (Interactive API testing)
- **ReDoc**: `http://localhost:8000/redoc` (Clean documentation)

### Main Endpoints

#### `GET /analyze/{username}`
Analyze a GitHub profile and generate all data.

**Parameters**:
- `username` (path): GitHub username
- `force_refresh` (query, optional): Boolean to bypass cache

**Response**: Complete profile JSON

**Example**:
```bash
curl "http://localhost:8000/analyze/octocat?force_refresh=true"
```

#### `GET /data/{username}`
Get cached profile data.

**Parameters**:
- `username` (path): GitHub username
- `force_refresh` (query, optional): Boolean to bypass cache

**Response**: Cached profile JSON or 404 if not found

**Example**:
```bash
curl http://localhost:8000/data/octocat
```

#### `GET /charts/{username}/{chart_name}`
Get a specific chart image.

**Parameters**:
- `username` (path): GitHub username
- `chart_name` (path): Chart filename (`languages.png`, `stars.png`, `contributions.png`)

**Response**: PNG image file

**Example**:
```bash
curl http://localhost:8000/charts/octocat/languages.png --output languages.png
```

#### `GET /health`
Health check endpoint.

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-10T10:30:00Z"
}
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## ⚠️ Known Limitations

1. **Collaborators API**: Requires push/write access to repositories
   - Only works for repos you own or have collaborator access to
   - Falls back to contributor analysis for other repos

2. **Rate Limiting**: GitHub API has rate limits
   - Authenticated: 5,000 requests/hour
   - Unauthenticated: 60 requests/hour
   - Use a GitHub token for better limits

3. **Large Repositories**: Analysis limited to:
   - First 30 repositories for main analysis
   - First 15 repositories for collaboration analysis
   - Prevents API rate limit exhaustion

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'github'`
```bash
pip install -r requirements.txt
```

**Problem**: Charts not generating
```bash
# Ensure matplotlib backend is set correctly
export MPLBACKEND=Agg
```

**Problem**: 403 errors from GitHub API
```bash
# Verify your GitHub token is valid
# Check rate limits: https://api.github.com/rate_limit
```

### Frontend Issues

**Problem**: Charts not loading
- Check that backend is running on correct port
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

**Problem**: Theme not applying
- Clear browser cache
- Check browser console for CSS errors
- Verify TailwindCSS is compiled correctly

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🌟 What Makes GitFolio AI Different?

While there are many GitHub portfolio generators, GitFolio AI stands out with:

### 🏆 Unique Features
1. **7-Metric Collaboration Score** - No competitor offers this depth of collaboration analysis
2. **Network Visualization** - See your collaborators AND contributors in one place
3. **Community Impact Tracking** - Know how many times your work has been forked
4. **Team Fit Assessment** - Understand your collaboration style
5. **Username-Specific File Organization** - Production-ready multi-user support
6. **Smart 24h Caching** - Balance freshness with API rate limits
7. **Manual Refresh Button** - User control over data updates

### 💪 Technical Excellence
- **Python 3.13 Compatible** - Latest Python version support
- **Next.js 14 App Router** - Modern React architecture
- **Type-Safe APIs** - FastAPI with automatic validation
- **Responsive Design** - Works beautifully on all devices
- **4 Premium Themes** - Professional, tested, and accessible

### 🚀 Production Ready
- User-specific data isolation (`data/{username}.json`)
- User-specific chart storage (`charts/{username}/`)
- Proper error handling and graceful degradation
- CORS configured for deployment
- GitHub Actions automation included

## 🙏 Acknowledgments

- **GitHub API** for providing comprehensive profile data
- **FastAPI** for the excellent async web framework
- **Next.js** team for the incredible React framework
- **Vercel** for seamless deployment
- **TailwindCSS** for the utility-first CSS framework
- **Framer Motion** for beautiful animations
- All open-source contributors who make projects like this possible


## 🗺️ Roadmap

- [ ] Export portfolio as PDF
- [ ] LinkedIn integration
- [ ] Custom domain support
- [ ] Analytics dashboard
- [ ] Contribution graph visualization
- [ ] Multi-language support
- [ ] Repository comparison tool
- [ ] Team collaboration insights

---

**Made with ❤️ by developers, for developers**

⭐ Star this repo if you find it useful!
