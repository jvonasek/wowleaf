import { NextApiHandler } from 'next'

import responseErrorMessage from '@/lib/responseErrorMessage'
import prisma from '@/prisma/wow'

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
