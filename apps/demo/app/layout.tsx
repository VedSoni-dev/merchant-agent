import type { ReactNode } from 'react'
import './globals.css'

export const metadata = {
  title: 'merchant-agent — the protocol for agent-to-agent optimization (AAO)',
  description:
    'SEO. GEO. AEO. AAO. When personal agents do the shopping, they are the buyer. merchant-agent is the protocol that lets your store speak to them.',
  openGraph: {
    title: 'merchant-agent — the AAO protocol',
    description: 'SEO. GEO. AEO. AAO. The protocol for agent-to-agent optimization.',
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
