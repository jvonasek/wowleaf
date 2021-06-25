import { PrismaClient } from '../../../prisma/generated/app-client'

export * from '../../../prisma/generated/app-client'

interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma1: PrismaClient
}

declare const global: CustomNodeJsGlobal

const prisma =
  global.prisma1 ||
  new PrismaClient({
    log: ['info'],
  })

if (process.env.NODE_ENV === 'development') global.prisma1 = prisma

export default prisma
