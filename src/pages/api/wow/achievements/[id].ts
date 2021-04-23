import { coerce, create, number, string, object } from 'superstruct'

import { createPrismaHandler } from '@/lib/createPrismaHandler'
import prisma, { Achievement } from '@/prisma/wow'

const AchievementByIdRouteStruct = object({
  id: coerce(number(), string(), (value) => parseFloat(value)),
})

const handle = createPrismaHandler<Achievement>({
  selector: async (req) => {
    const { id } = create(req.query, AchievementByIdRouteStruct)
    return await prisma.achievement.findUnique({
      where: {
        id,
      },
      include: {
        criteria: true,
        achievementAssets: true,
      },
    })
  },
})

export default handle
