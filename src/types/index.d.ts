import { SessionProvider } from 'next-auth/client'
import { BattleNetRegion } from 'battlenet-api'

export { BattleNetRegion }

export interface GenericObject {
  [key: string]: any
}

export type CharacterFaction = 'ALLIANCE' | 'HORDE'
export type CharacterGender = 'MALE' | 'FEMALE'

export type Achievement = {
  id: number
  name: string
  categoryId: number | null
  description: string
  points: number | null
  isAccountWide: boolean
  factionId: string | null
  prerequisiteAchievementId: number | null
  nextAchievementId: number | null
  displayOrder: number | null
  rewardDescription: string | null
  rewardItemId: number | null
}

export type Criterion = {
  id: number
  description: string | null
  amount: number | null
  showProgressBar: boolean | null
  isGold: boolean | null
  operatorId: string | null
  factionId: string | null
  achievementId: number | null
  parentCriteriaId: number | null
}

export type CriterionWithProgress = Omit<Criterion, 'amount'> & {
  partialAmount: number
  totalAmount: number
  isCompleted: boolean
}

export type AchievementWithCriteria = Achievement & {
  criteria: Array<Criterion>
}

export type AchievementWithProgress = Achievement & {
  isCompleted: boolean
  progress: number
  completedTimestamp: number
  criteria: Array<CriterionWithProgress>
}

export type AchievementCategory = {
  id: number
  name: string
  isGuildCategory: boolean | null
  displayOrder: number | null
  parentCategoryId: number | null
  hordeQuantity: number | null
  hordePoints: number | null
  allianceQuantity: number | null
  alliancePoints: number | null
  achievements: Array<Achievement>
}

export type Realm = {
  name: string
  id: number
  slug: string
}

export type CharacterProps = {
  id: number
  name: string
  classId: number
  raceId: number
  faction: CharacterFaction
  gender: CharacterGender
  guild?: string
  realmSlug: string
  level: number
  covenantId?: number
  updatedAt?: string
  createdAt?: string
}

export type BattleNetUser = {
  region: BattleNetRegion
  battletag: string
  battlenetId: number
  accessToken: string
  expires: Date
}

export type JWToken = {
  name: string
  id: number
  battlenet: BattleNetUser
  iat: number
  exp: number
}

export type SessionProviders = {
  [provider: string]: SessionProvider
}

declare module 'next-auth' {
  export interface Session {
    battlenet: BattleNetUser
  }
}

declare global {
  interface Window {
    $WowheadPower: any
  }
}
