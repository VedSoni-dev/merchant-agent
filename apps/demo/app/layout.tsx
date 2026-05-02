import type { ReactNode } from 'react'
import './globals.css'

export const metadata = {
  title: 'merchant-agent — the merchandising layer for the agentic web',
  description:
    'OpenAI and Google built the agent cash register. They forgot the rest of the store. merchant-agent is the missing layer.',
  openGraph: {
    title: 'merchant-agent',
    description: 'The merchandising layer for the agentic web.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Eat your own dog food: this site is itself a merchant-agent. */}
        <link rel="merchant-agent" href="/.well-known/merchant-agent" />
      </head>
      <body>{children}</body>
    </html>
  )
}
