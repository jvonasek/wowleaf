import { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'

import getJWT from '@/lib/getJWT'
import { responseErrorMessage } from '@/lib/responseErrorMessage'

const requireAuth = (enabled = true) => async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
): Promise<void> => {
  const token = await getJWT(req)

  if (enabled && !token) {
    res.status(401).json(responseErrorMessage(401))
    return
  }

  return next()
}

export default requireAuth
