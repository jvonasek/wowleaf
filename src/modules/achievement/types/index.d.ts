import {
  Achievement as BaseAchievement,
  Criterion,
  AchievementAsset,
} from '@/prisma/wow'

export type Achievement = BaseAchievement & {
  criteria: Criterion[]
  achievementAssets: AchievementAsset[]
}

export type AchievementsQueryResult = {
  isLoading: boolean
  isSuccess: boolean
  byId: Record<string, Achievement>
  ids: number[]
}
