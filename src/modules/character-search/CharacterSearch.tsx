import { useRouter } from 'next/router';
import { groupBy, prop } from 'ramda';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { Button } from '@/components/Button';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import { Realm } from '@/prisma/wow';

export const CharacterSearch: React.FC = () => {
  const [regions, setRegions] = useState([])
  const [realms, setRealms] = useState({})
  const [selection, setSelection] = useState({
    region: undefined,
    realm: undefined,
    character: undefined,
  })
  const router = useRouter()

  const { isSuccess, data } = useQuery<Realm[]>('/api/wow/realms')

  useEffect(() => {
    if (isSuccess) {
      const group = groupBy(prop('region'), data)
      setRegions(Object.keys(group))
      setRealms(group)
    }
  }, [isSuccess, data])

  const onRealmSelect = useCallback((e) => {
    const val = e.target.value
    const [region, realm] = val.split('_')
    setSelection((prev) => ({ ...prev, region, realm }))
  }, [])

  const onCharacterInput = useCallback((e) => {
    const character = e.target.value
    setSelection((prev) => ({ ...prev, character }))
  }, [])

  return (
    <div className="flex bg-surface rounded-lg p-7 space-x-7">
      <FormInput
        name="character-name"
        placeholder="Character name..."
        onBlur={onCharacterInput}
      />
      <FormSelect
        name="character-realm"
        defaultValue=""
        onChange={onRealmSelect}
        options={[
          {
            label: 'Choose realm...',
            value: '',
            disabled: true,
            hidden: true,
          },
          ...regions.map((region) => ({
            label: region,
            options: realms[region].map(({ name, slug }) => ({
              label: name,
              value: `${region}_${slug}`,
            })),
          })),
        ]}
      />
      <Button
        onClick={() =>
          router.push(
            `/character/${selection.region}/${selection.realm}/${selection.character}`
          )
        }
      >
        Submit
      </Button>
    </div>
  )
}
