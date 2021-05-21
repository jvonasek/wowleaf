import { BattleNetRegion, BattleNetResponse } from 'battlenet-api'
import { SessionProvider } from 'next-auth/client'

import { Character as UserCharacter } from '@/lib/prisma/app'
import { Criterion as BaseCriterion } from '@/lib/prisma/wow'
import { Achievement } from '@/modules/achievement/types'

export { BattleNetRegion, BattleNetResponse, Criterion, Achievement }

export interface GenericObject {
  [key: string]: any
}

export type Faction = 'ALLIANCE' | 'HORDE'
export type Gender = 'MALE' | 'FEMALE'

export type Character = UserCharacter & {
  region: BattleNetRegion
  faction: Faction
  gender: Gender
}

export type Criterion = BaseCriterion & {
  linkedAchievement: Achievement
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
