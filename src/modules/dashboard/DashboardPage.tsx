import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/client'
import { uniq, prop } from 'ramda'

import { createCharacterKey } from '@/lib/createCharacterKey'
import { useQuery } from 'react-query'
import { CharacterCard } from '@/components/CharacterCard'
import { useCharacterAchievementsQuery } from '@/modules/character/hooks/useCharacterAchievementsQuery'
import { useAchievementsQuery } from '@/modules/achievement/hooks/useAchievementsQuery'
import { Character } from '@/types'
import { CharacterStoreProps } from '@/modules/character/store/useCharacterStore'

export const DashboardPage: React.FC = () => {
  const [session] = useSession()
  const [characterList, setCharacterList] = useState<CharacterStoreProps[]>([])

  const { isSuccess, data: characters } = useQuery<Character[]>(
    '/api/user/characters',
    { enabled: !!session }
  )

  useEffect(() => {
    if (isSuccess && !!characters.length) {
      setCharacterList(
        characters.map((character) => ({
          ...character,
          characterKey: createCharacterKey(character),
        }))
      )
    }
  }, [isSuccess, characters, setCharacterList])

  const factions = uniq(characterList.map(prop('faction')))

  useAchievementsQuery(
    {
      factionId: factions.length === 1 ? factions[0] : undefined,
    },
    {
      enabled: !!characterList.length,
    }
  )

  useCharacterAchievementsQuery(characterList, {
    enabled: !!characterList.length,
  })

  return (
    <div>
      Dashboard
      <div className="grid grid-cols-4 gap-3">
        {isSuccess &&
          characters.map((char) => <CharacterCard key={char.id} {...char} />)}
      </div>
    </div>
  )
}
