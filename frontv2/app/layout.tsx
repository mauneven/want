import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/navigation/Navbar'

export const metadata: Metadata = {
  title: 'Want',
  description: 'Want',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body><Navbar/>{children}</body>
    </html>
  )
}
