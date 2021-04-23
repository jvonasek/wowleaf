import { createPrismaHandler } from '@/lib/createPrismaHandler'
import prisma, { Character } from '@/prisma/app'

const handle = createPrismaHandler<Character[]>({
  requireAuth: true,
  selector: async (req, res, token) =>
    await prisma.character.findMany({
      where: { userId: token.id },
    }),
})

export default handle
