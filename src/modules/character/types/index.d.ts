import { BattleNetRegion } from '@/types'

export type CharacterParams = {
  region: BattleNetRegion
  realm: string
  name: string
}

export type CharacterAchievement = {
  id: number
  isCompleted: boolean
  completedTimestamp: number
  criteria: CharacterAchievementCriteria
}

export type CharacterAchievementCriteria = {
  amount: number
  childCriteria?: CharacterAchievementCriteria[]
  id: number
  isCompleted: boolean
}

export type CharacterAchievementsRecord = Record<string, CharacterAchievement>
