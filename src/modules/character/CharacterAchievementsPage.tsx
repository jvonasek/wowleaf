import { NextPage, GetServerSideProps } from 'next'
import { useEffect } from 'react'

import { AchievementCategories } from '@/modules/achievement-categories/AchievementCategories'
import { useAchievementsQuery } from '@/modules/achievement/hooks/useAchievementsQuery'
import { CharacterPageHeader } from '@/modules/character/CharacterPageHeader'
import { CharacterAchievements } from '@/modules/character/CharacterAchievements'
import {
  initialCharacterState,
  useCharacterStore,
} from '@/modules/character/store/useCharacterStore'

import { CharacterRouteStruct } from '@/lib/structs'
import { createCharacterKey } from '@/lib/createCharacterKey'
import { Character, BattleNetResponse } from '@/types'

type CharacterAchievementsPageProps = {
  category?: string[]
  character: Character
}

export const CharacterAchievementsPage: NextPage<CharacterAchievementsPageProps> = ({
  category,
  character,
}) => {
  const { set } = useCharacterStore()
  const { region, realmSlug, name } = character

  const characterKey = createCharacterKey({ region, realmSlug, name })

  useEffect(() => {
    if (characterKey) {
      set({
        region,
        ...character,
        characterKey,
      })
    }

    return () => {
      set(initialCharacterState)
    }
  }, [character, characterKey, region, set])

  useAchievementsQuery(
    {
      factionId: character?.faction,
    },
    {
      enabled: !!characterKey,
    }
  )

  return (
    <div className="space-y-7">
      <CharacterPageHeader />
      <div className="grid grid-cols-12 gap-7">
        <div className="col-span-3 bg-surface p-7 rounded-lg">
          <AchievementCategories />
        </div>
        <div className="col-span-9 bg-surface p-7 rounded-lg">
          <CharacterAchievements category={category} />
        </div>
      </div>
    </div>
  )
}

const fetchCharacter = async ({
  region,
  realm,
  name,
}): Promise<BattleNetResponse<Character>> => {
  return fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/bnet/character/${region}/${realm}/${name}`
  ).then((res) => res.json())
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const [err, query] = CharacterRouteStruct.validate(context.query, {
    coerce: true,
  })

  if (err || !query) {
    return {
      notFound: true,
    }
  }

  const { region, realm, name, category } = query
  const character = await fetchCharacter({ region, realm, name })

  if (character.error) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      category: category || null,
      character: {
        region,
        ...character.data,
      },
    },
  }
}
