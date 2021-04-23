import { NextApiHandler } from 'next'

import responseErrorMessage from '@/lib/responseErrorMessage'
import prisma from '@/prisma/wow'

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
