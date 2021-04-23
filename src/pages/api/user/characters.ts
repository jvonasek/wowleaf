import requireAuth, { NextApiHandlerWithJWT } from '@/middlewares/requireAuth'
import prisma from '@/prisma/app'

import responseErrorMessage from '@/lib/responseErrorMessage'

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
