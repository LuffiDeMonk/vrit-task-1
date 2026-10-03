import type { Metadata } from "next"
import {
  Geist_Mono,
  Inter,
  Nunito_Sans,
  Outfit,
  Manrope,
} from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { SITE_URL } from "@/lib/constants"
import { cn } from "@/lib/utils"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

const nunitoSansHeading = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FakeStore Direct | Premium E-Commerce Catalog",
    template: "%s | FakeStore Direct",
  },
  description:
    "Explore premium electronics, jewelery, men's and women's clothing with real-time filtering, instant shopping cart, and Next.js SSR performance.",
  keywords: [
    "e-commerce",
    "electronics",
    "jewelery",
    "clothing",
    "shopping cart",
    "next.js",
  ],
  openGraph: {
    type: "website",
    siteName: "FakeStore Direct",
    title: "FakeStore Direct | Premium E-Commerce Catalog",
    description:
      "Explore premium electronics, jewelery, and clothing with real-time client filtering and local shopping cart.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable,
        nunitoSansHeading.variable,
        outfit.variable,
        manrope.variable
      )}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
