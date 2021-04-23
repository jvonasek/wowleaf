import { createPrismaHandler } from '@/lib/createPrismaHandler'
import prisma, { AchievementCategory } from '@/prisma/wow'

const handle = createPrismaHandler<AchievementCategory[]>({
  selector: async () =>
    await prisma.achievementCategory.findMany({
      where: {
        parentCategoryId: null,
        isGuildCategory: false,
      },
      orderBy: [
        {
          displayOrder: 'asc',
        },
      ],
    }),
})

export default handle
