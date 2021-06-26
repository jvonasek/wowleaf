import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { isBoom } from '@hapi/boom'

import { responseErrorMessage } from '@/lib/responseErrorMessage'
import requireAuthMiddleware from '@/middlewares/requireAuth'
import cors from '@/middlewares/cors'

type ApiHandlerOptions = {
  requireAuth?: boolean
}

export const apiHandler = ({ requireAuth = false }: ApiHandlerOptions = {}) => {
  return nc<NextApiRequest, NextApiResponse>({
    onError(err, _req, res) {
      if (isBoom(err)) {
        res.status(err.output.payload.statusCode).json(err.output.payload)
      } else {
        res.status(500).json(responseErrorMessage(500))
      }
    },
  })
    .use(cors())
    .use(requireAuthMiddleware(requireAuth))
}
