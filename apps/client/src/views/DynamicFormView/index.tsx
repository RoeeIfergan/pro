import { Box, Typography } from '@mui/material'
import DynamicForm, { useCollectionQuery } from '@pro3/DynamicForm'
import { useState, useEffect, useMemo } from 'react'
import _keyBy from 'lodash/keyBy'
import SelectCollection from './SelectCollection'

const DynamicFormView = () => {
  const { data: collections, isLoading } = useCollectionQuery()

  const collectionsByNames = useMemo(() => _keyBy(collections ?? [], 'name'), [collections])

  const [collection, setCollection] = useState<string>('')

  console.log('💪💪 collections???', collections)

  useEffect(() => {
    if (collections && collections.length > 0 && !collection) {
      setCollection(collections[0].name)
    }
  }, [collections, collection])

  return (
    <Box
      p={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant='h4' p={2}>
          Dynamic Form
        </Typography>

        <SelectCollection
          collections={collections ?? []}
          isLoading={isLoading}
          collection={collection}
          setCollection={setCollection}
        />
      </Box>

      <DynamicForm key={collection ?? ''} collection={collectionsByNames[collection ?? '']} />
    </Box>
  )
}

export default DynamicFormView
