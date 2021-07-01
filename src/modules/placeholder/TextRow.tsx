import cx from 'classnames'

export type TextRowProps = {
  className?: string
  lineSpacing?: number
  width?: string | number
}

export const TextRow: React.FC<TextRowProps> = ({
  className,
  width = '100%',
  lineSpacing = 0.42857,
}) => {
  const styles = {
    width,
    height: '1em',
    marginTop: `${lineSpacing / 2}em`,
    marginBottom: `${lineSpacing / 2}em`,
  }

  return (
    <div
      className={cx(className, 'h-[1em] bg-surface-2 rounded')}
      style={styles}
    />
  )
}
