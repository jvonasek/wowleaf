import { NextApiRequest, NextApiResponse } from 'next'

import getJWT from '@/lib/getJWT'
import { responseErrorMessage } from '@/lib/responseErrorMessage'

import { JWToken } from '@/types'

export type NextApiHandlerWithJWT<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
  token: JWToken
) => void | Promise<void>

const requireAuth = (next: NextApiHandlerWithJWT) => async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const token = await getJWT(req)

  if (!token) {
    res.status(401).json(responseErrorMessage(401))
    return
  }

  return next(req, res, token)
}

export default requireAuth
