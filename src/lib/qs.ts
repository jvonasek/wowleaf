export const qs = (
  data: Record<string, any>,
  { preppendPrefix = true } = {}
): string => {
  if (!data) {
    return ''
  }

  const params = new URLSearchParams()

  Object.keys(data).map((key) => {
    const value = data[key]

    if (typeof value === 'undefined') {
      return
    }

    if (Array.isArray(value)) {
      value.map((item) => params.append(key, item))
    } else {
      params.append(key, value)
    }
  })

  const querystring = params.toString()

  return preppendPrefix ? `?${querystring}` : querystring
}
