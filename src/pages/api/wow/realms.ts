import { NextApiHandler } from 'next'
import { PrismaClient } from '@/prisma/wow-client'

import responseErrorMessage from '@/lib/responseErrorMessage'

const prisma = new PrismaClient()

const handle: NextApiHandler = async (req, res) => {
  const realms = await prisma.realm.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  if (realms) {
    res.status(200).json(realms)
  } else {
    res.status(404).json(responseErrorMessage(404))
  }
}

export default handle
