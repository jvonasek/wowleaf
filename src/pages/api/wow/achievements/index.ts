import { createPrismaHandler } from '@/lib/createPrismaHandler'
import prisma, { Achievement } from '@/prisma/wow'

const handle = createPrismaHandler<Achievement[]>({
  selector: async () =>
    await prisma.achievement.findMany({
      /* where: {
        rewardDescription: {
          not: null,
        },
      }, */
      /* where: {
        id: {
          in: [14868, 14498],
        },
      }, */
      take: 323,
      include: {
        criteria: true,
        achievementAssets: true,
      },
      orderBy: [
        {
          id: 'desc',
        },
      ],
    }),
})
export default handle
