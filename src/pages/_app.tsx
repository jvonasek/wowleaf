import '../styles/base.css'

import { Provider as SessionProvider } from 'next-auth/client'
import App from 'next/app'
import Head from 'next/head'
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
  render(): JSX.Element {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <script>{`const whTooltips = {colorLinks: true, iconizeLinks: false, renameLinks: true, iconSize: true}`}</script>
          <script src="https://wow.zamimg.com/widgets/power.js"></script>
        </Head>
        <SessionProvider session={pageProps.session}>
          <QueryClientProvider client={queryClient}>
            <LayoutTree
              Component={Component}
              pageProps={pageProps}
              defaultLayout={<DashboardLayout />}
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
