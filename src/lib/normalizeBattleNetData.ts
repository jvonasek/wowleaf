import {
  BattleNetRegion,
  LocalizedCharacter,
  LocalizedCharacterMedia,
  UserProfile,
  WoWAccountCharacter,
} from 'battlenet-api'

import { Character, JWToken } from '@/types'

import { createCharacterKey } from '@/lib/createCharacterKey'

type ResponseType =
  | 'character'
  | 'userProfile'
  | 'characterAchievements'
  | 'characterMedia'
type CharacterNormalizer = (
  res: LocalizedCharacter,
  region: BattleNetRegion,
  userId?: number
) => Character
type UserProfileNormalizer = (res: UserProfile) => Character[]
type CharacterAchievementsNormalizer = (res: any) => any
type CharacterMediaNormalizer = (
  res: LocalizedCharacterMedia
) => LocalizedCharacterMedia['assets']

type Normalizers<T> = T extends 'character'
  ? CharacterNormalizer
  : T extends 'userProfile'
  ? UserProfileNormalizer
  : T extends 'characterAchievements'
  ? CharacterAchievementsNormalizer
  : T extends 'characterMedia'
  ? CharacterMediaNormalizer
  : never

export const normalizeBattleNetData = <T extends ResponseType>(
  type: T
): Normalizers<T> => {
  const normalizers = {
    character: normalizeCharacter as CharacterNormalizer,
    characterMedia: normalizeCharacterMedia as CharacterMediaNormalizer,
    userProfile: normalizeUserProfile as UserProfileNormalizer,
    characterAchievements: normalizeCharacterAchievements as CharacterAchievementsNormalizer,
  }

  return normalizers[type] as Normalizers<T>
}

function normalizeCharacter(
  char: LocalizedCharacter,
  region: BattleNetRegion,
  userId?: number
): Character {
  const realmSlug = char.realm.slug
  const name = char.name
  const id = createCharacterKey({
    region,
    realmSlug,
    name,
  })

  return {
    id,
    userId,
    name,
    classId: char.character_class.id,
    raceId: char.race.id,
    faction: char.faction.type,
    gender: char.gender.type,
    realmSlug: char.realm.slug,
    guild: char?.guild?.name,
    covenantId: char?.covenant_progress?.chosen_covenant?.id,
    level: char.level,
    realm: char.realm.name,
    region,
  }
}

function normalizeUserProfile(res: UserProfile, token: JWToken): Character[] {
  const { wow_accounts } = res

  if (!wow_accounts && !wow_accounts.length) {
    return []
  }

  const characters = wow_accounts.reduce((prev, account) => {
    return prev.concat(account.characters)
  }, [] as WoWAccountCharacter[])

  return characters
    .map((char) => {
      const region = token.battlenet.region
      const realmSlug = char.realm.slug
      const name = char.name
      const id = createCharacterKey({
        region,
        realmSlug,
        name,
      })
      return {
        id,
        region,
        userId: token.id,
        guild: '',
        name,
        classId: char.playable_class.id,
        raceId: char.playable_race.id,
        faction: char.faction.type,
        gender: char.gender.type,
        realm: char.realm.name,
        realmSlug,
        level: char.level,
        covenantId: null,
      }
    })
    .sort((a, b) => b.level - a.level)
}

function normalizeCharacterAchievements(res: any): any {
  /* const mainCategories = [
    92,
    96,
    97,
    95,
    168,
    169,
    201,
    155,
    15117,
    15246,
    15301,
    81,
    15234,
  ]
  console.log({
    sum: res.category_progress
      .filter(({ category }) => mainCategories.includes(category.id))
      .reduce((prev, curr) => prev + curr.points, 0),
  }) */
  return res.achievements
}

const defaultCharacterAssets: LocalizedCharacterMedia['assets'] = [
  { key: 'avatar', value: '' },
  { key: 'inset', value: '' },
  { key: 'main', value: '' },
  { key: 'main-raw', value: '' },
]

function normalizeCharacterMedia(
  res: LocalizedCharacterMedia
): LocalizedCharacterMedia['assets'] {
  return (
    res?.assets ||
    defaultCharacterAssets.map((image) =>
      image.key === 'avatar' && !!res?.avatar_url
        ? {
            ...image,
            value: res?.avatar_url,
          }
        : image
    )
  )
}
