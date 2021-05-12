import { create, string, object, array } from 'superstruct'

import { createPrismaHandler } from '@/lib/createPrismaHandler'
import prisma from '@/prisma/wow'
import { AchievementCategory } from '@/modules/achievement-categories/types'

const CategoryRouteStruct = object({
  category: array(string()),
})

const handle = createPrismaHandler<AchievementCategory>({
  selector: async (req) => {
    const { category } = create(req.query, CategoryRouteStruct)
    return await prisma.achievementCategory.findFirst({
      where: {
        slug: category.join('/'),
        isGuildCategory: false,
      },
      include: {
        otherAchievementCategories: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
      orderBy: [
        {
          displayOrder: 'asc',
        },
      ],
    })
  },
})

export default handle
