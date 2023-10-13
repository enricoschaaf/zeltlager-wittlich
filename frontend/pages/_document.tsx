import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
    return (
      <Html className="h-full" lang="de-DE">
        <Head>
          <meta
            name="description"
            content="Website des Zeltlagers Wittlich. Melde dich hier an um mit uns vom 04.08. - 14.08.2024 nach Wershofen zu fahren."
          />
          <meta name="theme-color" content="#f9fafb" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.webmanifest" />
          <link rel="icon" type="image/svg+xml" href="favicon.svg" />
        </Head>
        <body className="h-full text-gray-900 bg-gray-50">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
