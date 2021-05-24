import {
  BattleNetRegion,
  LocalizedCharacter,
  LocalizedCharacterMedia,
  UserProfile,
  WoWAccountCharacter,
} from 'battlenet-api'

import { Character } from '@/types'

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
  return {
    id: char.id,
    userId,
    name: char.name,
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

function normalizeUserProfile(res: UserProfile): Character[] {
  const { wow_accounts } = res

  if (!wow_accounts && !wow_accounts.length) {
    return []
  }

  const characters = wow_accounts.reduce((prev, account) => {
    return prev.concat(account.characters)
  }, [] as WoWAccountCharacter[])

  return characters
    .map((char) => ({
      id: char.id,
      name: char.name,
      classId: char.playable_class.id,
      raceId: char.playable_race.id,
      faction: char.faction.type,
      gender: char.gender.type,
      realmSlug: char.realm.slug,
      level: char.level,
    }))
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

function normalizeCharacterMedia(
  res: LocalizedCharacterMedia
): LocalizedCharacterMedia['assets'] {
  return res.assets
}
