import { Achievement as BaseAchievement, AchievementAsset } from '@/prisma/wow'

import { Criterion } from '@/types'

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
