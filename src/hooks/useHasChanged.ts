import { usePrevious } from './usePrevious';

export const useHasChanged = <T extends unknown>(val: T): boolean => {
  const prevVal = usePrevious(val)
  return prevVal !== val
}
