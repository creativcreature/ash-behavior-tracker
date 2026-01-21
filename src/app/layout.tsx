import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/layout/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ash Behavior Tracker',
  description: 'Privacy-first behavior tracking for children with autism and developmental delays',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navigation />
        <main id="main-content" className="pb-20 md:pb-0">
          {children}
        </main>
      </body>
    </html>
  )
}
