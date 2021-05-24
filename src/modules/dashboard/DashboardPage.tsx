import { useSession } from 'next-auth/client'
import { useQuery } from 'react-query'

import { CharacterCard } from '@/components/CharacterCard'
import { Character } from '@/types'

export const DashboardPage: React.FC = () => {
  const [session] = useSession()
  const userId = session?.user?.id as number

  const { isSuccess, data } = useQuery<Character[]>('/api/user/characters', {
    enabled: !!userId,
  })

  return (
    <div>
      <h1 className="text-2xl mb-4">Dashboard</h1>
      <div className="grid grid-cols-4 gap-3">
        {isSuccess &&
          data.map((char) => <CharacterCard key={char.id} {...char} />)}
      </div>
    </div>
  )
}
