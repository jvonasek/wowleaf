import { BattleNetRegion } from '@/types'

export const MAX_ALLOWED_CHARACTERS = 10

export const BNET_REGIONS: Array<BattleNetRegion> = ['us', 'eu', 'kr', 'tw']

export const EXPANSION_MAP = {
  3: 'WOTLK',
  4: 'CATA',
  5: 'MOP',
  6: 'WOD',
  7: 'LEGION',
  8: 'BFA',
  9: 'SL',
}

export const CHARACTER_CLASS_MAP = {
  1: 'Warrior',
  2: 'Paladin',
  3: 'Hunter',
  4: 'Rogue',
  5: 'Priest',
  6: 'Death Knight',
  7: 'Shaman',
  8: 'Mage',
  9: 'Warlock',
  10: 'Monk',
  11: 'Druid',
  12: 'Demon Hunter',
}

export const CHARACTER_RACE_MAP = {
  1: 'Human',
  2: 'Orc',
  3: 'Dwarf',
  4: 'Night Elf',
  5: 'Undead',
  6: 'Tauren',
  7: 'Gnome',
  8: 'Troll',
  9: 'Goblin',
  10: 'Blood Elf',
  11: 'Draenei',
  22: 'Worgen',
  24: 'Pandaren',
  25: 'Pandaren',
  26: 'Pandaren',
  27: 'Nightborne',
  28: 'Highmountain Tauren',
  29: 'Void Elf',
  30: 'Lightforged Draenei',
  31: 'Zandalari Troll',
  32: 'Kul Tiran',
  34: 'Dark Iron Dwarf',
  35: 'Vulpera',
  36: "Mag'har Orc",
  37: 'Mechagnome',
}

export enum Faction {
  Alliance = 'ALLIANCE',
  Horde = 'HORDE',
}
