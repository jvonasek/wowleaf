import { create } from 'superstruct'

import { createPrismaHandler } from '@/lib/createPrismaHandler'
import { AchCategoryApiRouteStruct } from '@/lib/structs'
import { Achievement } from '@/modules/achievement/types'
import prisma, { createFactionSelector } from '@/prisma/wow'

type AchievementResult =
  | Achievement
  | Pick<
      Achievement,
      | 'id'
      | 'criteriaOperator'
      | 'requiredCriteriaAmount'
      | 'isAccountWide'
      | 'rewardDescription'
      | 'points'
      | 'criteria'
    >

const handle = createPrismaHandler<AchievementResult[]>({
  selector: async (req) => {
    const { category, factionId, id } = create(
      req.query,
      AchCategoryApiRouteStruct
    )
    const faction = createFactionSelector(factionId)

    const ids = id && id.length ? id.map(parseFloat) : []

    const slug = category.join('/')
    const where = slug
      ? {
          ...faction,
          achievementCategory: {
            slug,
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
