import { NextApiRequest, NextApiResponse } from 'next'

import { responseErrorMessage } from '@/lib/responseErrorMessage'

interface PrismaApiHandlerOptions<R> {
  selector: () => Promise<R>
  onSuccess?: (res: R) => any
}

export const prismaApiHandler = async <R>(
  req: NextApiRequest,
  res: NextApiResponse,
  { selector, onSuccess }: PrismaApiHandlerOptions<R>
): Promise<void> => {
  const data = await selector()

  if (data) {
    res.status(200).json(data)
    if (onSuccess) onSuccess(data)
  } else {
    res.status(404).json(responseErrorMessage(404))
  }
}
