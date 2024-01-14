import { UIProvider } from '@yamada-ui/react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SVG Icon Generator',
  description: 'Generated SVG Icon',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UIProvider>
            {children}
        </UIProvider>
      </body>
    </html>
  )
}
