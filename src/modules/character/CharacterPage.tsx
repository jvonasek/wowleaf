import { NextPage } from 'next'
import { useEffect } from 'react'

import Link from 'next/link'
import { AchievementCategories } from '@/modules/achievement-categories/AchievementCategories'

import { CharacterPageHeader } from './CharacterPageHeader'
import { CharacterAchievements } from './CharacterAchievements'

import { useCharacterStore } from './store/useCharacterStore'
import { CharacterParams } from './types'

type CharacterPageProps = Omit<CharacterParams, 'characterKey'>

export const CharacterPage: NextPage<CharacterPageProps> = ({
  region,
  realm,
  name,
}) => {
  const { set } = useCharacterStore()
  const isReady = !!(region && realm && name)

  useEffect(() => {
    if (isReady) {
      set({
        region,
        realm,
        name,
        characterKey: `${region}/${realm}/${name}`.toLowerCase(),
      })
    }
  }, [isReady, region, realm, name, set])

  return (
    <div className="space-y-7">
      <Link href="/character/eu/argent-dawn/razzelle">Razzelle</Link>
      <Link href="/character/us/kelthuzad/asmongold">Asmongold</Link>
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
