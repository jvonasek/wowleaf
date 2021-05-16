import { useQuery } from 'react-query'
import { getSession } from 'next-auth/client'
import { NextPage } from 'next'
import { Character } from '@/prisma/app'

import { CharacterCard } from '@/components/CharacterCard'
import { CharacterSearch } from '@/modules/character-search/CharacterSearch'
import { DashboardPage } from '@/modules/dashboard/DashboardPage'
import { AchievementsGate } from '@/modules/achievement/AchievementsGate'

const getUserCharacters = () =>
  fetch(`/api/user/characters`).then((res) => res.json())

const Index: NextPage = ({ session }) => {
  console.log(session)
  const { isSuccess, data: characters } = useQuery<Character[]>(
    'UserCharacters',
    getUserCharacters,
    { enabled: !!session }
  )
  return (
    <div>
      <div className="mb-4">
        <CharacterSearch />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {isSuccess &&
          characters.map((char) => (
            <CharacterCard region="eu" key={char.id} {...char} />
          ))}
      </div>
      <AchievementsGate>
        {isSuccess && <DashboardPage characters={characters} />}
      </AchievementsGate>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  return {
    props: { session },
  }
}

export default Index
