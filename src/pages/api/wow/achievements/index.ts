import { createPrismaHandler } from '@/lib/createPrismaHandler'
import prisma, { Achievement } from '@/prisma/wow'

const handle = createPrismaHandler<Achievement[]>({
  selector: async () => {
    return await prisma.achievement.findMany({
      include: {
        criteria: true,
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
