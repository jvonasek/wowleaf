import { getSession } from 'next-auth/client'
import { NextPage } from 'next'

import { CharacterSearch } from '@/modules/character-search/CharacterSearch'
import { DashboardPage } from '@/modules/dashboard/DashboardPage'

const Index: NextPage = () => {
  return (
    <div>
      <div className="mb-4">
        <CharacterSearch />
      </div>

      <DashboardPage />
    </div>
  )
}

export default Index
