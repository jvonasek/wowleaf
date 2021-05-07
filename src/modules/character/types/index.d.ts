import { BattleNetRegion } from '@/types'

export type CharacterParams = {
  region: BattleNetRegion
  realm: string
  name: string
  characterKey: string
}

export type CharacterAchievement = {
  id: number
  isCompleted: boolean
  completedTimestamp: number
  criteria: CharacterAchievementCriterion
}

export type CharacterAchievementCriterion = {
  amount: number
  childCriteria?: CharacterAchievementCriterion[]
  id: number
  isCompleted: boolean
}

export type CharacterAchievementsRecord = Record<string, CharacterAchievement>

export type CharacterAchievementsQueryResult = {
  byId: CharacterAchievementsRecord
  ids: number[]
}

export type CharacterAchievementCriterionProgress = {
  id: number
  partial: number
  required: number
  percent: number
  isCompleted: boolean
  showProgressBar: boolean
}

export type CharacterAchievementProgress = {
  id: number
  name: string
  percent: number
  partial: number
  required: number
  criteria: Record<string, AchievementCriterionProgress>
  completedTimestamp?: number
  isCompleted: boolean
  showOverallProgressBar: boolean
}
