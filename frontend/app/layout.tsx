import { Metadata, Viewport } from "next"
import "styles/index.css"
import Providers from "./providers"
import { config } from "project.config"
import { dateRangeOfEvent } from "utils/dateRangeOfEvent"

export const viewport: Viewport = {
  themeColor: "#f9fafb",
}

export const metadata: Metadata = {
  description: `Website des Zeltlagers Wittlich. Melde dich hier an um mit uns vom ${dateRangeOfEvent} nach ${config.location} zu fahren.`,
  icons: {
    icon: { type: "image/svg+xml", url: "favicon.svg" },
    apple: "apple-touch-icon.png",
  },
  manifest: "manifest.webmanifest",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="h-full" lang="de-DE">
      <body className="h-full text-gray-900 bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
