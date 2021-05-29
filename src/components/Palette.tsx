import { Button, ButtonVariant } from '@/components/Button'
import { FormInput } from '@/components/FormInput'

import { getHslColorByPercent } from '@/lib/utils'

const definitions = [
  {
    name: 'Background',
    palette: {
      background: ['bg-background', 'text-foreground'],
    },
  },
  {
    name: 'Surface',
    palette: {
      'surface-1': ['bg-surface-1', 'text-foreground'],
      'surface-2': ['bg-surface-2', 'text-foreground'],
    },
  },
  {
    name: 'Primary',
    palette: {
      'primary-1': ['bg-primary-1', 'text-on-primary'],
      'primary-2': ['bg-primary-2', 'text-on-primary'],
      'primary-3': ['bg-primary-3', 'text-on-primary'],
    },
  },
  {
    name: 'Secondary',
    palette: {
      'secondary-1': ['bg-secondary-1', 'text-on-secondary'],
      'secondary-2': ['bg-secondary-2', 'text-on-secondary'],
      'secondary-3': ['bg-secondary-3', 'text-on-secondary'],
    },
  },
  {
    name: 'Tertiary',
    palette: {
      'tertiary-1': ['bg-tertiary-1', 'text-on-tertiary'],
      'tertiary-2': ['bg-tertiary-2', 'text-on-tertiary'],
      'tertiary-3': ['bg-tertiary-3', 'text-on-tertiary'],
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
    name: 'Tertiary',
    props: {
      variant: 'tertiary' as ButtonVariant,
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
    <h1 className="text-4xl font-bold mb-2 text-foreground">
      Foreground Text Color
    </h1>
    <p className="text-foreground-muted mb-10">Foreground muted text color</p>
    <div className="mb-10">
      <h1 className="text-4xl font-bold mb-2 text-foreground">Form</h1>
      <FormInput name="input-1" placeholder="Placeholder..." />
    </div>
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
