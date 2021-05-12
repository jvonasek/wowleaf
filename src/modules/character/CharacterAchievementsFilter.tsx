import { useForm } from 'react-hook-form'
import { superstructResolver } from '@hookform/resolvers/superstruct'
import { structErrorMessage } from '@/lib/structErrorMessage'
import { ErrorMessage } from '@hookform/error-message'
import { object, pattern, size, string, number } from 'superstruct'

const schema = object({
  email: structErrorMessage(
    size(pattern(string(), /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i), 2, 50),
    'Field has to be email.'
  ),
  age: structErrorMessage(number(), 'Field has to be number'),
})

export const CharacterAchievementsFilter: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: superstructResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit((d) => console.log(d))}>
      <input
        {...register('email')}
        type="text"
        className="block border-2 px-4 py-3 w-full rounded-lg bg-background border-transparent focus:border-accent-light focus:bg-surface focus:ring-0"
      />
      <ErrorMessage name="email" errors={errors} as="div" />
      <input
        {...register('age', { valueAsNumber: true })}
        type="number"
        className="block border-2 px-4 py-3 w-full rounded-lg bg-background border-transparent focus:border-accent-light focus:bg-surface focus:ring-0"
      />
      <ErrorMessage name="age" errors={errors} as="div" />
      <input type="submit" />
    </form>
  )
}
