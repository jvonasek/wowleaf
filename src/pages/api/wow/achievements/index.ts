import { create } from 'superstruct'
import { createPrismaHandler } from '@/lib/createPrismaHandler'
import prisma, { createFactionSelector, Achievement } from '@/prisma/wow'

import { AchIndexApiRouteStruct } from '@/lib/structs'

const handle = createPrismaHandler<Achievement[]>({
  selector: async (req) => {
    const { factionId } = create(req.query, AchIndexApiRouteStruct)
    const faction = createFactionSelector(factionId)
    return await prisma.achievement.findMany({
      where: faction,
      include: {
        criteria: {
          where: faction,
        },
        achievementAssets: true,
      },
      orderBy: [
        {
          id: 'asc',
        },
      ],
    })
  },
})
export default handle

// minimum required for progress, 80kb
/* select: {
  id: true,
  criteria: {
    select: {
      id: true,
      amount: true,
      showProgressBar: true,
    },
  },
  criteriaOperator: true,
  requiredCriteriaAmount: true,
}, */
