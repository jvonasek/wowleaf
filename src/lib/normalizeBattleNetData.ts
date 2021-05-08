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
    characterClass: char.character_class.name,
    race: char.race.name,
    faction: char.faction.type,
    gender: char.gender.type,
    realm: {
      name: char.realm.name,
      id: char.realm.id,
      slug: char.realm.slug,
    },
    guildName: char.guild && char.guild.name,
    level: char.level,
    lastLogin: new Date(char.last_login_timestamp).toISOString(),
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
      characterClass: char.playable_class.name,
      race: char.playable_race.name,
      faction: char.faction.type,
      gender: char.gender.type,
      realm: {
        name: char.realm.name,
        id: char.realm.id,
        slug: char.realm.slug,
      },
      guildName: '',
      level: char.level,
      lastLogin: undefined,
    }))
    .sort((a, b) => b.level - a.level)
}

function normalizeCharacterAchievements(res: any): any {
  return res.achievements
}
