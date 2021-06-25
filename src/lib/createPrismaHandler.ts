import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import getJWT from '@/lib/getJWT'
import { responseErrorMessage } from '@/lib/responseErrorMessage'
import { JWToken } from '@/types'
import { apiHandler } from '@/lib/apiHandler'

type PrismaApiHandlerOptions<R> = {
  selector: (
    req: NextApiRequest,
    res: NextApiResponse,
    token?: JWToken
  ) => Promise<R>
  onSuccess?: (res: R) => any
  requireAuth?: boolean
}

export function createPrismaHandler<R>({
  selector,
  onSuccess,
  requireAuth = false,
}: PrismaApiHandlerOptions<R>): NextApiHandler {
  return apiHandler({ requireAuth }).get(async (req, res) => {
    const token = await getJWT(req)
    const data = await selector(req, res, token)

    if (data) {
      res.status(200).json(data)
      if (onSuccess) onSuccess(data)
    } else {
      res.status(404).json(responseErrorMessage(404))
    }
  })
}
