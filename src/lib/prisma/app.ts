import { PrismaClient } from '../../../prisma/generated/app-client'

const prisma = new PrismaClient({
  log: ['info'],
})

export default prisma
