import cx from 'classnames'
import { Fragment, OptionHTMLAttributes, SelectHTMLAttributes } from 'react'

type SelectOption = OptionHTMLAttributes<HTMLOptionElement> & {
  label: string
  value?: number | string
  options?: SelectOption[]
}

export type FormSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  name: string
  label?: string
  options?: Array<SelectOption>
}

const FormSelectOption: React.FC<OptionHTMLAttributes<HTMLOptionElement>> = ({
  value,
  label,
  ...rest
}) => (
  <option value={value} {...rest}>
    {label}
  </option>
)

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  options = [],
  ...rest
}) => {
  return (
    <>
      {label && <label htmlFor={name}>{label}</label>}
      <select
        id={name}
        {...rest}
        className={cx(
          'block border border-transparent px-4 py-3 w-full rounded-lg bg-secondary-2',
          'focus:ring-0 focus:bg-surface-1 focus:border-surface-2',
          'dark:focus:bg-secondary-3 dark:focus:border-secondary-1',
          'transition-colors'
        )}
      >
        {options.map(({ options, ...rest }) => (
          <Fragment key={rest.label}>
            {options ? (
              <optgroup label={rest.label}>
                {options.map((option) => (
                  <FormSelectOption key={option.value} {...option} />
                ))}
              </optgroup>
            ) : (
              <FormSelectOption key={rest.value} {...rest} />
            )}
          </Fragment>
        ))}
      </select>
    </>
  )
}
