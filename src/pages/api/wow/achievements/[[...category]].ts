import { createPrismaHandler } from '@/lib/createPrismaHandler'
import { AchCategoryApiRouteStruct } from '@/lib/structs'
import { Achievement } from '@/modules/achievement/types'
import prisma, { createFactionSelector } from '@/prisma/wow'

type PlainAchievement = Pick<
  Achievement,
  | 'id'
  | 'criteriaOperator'
  | 'requiredCriteriaAmount'
  | 'isAccountWide'
  | 'rewardDescription'
  | 'points'
>

type AchievementResult = Achievement | PlainAchievement

const handle = createPrismaHandler<AchievementResult[]>({
  selector: async (req) => {
    const { category, factionId, id } = AchCategoryApiRouteStruct.create(
      req.query
    )
    const faction = createFactionSelector(factionId)

    const ids = id && id.length ? id.map(parseFloat) : []

    const slug = category.join('/')
    const where = slug
      ? {
          ...faction,
          achievementCategory: {
            slug: {
              startsWith: slug,
            },
            isGuildCategory: false,
          },
        }
      : {
          ...faction,
          achievementCategory: {
            isGuildCategory: false,
          },
        }

    const isRegular = ids.length || category.length

    const plain = {
      id: true,
      criteriaOperator: true,
      requiredCriteriaAmount: true,
      isAccountWide: true,
      rewardDescription: true,
      points: true,
      criteria: {
        where: faction,
        select: {
          id: true,
          amount: true,
          showProgressBar: true,
          factionId: true,
        },
      },
    }

    const regular = {
      id: true,
      categoryId: true,
      name: true,
      description: true,
      points: true,
      isAccountWide: true,
      factionId: true,
      rewardDescription: true,
      rewardItemId: true,
      requiredCriteriaAmount: true,
      criteriaOperator: true,
      achievementAssets: true,
      expansionId: true,
      criteria: {
        where: faction,
        include: {
          linkedAchievement: {
            select: {
              id: true,
              name: true,
              achievementAssets: true,
              criteria: true,
            },
          },
        },
      },
    }

    return await prisma.achievement.findMany({
      where: {
        ...where,
        id: ids.length ? { in: ids } : undefined,
      },
      select: isRegular ? regular : plain,
      orderBy: [
        {
          id: 'desc',
        },
      ],
    })
  },
})
export default handle
