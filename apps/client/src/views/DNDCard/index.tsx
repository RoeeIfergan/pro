import { Box, Divider, MenuItem, Select, Stack, Typography } from '@mui/material'
import DynamicForm, {
  ICardSchemaMetaWithIds,
  ICollection,
  UnknownRecord,
  useCollectionQuery,
  withStableIds
} from '@pro3/DynamicForm'
import { useEffect, useMemo, useState } from 'react'

import Panel from '../../../../../libs/ui/DynamicForm/src/DNDCardBuilder/components/Panel'
import DNDCardBuilder from '../../../../../libs/ui/DynamicForm/src/DNDCardBuilder/components/DNDCardBuilder'
import z from 'zod'

const emptyLayout: ICardSchemaMetaWithIds<UnknownRecord> = { layout: [] }

const DNDCard = () => {
  const { data: collections, isLoading } = useCollectionQuery()

  const [selectedCollectionName, setSelectedCollectionName] = useState<string>('')

  const selectedCollection = useMemo<ICollection<UnknownRecord> | undefined>(() => {
    if (!collections || collections.length === 0) return undefined
    const found = collections.find((c) => c.name === selectedCollectionName) ?? collections[0]
    return found as ICollection<UnknownRecord>
  }, [collections, selectedCollectionName])

  const [uiSchema, setUiSchema] = useState<ICardSchemaMetaWithIds<UnknownRecord>>(emptyLayout)

  const previewCollection: ICollection<UnknownRecord> | undefined = useMemo(() => {
    if (!selectedCollection) return undefined
    return {
      name: `Preview`,
      schema: z.object({}),
      defaultValues: {} as UnknownRecord,
      uiSchema: uiSchema
    }
  }, [selectedCollection, uiSchema])

  useEffect(() => {
    if (collections && collections.length > 0 && !selectedCollectionName) {
      setSelectedCollectionName(collections[0].name)
    }
  }, [collections, selectedCollectionName])

  useEffect(() => {
    if (selectedCollection) {
      setUiSchema(withStableIds(selectedCollection.uiSchema))
    }
  }, [selectedCollection])

  return (
    <Box
      p={2}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%', width: '100%' }}
    >
      <Stack direction='row' spacing={2} alignItems='center'>
        <Typography variant='h5'>UI Schema Builder</Typography>
        <Divider flexItem orientation='vertical' />
        <Typography variant='body2'>Base collection:</Typography>
        <Select
          size='small'
          value={isLoading ? 'loading' : selectedCollectionName}
          onChange={(e) => setSelectedCollectionName(String(e.target.value))}
          disabled={isLoading}
          sx={{ minWidth: 200 }}
        >
          {isLoading ? (
            <MenuItem value='loading' disabled>
              Loading...
            </MenuItem>
          ) : (
            (collections ?? []).map((c) => (
              <MenuItem key={c.name} value={c.name}>
                {c.name}
              </MenuItem>
            ))
          )}
        </Select>
      </Stack>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1, minWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
          <Panel title='UI Preview'>
            <DynamicForm key={selectedCollectionName} collection={previewCollection} />
          </Panel>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Panel title='Builder'>
            <DNDCardBuilder
              key={selectedCollectionName}
              setUiSchema={setUiSchema}
              uiSchema={uiSchema}
            />
          </Panel>
        </Box>
      </Box>
    </Box>
  )
}

export default DNDCard
