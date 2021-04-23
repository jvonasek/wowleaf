import { createPrismaHandler } from '@/lib/createPrismaHandler'
import prisma, { Realm } from '@/prisma/wow'

const handle = createPrismaHandler<Realm[]>({
  selector: async () =>
    await prisma.realm.findMany({
      orderBy: {
        name: 'asc',
      },
    }),
})

export default handle
