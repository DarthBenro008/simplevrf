import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { RootProvider } from "fumadocs-ui/provider"

const inter = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SimpleVRF",
  description: "A simple and secure Verifiable Random Function (VRF) implementation for the Fuel Network.",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      }
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
