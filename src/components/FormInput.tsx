import cx from 'classnames';
import { InputHTMLAttributes } from 'react';

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
        'block border-2 px-4 py-3 w-full rounded-lg bg-background border-transparent',
        'focus:border-accent-light focus:bg-surface focus:ring-0'
      )}
    />
  </>
)
