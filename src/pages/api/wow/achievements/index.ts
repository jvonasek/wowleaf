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
      take: 200,
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
