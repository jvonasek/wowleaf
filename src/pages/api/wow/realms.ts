import { NextApiHandler } from 'next'

import { prismaApiHandler } from '@/lib/prismaApiHandler'
import prisma, { Realm } from '@/prisma/wow'

const handle: NextApiHandler = async (req, res) =>
  prismaApiHandler<Realm[]>(req, res, {
    selector: async () =>
      await prisma.realm.findMany({
        orderBy: {
          name: 'asc',
        },
      }),
  })

export default handle
