const definitions = [
  {
    name: 'Backgrounds',
    palette: {
      background: ['background', 'foreground'],
      surface: ['surface', 'foreground'],
    },
  },
  {
    name: 'Accent',
    palette: {
      lighter: ['accent-lighter', 'on-accent'],
      default: ['accent', 'on-accent'],
      darker: ['accent-darker', 'on-accent'],
    },
  },
  {
    name: 'Alternative Accent',
    palette: {
      lighter: ['accent-alt-lighter', 'on-accent-alt'],
      default: ['accent-alt', 'on-accent-alt'],
      darker: ['accent-alt-darker', 'on-accent-alt'],
    },
  },
  {
    name: 'Reaction',
    palette: {
      positive: ['positive', 'on-positive'],
      negative: ['negative', 'on-negative'],
      neutral: ['neutral', 'on-neutral'],
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
                className={`flex h-48 justify-center items-center bg-${bg} text-${text}`}
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
