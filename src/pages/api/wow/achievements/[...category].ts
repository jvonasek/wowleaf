import { create, string, object, array } from 'superstruct'
import { createPrismaHandler } from '@/lib/createPrismaHandler'
import prisma, { Achievement } from '@/prisma/wow'

const CategoryRouteStruct = object({
  category: array(string()),
})

const handle = createPrismaHandler<Achievement[]>({
  selector: async (req) => {
    const { category } = create(req.query, CategoryRouteStruct)
    return await prisma.achievement.findMany({
      where: {
        achievementCategory: {
          slug: category.join('/'),
        },
      },
      include: {
        criteria: true,
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
