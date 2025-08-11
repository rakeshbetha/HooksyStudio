import type { Metadata, Viewport } from 'next'
import { Sora } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import { AuthProvider } from './contexts/AuthContext'

const sora = Sora({ 
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap'
})

// Clash Display will be loaded via CSS import since it's not available in next/font/google
const clashDisplay = {
  variable: '--font-clash-display'
}

export const metadata: Metadata = {
  metadataBase: new URL('https://hooksy.studio'),
  title: 'Hooksy.studio - AI-Powered Hook Generator',
  description: 'Generate viral hooks, titles, hashtags, and CTAs with AI. Perfect for social media content creators and marketers.',
  keywords: 'AI hook generator, viral content, social media, marketing, content creation',
  authors: [{ name: 'Hooksy.studio' }],
  creator: 'Hooksy.studio',
  publisher: 'Hooksy.studio',
  robots: 'index, follow',
  openGraph: {
    title: 'Hooksy.studio - AI-Powered Hook Generator',
    description: 'Generate viral hooks, titles, hashtags, and CTAs with AI. Perfect for social media content creators and marketers.',
    url: 'https://hooksy.studio',
    siteName: 'Hooksy.studio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hooksy.studio - AI-Powered Hook Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hooksy.studio - AI-Powered Hook Generator',
    description: 'Generate viral hooks, titles, hashtags, and CTAs with AI. Perfect for social media content creators and marketers.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#a855f7',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sora.variable} ${clashDisplay.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
      </head>
      <body className={`${sora.className} antialiased`}>
        <AuthProvider>
          <Navbar />
          <main style={{ paddingTop: '70px' }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
} 