import cx from 'classnames'
import { clamp } from 'ramda'
import { memo, useEffect, useState } from 'react'

export type ProgressBarProps = {
  total?: number
  value: number
  formatter?: (n: number) => string
}

export const ProgressBar: React.FC<ProgressBarProps> = memo(
  ({ total = 100, value = 0, formatter }) => {
    const [percentage, setPercentage] = useState(0)

    useEffect(() => {
      setPercentage(Math.round(clamp(0, 100, (value * 100) / total)))
    }, [total, value])

    const current = clamp(0, total, value)
    const centerdLabelThreshold = percentage <= 20

    const label = formatter
      ? `${formatter(current)} / ${formatter(total)}`
      : `${current} / ${total}`

    return (
      <div className="bg-background rounded-full relative h-6">
        <div
          className="bg-accent flex justify-center items-center rounded-full h-6 transition-all"
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          style={{ width: `${percentage}%` }}
        >
          <span
            className={cx('text-sm font-bold whitespace-nowrap', {
              'text-on-accent': !centerdLabelThreshold,
              'text-on-background absolute left-1/2 transform -translate-x-1/2': centerdLabelThreshold,
            })}
          >
            {label}
          </span>
        </div>
      </div>
    )
  }
)
