import '../styles/base.css'

import { Provider as SessionProvider } from 'next-auth/client'
import App from 'next/app'
import Head from 'next/head'
import { NextSeo, DefaultSeo, NextSeoProps } from 'next-seo'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { NotificationContainer } from '@/modules/notifications/NotificationContainer'

import { createQueryFn } from '@/lib/createQueryFn'
import { DashboardLayout } from '@/modules/layout/DashboardLayout'
import { LayoutTree } from '@moxy/next-layout'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: process.env.NODE_ENV === 'production',
      refetchOnWindowFocus: false,
      queryFn: createQueryFn(process.env.NEXT_PUBLIC_BASE_URL),
    },
  },
})

class RootApp extends App {
  render() {
    const { Component, pageProps } = this.props

    const seo = (pageProps?.seo || {}) as NextSeoProps

    return (
      <>
        <Head>
          <script>{`const whTooltips = {colorLinks: true, iconizeLinks: false, renameLinks: true, iconSize: true}`}</script>
          <script src="https://wow.zamimg.com/widgets/power.js"></script>
        </Head>
        <DefaultSeo titleTemplate="%s | WOWLEAF" />
        {seo && <NextSeo {...seo} />}
        <SessionProvider session={pageProps.session}>
          <QueryClientProvider client={queryClient}>
            <LayoutTree
              Component={Component}
              pageProps={pageProps}
              defaultLayout={<DashboardLayout title={seo?.title} />}
            />
            <NotificationContainer />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </SessionProvider>
      </>
    )
  }
}

export default RootApp
