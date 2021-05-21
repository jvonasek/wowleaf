export const paginateArray = (array: any[], perPage: number, page: number) => {
  const start = (page - 1) * perPage
  const end = Math.min(page * perPage, array.length)
  return array.slice(start, end)
}
