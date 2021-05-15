import { createPrismaHandler } from '@/lib/createPrismaHandler'
import prisma, {
  AchievementCategory as AchievementCategoryBase,
} from '@/prisma/wow'

type AchievementCategoryType = Pick<
  AchievementCategoryBase,
  'id' | 'name' | 'slug'
>

type AchievementCategory = AchievementCategoryType & {
  otherAchievementCategories: AchievementCategoryType[]
}

const fields = {
  id: true,
  name: true,
  slug: true,
}

const handle = createPrismaHandler<AchievementCategory[]>({
  selector: async () =>
    await prisma.achievementCategory.findMany({
      where: {
        parentCategoryId: null,
        isGuildCategory: false,
      },
      select: {
        ...fields,
        otherAchievementCategories: {
          select: {
            ...fields,
          },
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
      orderBy: {
        displayOrder: 'asc',
      },
    }),
})

export default handle
