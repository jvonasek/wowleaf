export type PlaceholderContainerProps = {
  children({ animateClassName }: { animateClassName: string }): React.ReactNode
  count?: number
  animate?: boolean
}

const ANIMATION_NAME = 'animate-pulse-subtle'

export const PlaceholderContainer: React.FC<PlaceholderContainerProps> = ({
  children,
  count = 1,
  animate = true,
}) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i}>
          {children({
            animateClassName: animate ? ANIMATION_NAME : '',
          })}
        </div>
      ))}
    </>
  )
}
