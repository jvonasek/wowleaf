import {
  isFuture,
  format as dateFormat,
  formatDistanceToNowStrict,
  isValid,
} from 'date-fns'

export type DateTimeProps = {
  date: Date
  format?: string
  relative?: boolean
}

export const DateTime: React.FC<DateTimeProps> = ({
  date,
  format = 'dd/MM/yyy HH:mm:ss',
  relative = false,
}) => {
  const d = new Date(date)
  if (isValid(d)) {
    const future = isFuture(d)
    const prefix = relative && future ? 'in ' : ''
    const suffix = relative && !future ? ' ago' : ''
    return (
      <>
        {prefix}
        {relative ? formatDistanceToNowStrict(d) : dateFormat(d, format)}
        {suffix}
      </>
    )
  }

  return null
}
