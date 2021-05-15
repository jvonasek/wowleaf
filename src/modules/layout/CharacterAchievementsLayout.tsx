import { NextPage } from 'next'
import { ReactNode, useEffect } from 'react'

import { AchievementCategories } from '@/modules/achievement-categories/AchievementCategories'
import { useAchievementsQuery } from '@/modules/achievement/hooks/useAchievementsQuery'
import { CharacterPageHeader } from '@/modules/character/CharacterPageHeader'
import { useCharacterStore } from '@/modules/character/store/useCharacterStore'

import { useTypeSafeRouter } from '@/hooks/useTypeSafeRouter'
import { CharacterRouteStruct } from '@/lib/structs'

type CharacterAchievementsLayoutProps = {
  children?: ReactNode
}

export const CharacterAchievementsLayout: NextPage<CharacterAchievementsLayoutProps> = ({
  children,
}) => {
  const { set } = useCharacterStore()

  const {
    isReady,
    query: { region, realm, name, category },
  } = useTypeSafeRouter(CharacterRouteStruct)

  useAchievementsQuery({
    category,
  })

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
      <CharacterPageHeader />
      <div className="grid grid-cols-12 gap-7">
        <div className="col-span-3 bg-surface p-7 rounded-lg">
          <AchievementCategories />
        </div>
        <div className="col-span-9 bg-surface p-7 rounded-lg">{children}</div>
      </div>
    </div>
  )
}
