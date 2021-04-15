import { NextApiRequest } from 'next'
import jwt from 'next-auth/jwt'

import { JWToken } from '@/types/index'

const getJWT = async (req: NextApiRequest): Promise<JWToken> => {
  return await jwt.getToken({
    req,
    secret: process.env.JWT_SECRET,
  })
}

export default getJWT
