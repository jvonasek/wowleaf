import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import { responseErrorMessage } from '@/lib/responseErrorMessage'
import requireAuthMiddleware from '@/middlewares/requireAuth'
import cors from '@/middlewares/cors'

type ApiHandlerOptions = {
  requireAuth?: boolean
}

export const apiHandler = ({ requireAuth = false }: ApiHandlerOptions = {}) => {
  return nc<NextApiRequest, NextApiResponse>({
    onError(_err, _req, res) {
      const statusCode = 500
      res.status(statusCode).json(responseErrorMessage(statusCode))
    },
  })
    .use(cors())
    .use(requireAuthMiddleware(requireAuth))
}
