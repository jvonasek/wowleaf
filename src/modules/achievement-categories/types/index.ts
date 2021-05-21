import { AchievementCategory as BaseAchievementCategory } from '@/prisma/wow';

export type AchievementCategory = BaseAchievementCategory & {
  otherAchievementCategories: BaseAchievementCategory[]
}
