import { MenuItem, Select } from '@mui/material'
import { ICollection } from '@pro3/DynamicForm'

const SelectCollection = ({
  collections,
  isLoading,
  collection,
  setCollection
}: {
  collections: ICollection[]
  isLoading: boolean
  collection: string
  setCollection: (collection: string) => void
}) => {
  return (
    <Select
      value={isLoading ? 'loading' : collection || ''}
      onChange={(e) => {
        console.log('💪💪 e', e.target.value)
        if (e.target.value !== 'loading') {
          setCollection(e.target.value)
        }
      }}
      disabled={isLoading}
    >
      {isLoading ? (
        <MenuItem value='loading' disabled>
          Loading...
        </MenuItem>
      ) : (
        collections?.map((collectionItem) => (
          <MenuItem key={collectionItem.name} value={collectionItem.name}>
            {collectionItem.name}
          </MenuItem>
        ))
      )}
    </Select>
  )
}

export default SelectCollection
