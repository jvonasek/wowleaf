import { NextPage } from 'next'

const Custom404: NextPage = () => {
  return (
    <div className="text-center">
      <div className="text-[150px] font-bold">404</div>
      <h1 className="text-4xl font-bold">Page Not Found</h1>
    </div>
  )
}

// eslint-disable-next-line require-await
export const getStaticProps = () => {
  return {
    props: {
      breadcrumbs: false,
      seo: {
        title: '404 - Page Not Found',
      },
    },
  }
}

export default Custom404
