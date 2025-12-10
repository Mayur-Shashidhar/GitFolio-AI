import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GitFolio AI - GitHub Profile Analyzer',
  description: 'Analyze GitHub profiles and generate beautiful portfolio websites automatically',
  keywords: 'github, portfolio, analyzer, developer, profile',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
