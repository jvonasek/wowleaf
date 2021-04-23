import { NextApiHandler } from 'next'

import { prismaApiHandler } from '@/lib/prismaApiHandler'
import prisma, { AchievementCategory } from '@/prisma/wow'

const handle: NextApiHandler = async (req, res) =>
  prismaApiHandler<AchievementCategory[]>(req, res, {
    selector: async () =>
      await prisma.achievementCategory.findMany({
        where: {
          parentCategoryId: null,
          isGuildCategory: false,
        },
        orderBy: [
          {
            displayOrder: 'asc',
          },
        ],
      }),
  })

export default handle
