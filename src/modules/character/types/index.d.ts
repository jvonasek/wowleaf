import { LocalizedCharacterMedia } from 'battlenet-api'

import { BattleNetRegion } from '@/types'

export type { CharacterMediaTypes } from 'battlenet-api'

export type CharacterMediaAssets = LocalizedCharacterMedia['assets']

export type CharacterParams = {
  region: BattleNetRegion
  realmSlug: string
  name: string
}

export type CharacterAchievement = {
  id: number
  isCompleted: boolean
  completedTimestamp: number
  criteria: CharacterAchievementCriterion
}

export type CharacterCategory = {
  id: number
  points: number
  quantity: number
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
  percent: number
  partial: number
  required: number
  criteria: Record<string, CharacterAchievementCriterionProgress>
  completedTimestamp?: number
  isCompleted: boolean
  showOverallProgressBar: boolean
  characterKey?: string
}

export type AchievementFilterProps = {
  incomplete: boolean
  reward: boolean
  includeAccountWide: boolean
  points: number
}
