import { PrismaClient } from '../../../prisma/generated/wow-client'

const prisma = new PrismaClient({
  log: ['info'],
})

export default prisma
