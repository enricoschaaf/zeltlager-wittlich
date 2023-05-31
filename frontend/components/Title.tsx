import Head from "next/head"

export const Title = ({ children }: { children?: string }) => {
  const title = `${children ? `${children} | ` : ""}Zeltlager Wittlich`

  return (
    <Head>
      <title>{title}</title>
    </Head>
  )
}
