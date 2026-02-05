import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ptBR } from '@clerk/localizations'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#22c55e',
}

export const metadata: Metadata = {
  title: 'TrampoJa - Trabalho Temporario',
  description:
    'Plataforma que conecta trabalhadores temporarios a mercados e comercios locais',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TrampoJa',
  },
}

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const content = (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )

  if (!clerkKey || clerkKey.includes('placeholder')) {
    return content
  }

  return (
    <ClerkProvider localization={ptBR}>{content}</ClerkProvider>
  )
}
