import classnames from 'classnames';

type ClassNames = {
  [key: string]: boolean | string
}

const composeClasses = (
  classNames: ClassNames,
  ...rest: Array<string>
): string => {
  const keys = Object.keys(classNames)
  const classObject = keys.reduce((prev, key) => {
    const className =
      typeof classNames[key] === 'boolean' ? key : classNames[key]
    const value = classNames[key]
    return {
      ...prev,
      [String(className)]: Boolean(value),
    }
  }, {})

  return classnames(classObject, ...rest)
}

export default composeClasses
