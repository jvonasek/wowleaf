export type RectShapeProps = {
  className?: string
}

export const RectShape: React.FC<RectShapeProps> = ({
  className = 'w-16 h-16',
}) => (
  <div className={className}>
    <div className="w-full h-full bg-surface-2 rounded-xl"></div>
  </div>
)
