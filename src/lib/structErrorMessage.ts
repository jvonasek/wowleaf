import { Struct, define, is } from 'superstruct'

export const structErrorMessage = <T>(
  struct: Struct<T, any>,
  message: string
): Struct<T, any> =>
  define('message', (value) => (is(value, struct) ? true : message))
