import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nano Banana - AI Image Editor | Transform Photos with Text",
  description:
    "Transform any image with simple text prompts. Advanced AI model for consistent character editing and scene preservation.",
  keywords: [
    "AI Image Editor",
    "Transform Photos with Text",
    "AI Photo Editing",
    "Image Transform",
    "Text to Image",
    "AI Editor",
    "Photo Editor",
    "Image Manipulation",
    "AI Image Generation",
  ],
  generator: "v0.app",
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Nano Banana - AI Image Editor | Transform Photos with Text",
    description:
      "Transform any image with simple text prompts. Advanced AI model for consistent character editing and scene preservation.",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "Nano Banana",
    images: [
      {
        url: "/icon.svg",
        width: 1200,
        height: 630,
        alt: "Nano Banana - AI Image Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nano Banana - AI Image Editor | Transform Photos with Text",
    description:
      "Transform any image with simple text prompts. Advanced AI model for consistent character editing and scene preservation.",
    images: ["/icon.svg"],
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export const generateViewport = () => {
  return {
    themeColor: [
      {
        media: "(prefers-color-scheme: light)",
        color: "#ffffff",
      },
      {
        media: "(prefers-color-scheme: dark)",
        color: "#000000",
      },
    ],
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) - Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YCEF4JZ7G6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YCEF4JZ7G6');
          `}
        </Script>
      </head>
      <body className={`${geist.className} font-sans antialiased`}>
        {children}
        {/* Organization Schema - JSON-LD */}
        <Script id="organization-schema" strategy="afterInteractive">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Nano Banana",
              "url": "${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}",
              "logo": "${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/icon.svg",
              "description": "Transform any image with simple text prompts. Advanced AI model for consistent character editing and scene preservation.",
              "sameAs": [
                "https://twitter.com/nanobanana",
                "https://facebook.com/nanobanana",
                "https://instagram.com/nanobanana",
                "https://linkedin.com/company/nanobanana"
              ]
            }
          `}
        </Script>
        <Analytics />
      </body>
    </html>
  )
}
