import {
  format as dateFormat,
  formatDistanceToNowStrict,
  isValid,
} from 'date-fns'

export type DateTimeProps = {
  date: Date | string
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
    return (
      <>
        {relative
          ? formatDistanceToNowStrict(d, { addSuffix: true })
          : dateFormat(d, format)}
      </>
    )
  }

  return null
}
