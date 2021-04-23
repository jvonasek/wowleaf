import create from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { pipe } from 'ramda'

const isServer = typeof window === 'undefined'

export const createStore = pipe(devtools, create)
export const createPersistedStore = isServer
  ? create
  : pipe(persist, devtools, create)
