import { useEffect } from 'react'

import { CharacterPageHeader } from './CharacterPageHeader'
import { CharacterAchievements } from './CharacterAchievements'
import { AchievementCategories } from '../achievement-categories/AchievementCategories'

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
    <div className="space-y-7">
      <CharacterPageHeader />
      <div className="grid grid-cols-12 gap-7">
        <div className="col-span-3 bg-surface p-7 rounded-lg">
          <AchievementCategories />
        </div>
        <div className="col-span-9 bg-surface p-7 rounded-lg">
          <CharacterAchievements />
        </div>
      </div>
    </div>
  )
}
