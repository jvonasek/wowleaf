import { coerce, create, number, string, object } from 'superstruct'

import { createPrismaHandler } from '@/lib/createPrismaHandler'
import prisma, { AchievementCategory } from '@/prisma/wow'

const CategoryRouteStruct = object({
  id: coerce(number(), string(), (value) => parseFloat(value)),
})

const handle = createPrismaHandler<AchievementCategory[]>({
  selector: async (req) => {
    const { id } = create(req.query, CategoryRouteStruct)
    return await prisma.achievementCategory.findMany({
      where: {
        parentCategoryId: id,
        isGuildCategory: false,
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
