import { NextPage, GetServerSideProps } from 'next'
import { useEffect } from 'react'
import { enums, object, string, optional, array } from 'superstruct'
import { useRouter } from 'next/router'
import { withLayout } from '@moxy/next-layout'

import { useTypeSafeRouter } from '@/hooks/useTypeSafeRouter'

import { CharacterAchievementsLayout } from '@/modules/layout/CharacterAchievementsLayout'
import { MainLayout } from '@/modules/layout/MainLayout'

import { CharacterAchievements } from './CharacterAchievements'

import { CharacterParams } from './types'

import { CharacterRouteStruct } from '@/lib/structs'

type CharacterAchievementsPageProps = Omit<CharacterParams, 'characterKey'> & {
  category: string[]
}

const CharacterAchievementsPage: NextPage<CharacterAchievementsPageProps> = () => {
  const {
    query: { category },
  } = useTypeSafeRouter(CharacterRouteStruct)

  return <CharacterAchievements />
}

export default withLayout(
  <MainLayout>
    <CharacterAchievementsLayout />
  </MainLayout>
)(CharacterAchievementsPage)
