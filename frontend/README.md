# Frontend - GitFolio AI

Next.js 14 frontend for GitFolio AI portfolio generator.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.local.example .env.local
# Edit .env.local if needed
```

3. Run development server:
```bash
npm run dev
```

Visit `http://localhost:3000`

## Build for Production

```bash
npm run build
npm start
```

## Features

- **Modern UI**: Built with Next.js 14 App Router and TailwindCSS
- **Four Themes**:
  - Minimal - Clean professional design
  - Neon Dark - Vibrant cyberpunk aesthetic
  - Glassmorphism - Modern frosted glass effects
  - Developer - Terminal-inspired theme
- **Responsive**: Works on all screen sizes
- **Dark Mode**: Light/dark mode support
- **Animations**: Smooth transitions with Framer Motion
- **Dynamic**: Real-time data from backend API

## Components

- `Hero.jsx` - Profile header with avatar and bio
- `StatsCard.jsx` - GitHub statistics display
- `ProjectCard.jsx` - Repository showcase cards
- `Skills.jsx` - Language proficiency bars
- `Chart.jsx` - Data visualization wrapper

## Pages

- `/` - Username input and search
- `/portfolio/[username]` - Generated portfolio display

## Directory Structure

```
frontend/
├── app/
│   ├── layout.jsx
│   ├── page.jsx
│   ├── globals.css
│   └── portfolio/
│       └── [username]/
│           └── page.jsx
├── components/
│   ├── Hero.jsx
│   ├── StatsCard.jsx
│   ├── ProjectCard.jsx
│   ├── Skills.jsx
│   └── Chart.jsx
├── public/
├── package.json
├── tailwind.config.js
└── next.config.js
```
