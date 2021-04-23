import { NextApiHandler } from 'next'

import { prismaApiHandler } from '@/lib/prismaApiHandler'
import prisma, { Achievement } from '@/prisma/wow'

const handle: NextApiHandler = async (req, res) =>
  prismaApiHandler<Achievement[]>(req, res, {
    selector: async () =>
      await prisma.achievement.findMany({
        /* where: {
          rewardDescription: {
            not: null,
          },
        }, */
        include: {
          criteria: true,
          achievementAssets: true,
        },
        orderBy: [
          {
            id: 'desc',
          },
        ],
      }),
  })

export default handle
