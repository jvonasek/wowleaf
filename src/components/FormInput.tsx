import cx from 'classnames'
import { InputHTMLAttributes } from 'react'

export type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string
  label?: string
  type?: string
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  type = 'text',
  ...rest
}) => (
  <>
    {label && <label htmlFor={name}>{label}</label>}
    <input
      id={name}
      type={type}
      {...rest}
      className={cx(
        'block border border-transparent px-4 py-3 w-full rounded-lg bg-secondary-2',
        'focus:ring-0 focus:bg-surface-1 focus:border-surface-2',
        'dark:focus:bg-secondary-3 dark:focus:border-secondary-1',
        'transition-colors'
      )}
    />
  </>
)
