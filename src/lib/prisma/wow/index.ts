import { PrismaClient } from '../../../../prisma/generated/wow-client';

export * from '../../../../prisma/generated/wow-client'
export * from './selectors'

interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma2: PrismaClient
}

declare const global: CustomNodeJsGlobal

const prisma =
  global.prisma2 ||
  new PrismaClient({
    log: ['info'],
  })

if (process.env.NODE_ENV === 'development') global.prisma2 = prisma

export default prisma
