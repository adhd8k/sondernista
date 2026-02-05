import React from "react"
import type { Metadata } from 'next'
import { Space_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const spaceMono = Space_Mono({ 
  weight: ['400', '700'],
  subsets: ["latin"] 
});

export const metadata: Metadata = {
  title: 'Sondernista — Fine Art Photography',
  description: 'Fine art photography portfolio by Sondernista. Exploring light, form, and the poetry of the everyday.',
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${spaceMono.className} antialiased bg-background text-primary`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
