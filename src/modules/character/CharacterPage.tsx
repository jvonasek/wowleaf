import { NextPage, GetServerSideProps } from 'next'
import React, { useEffect } from 'react'
import { enums, object, string, optional, array } from 'superstruct'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { withLayout } from '@moxy/next-layout'

import { AchievementCategories } from '@/modules/achievement-categories/AchievementCategories'
import { AchievementsGate } from '@/modules/achievement/AchievementsGate'
import { CharacterAchievementsLayout } from '@/modules/layout/CharacterAchievementsLayout'

import { CharacterPageHeader } from './CharacterPageHeader'
import { CharacterAchievements } from './CharacterAchievements'

import { useCharacterStore } from './store/useCharacterStore'
import { CharacterParams } from './types'

import { BNET_REGIONS } from '@/lib/constants'

type CharacterPageProps = Omit<CharacterParams, 'characterKey'> & {
  category: string[]
}

const CharacterPage: NextPage<CharacterPageProps> = () => {
  const { characterKey, set } = useCharacterStore()

  const {
    query: { region, realm, name, category },
  } = useRouter()

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

    return () => {
      set({
        realm: '',
        name: '',
        characterKey: '',
      })
    }
  }, [isReady, region, realm, name, set])

  return (
    <div className="space-y-7">
      <CharacterPageHeader />
      <AchievementsGate category={category}>
        <Link href={`/character/${characterKey}/achievements`}>
          Achievements
        </Link>
      </AchievementsGate>
    </div>
  )
}

export default CharacterPage

/* const CharacterRouteStruct = object({
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
 */
