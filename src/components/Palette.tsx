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
      positive: ['bg-positive', 'text-on-positive'],
      negative: ['bg-negative', 'text-on-negative'],
      neutral: ['bg-neutral', 'text-on-neutral'],
    },
  },
]

export type PaletteProps = void

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
  </div>
)
