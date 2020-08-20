import Head from "next/head"

export const Title = ({ children }: { children?: string }) => {
  return (
    <Head>
      <title>
        {children}
        {children && " | "}Zeltlager Wittlich
      </title>
    </Head>
  )
}
