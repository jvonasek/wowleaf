import App from 'next/app'
import { Provider as SessionProvider } from 'next-auth/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { LayoutTree } from '@moxy/next-layout'

import { MainLayout } from '@/modules/layout/MainLayout'

import '../styles/base.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

class RootApp extends App {
  render(): JSX.Element {
    const { Component, pageProps } = this.props
    return (
      <SessionProvider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <LayoutTree
            Component={Component}
            pageProps={pageProps}
            defaultLayout={<MainLayout />}
          />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SessionProvider>
    )
  }
}

export default RootApp
