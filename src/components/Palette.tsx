import { Button, ButtonVariant } from '@/components/Button'

import { getHslColorByPercent } from '@/lib/utils'

const definitions = [
  {
    name: 'Backgrounds',
    palette: {
      background: ['bg-background', 'text-foreground'],
      surface: ['bg-surface', 'text-foreground'],
    },
  },
  {
    name: 'Accent',
    palette: {
      lighter: ['bg-accent-lighter', 'text-on-accent'],
      default: ['bg-accent', 'text-on-accent'],
      darker: ['bg-accent-darker', 'text-on-accent'],
    },
  },
  {
    name: 'Alternative Accent',
    palette: {
      lighter: ['bg-accent-alt-lighter', 'text-on-accent-alt'],
      default: ['bg-accent-alt', 'text-on-accent-alt'],
      darker: ['bg-accent-alt-darker', 'text-on-accent-alt'],
    },
  },
  {
    name: 'Reaction',
    palette: {
      positive: [
        'bg-positive active:bg-positive-darker hover:bg-positive-lighter',
        'text-on-positive',
      ],
      negative: [
        'bg-negative active:bg-negative-darker hover:bg-negative-lighter',
        'text-on-negative',
      ],
      neutral: [
        'bg-neutral active:bg-neutral-darker hover:bg-neutral-lighter',
        'text-on-neutral',
      ],
    },
  },
]

const buttons = [
  {
    name: 'Primary',
    props: {
      variant: 'primary' as ButtonVariant,
    },
  },
  {
    name: 'Secondary',
    props: {
      variant: 'secondary' as ButtonVariant,
    },
  },
  {
    name: 'Positive',
    props: {
      variant: 'positive' as ButtonVariant,
    },
  },
  {
    name: 'Negative',
    props: {
      variant: 'negative' as ButtonVariant,
    },
  },
  {
    name: 'Neutral',
    props: {
      variant: 'neutral' as ButtonVariant,
    },
  },
]

const reactionScale = [
  [55, 60, 0, 135],
  [55, 55, 0, 135],
  [55, 50, 0, 135],
]

export const Palette: React.FC = () => (
  <div>
    {definitions.map(({ name, palette }) => (
      <div key={name}>
        <h1 className="text-4xl font-bold mb-2">{name}</h1>
        <div className="grid grid-flow-col auto-cols-auto gap-4 mb-10">
          {Object.values(palette).map(([bg, text], index) => (
            <div key={`${bg}-${text}`}>
              <div
                className={`flex h-48 justify-center items-center ${bg} ${text}`}
              >
                <span className="font-bold uppercase text-xl">
                  {Object.keys(palette)[index]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}

    <h1 className="text-4xl font-bold mb-2">Reaction Scale</h1>
    <div className="grid grid-cols-3 mb-10">
      {reactionScale.map((_, index) => (
        <div key={index}>
          <div
            className="h-16 flex items-center justify-center text-white"
            style={{
              background: getHslColorByPercent(100, ...reactionScale[index]),
            }}
          >
            {getHslColorByPercent(100, ...reactionScale[index])}
          </div>
          <div
            className="h-16 flex items-center justify-center text-white"
            style={{
              background: getHslColorByPercent(40, ...reactionScale[index]),
            }}
          >
            {getHslColorByPercent(40, ...reactionScale[index])}
          </div>
          <div
            className="h-16 flex items-center justify-center text-white"
            style={{
              background: getHslColorByPercent(0, ...reactionScale[index]),
            }}
          >
            {getHslColorByPercent(0, ...reactionScale[index])}
          </div>
        </div>
      ))}
    </div>
    <h1 className="text-4xl font-bold mb-2">Buttons</h1>
    {buttons.map(({ name, props }) => (
      <div key={name}>
        <h2 className="text-xl font-bold mb-2">{name}</h2>
        <div className="space-x-4 mb-4">
          <Button {...props} size="large">
            Button
          </Button>
          <Button {...props} size="medium">
            Button
          </Button>
          <Button {...props} size="small">
            Button
          </Button>
        </div>
      </div>
    ))}
  </div>
)
