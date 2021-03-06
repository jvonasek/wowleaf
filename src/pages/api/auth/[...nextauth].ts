import { BattleNetRegion } from 'battlenet-api'
import { add } from 'date-fns'
import { NextApiHandler } from 'next'
import NextAuth from 'next-auth'
import Adapters from 'next-auth/adapters'

import prisma from '@/prisma/app'
import { RedisCacheService } from '@/services/RedisCacheService'
import { JWToken } from '@/types'

const BNET_TOKEN_EXPIRY = { hours: 24 }

const getNameFromProfile = (profile: any) =>
  profile?.battletag?.split?.('#')[0] ?? ''

const getRegionFromProvider = (provider: string): string => {
  const defaultRegion = 'eu'
  if (provider.includes('battlenet')) {
    return provider.split?.('-')[1] ?? defaultRegion
  }

  return defaultRegion
}

const options = {
  adapter: Adapters.Prisma.Adapter({ prisma }),
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
}

const createBattleNetProvider = (region: BattleNetRegion): any => ({
  id: `battlenet-${region}`,
  name: `Battle.Net ${region.toUpperCase()}`,
  type: 'oauth',
  version: '2.0',
  scope: 'wow.profile',
  params: { grant_type: 'authorization_code' },
  accessTokenUrl: `https://${region}.battle.net/oauth/token`,
  authorizationUrl: `https://${region}.battle.net/oauth/authorize?response_type=code`,
  profileUrl: `https://${region}.battle.net/oauth/userinfo`,
  clientId: process.env.BNET_CLIENT_ID,
  clientSecret: process.env.BNET_CLIENT_SECRET,
  profile: (profile: any) => {
    return {
      id: profile.id,
      name: profile.battletag,
      email: null,
      image: null,
    }
  },
})

const handle: NextApiHandler = (req, res) => {
  return NextAuth(req, res, {
    ...options,
    callbacks: {
      session: async (session: any, user: any) => {
        if (user) {
          session.user.id = user?.id
          session.battlenet = {
            region: user?.battlenet?.region,
            battletag: user?.battlenet?.battletag,
            battlenetId: user?.battlenet?.battlenetId,
            expires: user?.battlenet?.expires,
          }
        }
        return await Promise.resolve(session)
      },
      jwt: async (
        token: any,
        user: any,
        account: any,
        profile: any
      ): Promise<JWToken> => {
        const now = new Date()
        const isSignIn = Boolean(user)
        if (isSignIn) {
          const cache = new RedisCacheService()
          cache.delete(`user:${user?.id}:*`)

          token.name = getNameFromProfile(profile)
          token.id = user?.id
          token.battlenet = {
            region: getRegionFromProvider(account.provider),
            battletag: profile?.battletag,
            battlenetId: profile?.id,
            accessToken: account?.accessToken,
            expires: add(now, BNET_TOKEN_EXPIRY),
          }
        }

        return await Promise.resolve(token)
      },
    },
    providers: [createBattleNetProvider('us'), createBattleNetProvider('eu')],
  })
}

export default handle
