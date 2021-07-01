import ReactPlaceholder from 'react-placeholder'

import { PlaceholderContainer } from './PlaceholderContainer'
import { RectShape } from './RectShape'
import { TextRow } from './TextRow'
import { PlaceholderProps } from './types'

export type CategoryLinkPlaceholderProps = PlaceholderProps & {
  count?: number
}

const Placeholder = ({ count = 1 }) => {
  return (
    <PlaceholderContainer count={count}>
      {({ animateClassName }) => (
        <div className={`flex items-center ${animateClassName}`}>
          <div className="mr-5">
            <RectShape className="w-12 h-12" />
          </div>
          <TextRow />
        </div>
      )}
    </PlaceholderContainer>
  )
}

export const CategoryLinkPlaceholder: React.FC<CategoryLinkPlaceholderProps> =
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
