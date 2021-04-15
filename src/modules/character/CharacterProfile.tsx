import { useEffect } from 'react'

import { CharacterAchievements } from './CharacterAchievements'

import { useCharacterStore } from './store/useCharacterStore'
import { CharacterParams } from './types'

type CharacterProfileProps = CharacterParams

export const CharacterProfile: React.FC<CharacterProfileProps> = ({
  region,
  realm,
  name,
}) => {
  const { set } = useCharacterStore()

  useEffect(() => {
    set({
      region,
      realm,
      name,
    })
  }, [region, realm, name, set])

  return (
    <div>
      <CharacterAchievements />
    </div>
  )
}
