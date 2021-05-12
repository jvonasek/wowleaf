import { NextPage, GetServerSideProps } from 'next'
import { useEffect } from 'react'
import { enums, object, string, optional, array } from 'superstruct'

import { AchievementCategories } from '@/modules/achievement-categories/AchievementCategories'
import { AchievementsGate } from '@/modules/achievement/AchievementsGate'

import { CharacterPageHeader } from './CharacterPageHeader'
import { CharacterAchievements } from './CharacterAchievements'

import { useCharacterStore } from './store/useCharacterStore'
import { CharacterParams } from './types'

import { BNET_REGIONS } from '@/lib/constants'

type CharacterPageProps = Omit<CharacterParams, 'characterKey'> & {
  category: string[]
}

export const CharacterPage: NextPage<CharacterPageProps> = ({
  region,
  realm,
  name,
  category,
}) => {
  const { characterKey, set } = useCharacterStore()
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
      <CharacterPageHeader />
      <AchievementsGate category={category}>
        <div className="grid grid-cols-12 gap-7">
          <div className="col-span-3 bg-surface p-7 rounded-lg">
            <AchievementCategories
              category={category}
              basePath={`character/${characterKey}`}
            />
          </div>
          <div className="col-span-9 bg-surface p-7 rounded-lg">
            <CharacterAchievements />
          </div>
        </div>
      </AchievementsGate>
    </div>
  )
}

const CharacterRouteStruct = object({
  region: enums(BNET_REGIONS),
  realm: string(),
  name: string(),
  category: optional(array(string())),
})

export const getServerSideProps: GetServerSideProps = async (context) => {
  const [err, values] = CharacterRouteStruct.validate(context.query)
  console.log(context.query, err)
  if (err || !values) {
    return {
      notFound: true,
    }
  }

  return {
    props: values,
  }
}
