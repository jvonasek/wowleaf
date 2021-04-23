import { BattleNetRegion } from '@/types'

export const BNET_REGIONS: Array<BattleNetRegion> = ['us', 'eu', 'kr', 'tw']

export const BNET_REGIONS_MAP = {
  Europe: 'eu',
  'North America': 'us',
}

export const CRITERIA_OPERATOR_MAP = {
  0: 'SINGLE',
  1: 'NONE',
  2: 'NONE',
  3: 'NONE',
  4: 'ALL',
  5: 'SUM_CHILDREN',
  6: 'MAX_CHILD',
  7: 'COUNT_DIRECT_CHILDREN',
  8: 'ANY',
  9: 'SUM_CHILDREN_WEIGHT',
}
