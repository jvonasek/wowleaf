import { Achievement, Criterion, AchievementAsset } from '@/prisma/wow'

export type Achievement = Achievement & {
  criteria: Criterion[]
  achievementAssets: AchievementAsset[]
}

export type AchievementCriterionProgress = {
  id: number
  total: number
  partial: number
  percent: number
  isCompleted: boolean
  showProgressBar: boolean
}

export type AchievementProgress = {
  id?: number
  completedTimestamp?: number
  criteria: Record<string, AchievementCriterionProgress>
  isCompleted: boolean
  percent: number
}
