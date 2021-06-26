import { GetServerSideProps } from 'next'
import { NextSeoProps } from 'next-seo'

import { NextPage } from 'next'

import { CharacterSearch } from '@/modules/character-search/CharacterSearch'
import { DashboardPage } from '@/modules/dashboard/DashboardPage'

const Index: NextPage<{ seo: NextSeoProps }> = () => {
  return (
    <div>
      <div className="mb-4">
        <CharacterSearch />
      </div>

      <DashboardPage />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<{ seo: NextSeoProps }> =
  // eslint-disable-next-line require-await
  async () => {
    return {
      props: {
        seo: { title: 'Dashboard' },
      },
    }
  }

export default Index
