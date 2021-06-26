import { combine } from 'zustand/middleware'

import { createStore } from '@/lib/createStore'
import { randomId } from '@/lib/utils'

export type Notification = {
  id: string
  content: string
  visible: boolean
  autoDismissAfter?: number
  type: 'info' | 'success' | 'warning' | 'danger'
}

export type NotificationStore = {
  notifications: Notification[]
}

export type NotificationProps = Omit<Notification, 'id' | 'visible'>
export type NotifyFn = (n: NotificationProps) => void

export const useNotificationStore = createStore(
  combine(
    {
      notifications: [],
    } as NotificationStore,
    (set) => ({
      dismiss: (notificationId: string) => {
        set((state) => ({
          notifications: state.notifications.map((notification) => {
            if (notification.id === notificationId) {
              return {
                ...notification,
                visible: false,
              }
            }

            return notification
          }),
        }))
      },
      notify: (notification: NotificationProps) => {
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: randomId(),
              visible: true,
            },
          ],
        }))
      },
    })
  )
)
