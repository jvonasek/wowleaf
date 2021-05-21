export const formatGold = (number: number): string => {
  const gold = Math.floor(number / 10000)
  const silver = Math.floor((number % 10000) / 100)
  const copper = Math.floor(number % 100)

  const money = [gold, silver, copper]
  const suffixes = ['g', 's', 'c']

  return money
    .map((m, i) => {
      if (m > 0) {
        return Intl.NumberFormat().format(m) + suffixes[i]
      }
      return null
    })
    .filter((m) => m)
    .join('\u00a0')
}
