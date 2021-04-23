import requireAuth, { NextApiHandlerWithJWT } from '@/middlewares/requireAuth'

import { prismaApiHandler } from '@/lib/prismaApiHandler'
import prisma, { Character } from '@/prisma/app'

const handle: NextApiHandlerWithJWT = async (req, res, token) =>
  prismaApiHandler<Character[]>(req, res, {
    selector: async () =>
      await prisma.character.findMany({
        where: { userId: token.id },
      }),
  })

export default requireAuth(handle)
