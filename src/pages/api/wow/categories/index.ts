import { NextApiHandler } from 'next'

import responseErrorMessage from '@/lib/responseErrorMessage'
import prisma from '@/prisma/wow'

const handle: NextApiHandler = async (req, res) => {
  const categories = await prisma.achievementCategory.findMany({
    where: {
      parentCategoryId: null,
      isGuildCategory: false,
    },
    orderBy: [
      {
        displayOrder: 'asc',
      },
    ],
  })

  if (categories) {
    res.status(200).json(categories)
  } else {
    res.status(404).json(responseErrorMessage(404))
  }
}

export default handle
