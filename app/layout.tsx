import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vaultify — Your Private, Encrypted Cloud',
  description: 'Vaultify provides private, zero-knowledge, end-to-end encrypted cloud storage.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-gray-900 bg-white">
        {children}
      </body>
    </html>
  )
}