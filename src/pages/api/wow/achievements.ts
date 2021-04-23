import { NextApiHandler } from 'next'
import { PrismaClient } from '@/prisma/wow-client'

import responseErrorMessage from '@/lib/responseErrorMessage'

const prisma = new PrismaClient()

const handle: NextApiHandler = async (req, res) => {
  const achievements = await prisma.achievement.findMany({
    where: {
      rewardDescription: {
        not: null,
      },
    },
    include: {
      criteria: true,
      achievementAssets: true,
    },
    orderBy: [
      {
        id: 'desc',
      },
    ],
  })

  if (achievements) {
    res.status(200).json(achievements)
  } else {
    res.status(404).json(responseErrorMessage(404))
  }
}

export default handle
