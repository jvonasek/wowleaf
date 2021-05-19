import { create } from 'superstruct'
import { createPrismaHandler } from '@/lib/createPrismaHandler'
import prisma, { createFactionSelector, Achievement } from '@/prisma/wow'

import { AchCategoryApiRouteStruct } from '@/lib/structs'

const handle = createPrismaHandler<Achievement[]>({
  selector: async (req) => {
    const { category, factionId } = create(req.query, AchCategoryApiRouteStruct)
    const faction = createFactionSelector(factionId)
    return await prisma.achievement.findMany({
      where: {
        /* id: {
          in: [14330, 10581, 11177, 8348, 4896, 7520, 41],
        }, */
        ...faction,
        achievementCategory: {
          slug: category.join('/'),
        },
      },
      include: {
        criteria: {
          where: faction,
        },
        achievementAssets: true,
      },
      orderBy: [
        {
          displayOrder: 'desc',
        },
      ],
    })
  },
})
export default handle
