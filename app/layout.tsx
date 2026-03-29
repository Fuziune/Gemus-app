import React from "react"
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CSPostHogProvider } from './providers'
import './globals.css'
import { NextAuthSessionProvider } from './session-provider'

const _playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });
const _inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Gemus — AI Jewelry Gift Finder',
  description: 'Our AI analyzes face shape, skin undertone, and style persona to find jewelry she will actually wear.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <NextAuthSessionProvider>
        <CSPostHogProvider>
          {children}
          <Analytics />
        </CSPostHogProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
