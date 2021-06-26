import { GetServerSideProps, NextPage } from 'next'
import { useEffect, useMemo } from 'react'

import { createCharacterKey } from '@/lib/createCharacterKey'
import { CharacterRouteStruct } from '@/lib/structs'
import { useAchievementsQuery } from '@/modules/achievement/hooks/useAchievementsQuery'
import { AchievementList } from '@/modules/achievement/AchievementList'
import { withLayout } from '@moxy/next-layout'
import { DashboardLayout } from '@/modules/layout/DashboardLayout'
import { CHARACTER_CLASS_MAP, CHARACTER_RACE_MAP } from '@/lib/constants'

import { CharacterPageHeader } from '@/modules/character/CharacterPageHeader'
import {
  initialCharacterState,
  useCharacterStore,
} from '@/modules/character/store/useCharacterStore'
import { BattleNetResponse, Character } from '@/types'
import { useCharacterAchievementsQuery } from '@/modules/character/hooks/useCharacterAchievementsQuery'

type CharacterAchievementsPageProps = {
  category?: string[]
  character: Character
}

const _CharacterAchievementsPage: NextPage<CharacterAchievementsPageProps> = ({
  category,
  character,
}) => {
  const { set } = useCharacterStore()
  const { region, realmSlug, name } = character

  const characterKey = createCharacterKey({ region, realmSlug, name })
  const characterProps = useMemo(
    () => ({
      region,
      ...character,
      characterKey,
    }),
    [character, characterKey, region]
  )

  useEffect(() => {
    if (characterKey) {
      set(characterProps)
    }

    return () => {
      set(initialCharacterState)
    }
  }, [character, characterKey, characterProps, region, set])

  const { isSuccess: isAchsSuccess } = useAchievementsQuery(
    {
      factionId: character?.faction,
    },
    {
      enabled: !!characterKey,
    }
  )

  const { isSuccess: isCharAchsSuccess } = useCharacterAchievementsQuery(
    [characterProps],
    {
      enabled: isAchsSuccess,
    }
  )

  const isSuccess = isAchsSuccess && isCharAchsSuccess

  return (
    <>
      <div className="space-y-8">
        {isSuccess && (
          <AchievementList
            category={category}
            characterKey={characterKey}
            factionId={character.faction}
          />
        )}
      </div>
    </>
  )
}

export const CharacterAchievementsPage = withLayout(
  <DashboardLayout header={<CharacterPageHeader />} />
)(_CharacterAchievementsPage)

const fetchCharacter = async ({
  region,
  realm,
  name,
}): Promise<BattleNetResponse<Character>> => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/bnet/character/${region}/${realm}/${name}`
  ).then((res) => res.json())
}

const createSeoProps = (character: Character) => {
  const { name, realm, level, raceId, classId, region, guild } = character
  const nameAndRealm = `${name} - ${realm} (${region.toUpperCase()})`
  const guildName = guild ? `<${guild}>` : ''
  const info = `Level ${level} ${CHARACTER_RACE_MAP[raceId]} ${CHARACTER_CLASS_MAP[classId]}`
  return {
    title: `${name} - Achievements`,
    description: `${nameAndRealm} ${guildName} ${info}`,
  }
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
  const characterResponse = await fetchCharacter({ region, realm, name })

  if (characterResponse.error) {
    return {
      notFound: true,
    }
  }

  const character = characterResponse.data

  return {
    props: {
      seo: createSeoProps(character),
      category: category || null,
      character: {
        region,
        ...character,
      },
    },
  }
}
