const sizes = {
  small: 'h-3 w-3',
  medium: 'h-4 w-4',
  large: 'h-5 w-5',
}

export const Spinner: React.FC<{ size?: keyof typeof sizes }> = ({
  size = 'medium',
}) => {
  return (
    <svg
      className={`animate-spin ${sizes[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}
