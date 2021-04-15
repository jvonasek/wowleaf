import requireAuth, { NextApiHandlerWithJWT } from 'middlewares/requireAuth'
import { PrismaClient } from '@prisma/client'

import responseErrorMessage from '@/lib/responseErrorMessage'

const prisma = new PrismaClient()

const handle: NextApiHandlerWithJWT = async (req, res, token) => {
  const achievements = await prisma.achievement.findMany()

  if (achievements) {
    res.status(200).json(achievements)
  } else {
    res.status(404).json(responseErrorMessage(404))
  }
}

export default requireAuth(handle)
