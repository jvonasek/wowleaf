import { SessionProvider } from 'next-auth/client'
import { BattleNetRegion } from 'battlenet-api'

export interface GenericObject {
  [key: string]: any
}

export type CharacterFaction = 'ALLIANCE' | 'HORDE'
export type CharacterGender = 'MALE' | 'FEMALE'
export type CharacterRace = string
export type CharacterClass = string

export type CharacterProps = {
  id: number
  name: string
  realmId: number
  realmSlug: string
  level: number
  faction: CharacterFaction
  gender: CharacterGender
  playableClass: CharacterClass
  playableRace: CharacterRace
}

export type BattleNetUser = {
  region: BattleNetRegion
  battletag: string
  battlenetId: number
  accessToken: string
  expires: Date
}

export type JWToken = {
  name: string
  id: number
  battlenet: BattleNetUser
  iat: number
  exp: number
}

export type SessionProviders = {
  [provider: string]: SessionProvider
}

declare module 'next-auth' {
  export interface Session {
    battlenet: BattleNetUser
  }
}
