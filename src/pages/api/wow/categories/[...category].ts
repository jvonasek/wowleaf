import { array, create, object, string } from 'superstruct';

import { createPrismaHandler } from '@/lib/createPrismaHandler';
import { AchievementCategory } from '@/modules/achievement-categories/types';
import prisma from '@/prisma/wow';

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
