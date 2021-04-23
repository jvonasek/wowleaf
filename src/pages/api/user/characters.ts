import requireAuth, { NextApiHandlerWithJWT } from '@/middlewares/requireAuth'
import { PrismaClient } from '@/prisma/app-client'

import responseErrorMessage from '@/lib/responseErrorMessage'

const prisma = new PrismaClient()

const handle: NextApiHandlerWithJWT = async (req, res, token) => {
  const characters = await prisma.character.findMany({
    where: { userId: token.id },
  })

  if (characters) {
    res.status(200).json(characters)
  } else {
    res.status(404).json(responseErrorMessage(404))
  }
}

export default requireAuth(handle)
