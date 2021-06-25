import { Boom } from '@hapi/boom'

type MutationFnParams = {
  url: string
  method: 'POST' | 'PUT' | 'DELETE'
  errorMessages?: { [code: number]: string }
}

export const createMutationFn = ({
  url,
  method,
  errorMessages = {},
}: MutationFnParams) => {
  return () =>
    fetch(url, {
      method,
    }).then((res) => {
      if (!res.ok) {
        const statusCode = res.status
        const message =
          (errorMessages && errorMessages[statusCode]) || res.statusText

        throw new Boom(message, { statusCode })
      }
      return res.json()
    })
}
