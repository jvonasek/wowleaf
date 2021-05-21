import cx from 'classnames';

export type ContainerProps = {
  children: React.ReactNode
  className?: string
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
}) => <div className={cx('container mx-auto', className)}>{children}</div>
