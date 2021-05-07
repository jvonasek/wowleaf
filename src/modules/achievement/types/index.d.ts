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
  byId: Record<string, Achievement>
  ids: number[]
}
