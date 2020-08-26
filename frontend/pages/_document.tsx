import Document, { Head, Html, Main, NextScript } from "next/document"

class MyDocument extends Document {
  render() {
    return (
      <Html className="h-full" lang="de-DE">
        <Head>
          <meta
            name="description"
            content="Website des Zeltlagers Wittlich. Melde dich hier an um mit uns vom 08.08 - 18.08.21 nach Saarhölzbach zu fahren."
          />
          <meta name="theme-color" content="#f9fafb" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png"></link>
          <link rel="manifest" href="/manifest.webmanifest" />
          <link rel="icon" type="image/svg+xml" href="favicon.svg" />
          <link
            rel="preload"
            as="font"
            href="/Inter.var.latin.woff2"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </Head>
        <body className="h-full bg-gray-50 text-gray-900">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
