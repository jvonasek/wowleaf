import { Fragment, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { usePopperTooltip } from 'react-popper-tooltip'

export type TooltipProps = {
  children: ReactNode
  overlay: string | ReactNode
  interactive?: boolean
  followCursor?: boolean
  placement?:
    | 'auto'
    | 'auto-start'
    | 'auto-end'
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'left'
    | 'left-start'
    | 'left-end'
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  overlay,
  interactive = false,
  followCursor = false,
  placement = 'auto',
}) => {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    placement,
    interactive,
    followCursor,

    delayHide: interactive ? 100 : 0,
  })

  return (
    <>
      <div className="inline" ref={setTriggerRef}>
        {children}
      </div>
      {visible &&
        true &&
        createPortal(
          <div
            ref={setTooltipRef}
            {...getTooltipProps({
              className:
                'tooltip-container shadow-lg max-w-xs px-5 py-4 text-sm bg-tertiary-2 text-on-tertiary rounded-lg',
            })}
          >
            {overlay}
            <div {...getArrowProps({ className: 'tooltip-arrow' })}>
              <span className="block bg-tertiary-2 transform rotate-45"></span>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
