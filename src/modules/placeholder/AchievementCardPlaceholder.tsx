import ReactPlaceholder from 'react-placeholder'

import { Card } from '@/components/Card'

import { PlaceholderContainer } from './PlaceholderContainer'
import { RectShape } from './RectShape'
import { TextRow } from './TextRow'
import { PlaceholderProps } from './types'

export type AchievementCardPlaceholderProps = PlaceholderProps & {
  count?: number
}

const Placeholder = ({ count = 1 }) => {
  return (
    <PlaceholderContainer count={count}>
      {({ animateClassName }) => (
        <Card>
          <div
            className={`grid grid-cols-12 gap-4 items-center ${animateClassName}`}
          >
            <div className="col-span-7 flex items-center space-x-5">
              <div>
                <RectShape />
              </div>
              <div className="w-full">
                <TextRow className="max-w-xs" />
                <TextRow />
              </div>
            </div>
            <div className="col-span-5 justify-self-end">
              <RectShape className="w-12 h-12" />
            </div>
          </div>
        </Card>
      )}
    </PlaceholderContainer>
  )
}

export const AchievementCardPlaceholder: React.FC<AchievementCardPlaceholderProps> =
  ({ ready, children, count = 1 }) => {
    return (
      <ReactPlaceholder
        ready={ready}
        customPlaceholder={<Placeholder count={count} />}
      >
        {children}
      </ReactPlaceholder>
    )
  }
