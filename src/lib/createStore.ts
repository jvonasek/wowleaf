import { pipe } from 'ramda';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const isServer = typeof window === 'undefined'

export const createStore = pipe(devtools, create)
export const createPersistedStore = isServer
  ? create
  : pipe(persist, devtools, create)
