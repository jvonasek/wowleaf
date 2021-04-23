import { NextApiHandler } from 'next'
import { coerce, create, number, string, object } from 'superstruct'

import { prismaApiHandler } from '@/lib/prismaApiHandler'
import prisma, { AchievementCategory } from '@/prisma/wow'

const CategoryRouteStruct = object({
  id: coerce(number(), string(), (value) => parseFloat(value)),
})

const handle: NextApiHandler = async (req, res) => {
  const { id } = create(req.query, CategoryRouteStruct)
  return prismaApiHandler<AchievementCategory[]>(req, res, {
    selector: async () =>
      await prisma.achievementCategory.findMany({
        where: {
          parentCategoryId: id,
          isGuildCategory: false,
        },
        orderBy: [
          {
            displayOrder: 'asc',
          },
        ],
      }),
  })
}

export default handle
