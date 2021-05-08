import {
  LocalizedCharacter,
  UserProfile,
  WoWAccountCharacter,
} from 'battlenet-api'
import { CharacterProps } from '@/types'

type ResponseType = 'character' | 'userProfile' | 'characterAchievements'
type CharacterNormalizer = (res: LocalizedCharacter) => CharacterProps
type UserProfileNormalizer = (res: UserProfile) => CharacterProps[]
type CharacterAchievementsNormalizer = (res: any) => any

type Normalizers<T> = T extends 'character'
  ? CharacterNormalizer
  : T extends 'userProfile'
  ? UserProfileNormalizer
  : T extends 'characterAchievements'
  ? CharacterAchievementsNormalizer
  : never

export const normalizeBattleNetData = <T extends ResponseType>(
  type: T
): Normalizers<T> => {
  const normalizers = {
    character: normalizeCharacter as CharacterNormalizer,
    userProfile: normalizeUserProfile as UserProfileNormalizer,
    characterAchievements: normalizeCharacterAchievements as CharacterAchievementsNormalizer,
  }

  return normalizers[type] as Normalizers<T>
}

function normalizeCharacter(char: LocalizedCharacter): CharacterProps {
  return {
    id: char.id,
    name: char.name,
    classId: char.character_class.id,
    raceId: char.race.id,
    faction: char.faction.type,
    gender: char.gender.type,
    realmSlug: char.realm.slug,
    guild: char?.guild?.name,
    covenantId: char?.covenant_progress?.chosen_covenant?.id,
    level: char.level,
  }
}

function normalizeUserProfile(res: UserProfile): CharacterProps[] {
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
  return res.achievements
}
