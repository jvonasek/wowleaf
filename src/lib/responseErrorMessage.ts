import status from 'statuses'

export type ResponseErrorMessage = {
  error: boolean
  code: number
  message: string
}

export const responseErrorMessage = (code: number): ResponseErrorMessage => ({
  error: true,
  code,
  message: status(code),
})
