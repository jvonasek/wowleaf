import { createPrismaHandler } from '@/lib/createPrismaHandler'
import prisma from '@/prisma/wow'

import { AchievementCategory } from '@/types'

const fields = {
  id: true,
  name: true,
  slug: true,
  allianceQuantity: true,
  hordeQuantity: true,
}

const handle = createPrismaHandler<AchievementCategory[]>({
  selector: async () =>
    await prisma.achievementCategory.findMany({
      where: {
        parentCategoryId: null,
        isGuildCategory: false,
      },
      select: {
        ...fields,
        otherAchievementCategories: {
          select: {
            ...fields,
          },
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
      orderBy: {
        displayOrder: 'asc',
      },
    }),
})

export default handle
