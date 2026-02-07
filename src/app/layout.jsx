import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SmartCI - AI-Powered CI Pipeline Optimization',
  description: 'Reduce CI pipeline time by 8x with intelligent test selection. Save hours every day with SmartCI.',
  keywords: 'CI/CD, test optimization, DevOps, continuous integration, automated testing',
  authors: [{ name: 'SmartCI' }],
  openGraph: {
    title: 'SmartCI - Stop Wasting Time on Slow CI Pipelines',
    description: 'AI-powered test selection that saves 87% of CI time',
    url: 'https://smartci.app',
    siteName: 'SmartCI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartCI - AI-Powered CI Optimization',
    description: 'Reduce CI time by 8x with intelligent test selection',
    images: ['/og-image.png'],
  },
  icons: {
    
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>',
    
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}