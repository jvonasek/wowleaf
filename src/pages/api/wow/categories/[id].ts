import { NextApiHandler } from 'next'
import { coerce, create, number, string, object } from 'superstruct'

import responseErrorMessage from '@/lib/responseErrorMessage'
import prisma from '@/prisma/wow'

const CategoryRouteStruct = object({
  id: coerce(number(), string(), (value) => parseFloat(value)),
})

const handle: NextApiHandler = async (req, res) => {
  const { id } = create(req.query, CategoryRouteStruct)
  const categories = await prisma.achievementCategory.findMany({
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

  if (categories) {
    res.status(200).json(categories)
  } else {
    res.status(404).json(responseErrorMessage(404))
  }
}

export default handle
