import '../styles/base.css';

import { Provider as SessionProvider } from 'next-auth/client';
import App from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { createQueryFn } from '@/lib/createQueryFn';
import { MainLayout } from '@/modules/layout/MainLayout';
import { LayoutTree } from '@moxy/next-layout';

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
