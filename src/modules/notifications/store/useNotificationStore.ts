import { combine } from 'zustand/middleware'

import { createStore } from '@/lib/createStore'
import { randomId } from '@/lib/utils'

export type Notification = {
  id: string
  content: string
  autoDismissAfter?: number
  type: 'info' | 'success' | 'warning' | 'danger'
}

export type NotificationStore = {
  notifications: Notification[]
}

export type NotifyFn = (n: Omit<Notification, 'id'>) => void

export const useNotificationStore = createStore(
  combine(
    {
      notifications: [],
    } as NotificationStore,
    (set) => ({
      dismiss: (notificationId: string) => {
        set((state) => ({
          notifications: state.notifications.filter(
            ({ id }) => id !== notificationId
          ),
        }))
      },
      notify: (notification: Omit<Notification, 'id'>) => {
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: randomId(),
            },
          ],
        }))
      },
    })
  )
)
