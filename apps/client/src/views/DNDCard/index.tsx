import { Box, Paper, SxProps, Typography } from '@mui/material'
import DynamicForm, {
  ICollection,
  ICardSchemaMeta,
  DNDCardBuilder,
  EditingState,
  UnknownRecord,
  useCollectionQuery,
  withStableIds
} from '@pro3/DynamicForm'
import { useEffect, useMemo, useState } from 'react'
import z from 'zod'
import Header from './Header'

const emptyLayout: ICardSchemaMeta = { rows: [] }

const Panel = ({
  title,
  children,
  sx
}: {
  title: string
  children: React.ReactNode
  sx?: SxProps
}) => (
  <Paper
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: 'none',
      background: 'transparent',
      minWidth: 0,
      justifyContent: 'center',
      alignSelf: 'flex-start',
      maxHeight: '100%',
      height: '100%',
      overflow: 'hidden',
      ...sx
    }}
  >
    <Box
      p={2}
      sx={{
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        flexShrink: 0,
        alignItems: 'center'
      }}
    >
      <Typography variant='h6'>{title}</Typography>
    </Box>

    <Box
      p={2}
      sx={{
        overflow: 'hidden',
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        display: 'flex'
      }}
    >
      {children}
    </Box>
  </Paper>
)

const DNDCard = () => {
  const { data: collections, isLoading } = useCollectionQuery()

  const [selectedCollectionName, setSelectedCollectionName] = useState<string>('')

  const selectedCollection = useMemo<ICollection<UnknownRecord> | undefined>(() => {
    if (!collections || collections.length === 0) return undefined
    const found = collections.find((c) => c.name === selectedCollectionName) ?? collections[0]
    return found as ICollection<UnknownRecord>
  }, [collections, selectedCollectionName])

  const [uiSchema, setUiSchema] = useState<ICardSchemaMeta>(emptyLayout)

  const [editingState, setEditingState] = useState<EditingState>({
    editingField: null,
    editingRow: null,
    hoveredItem: null
  })

  const previewCollection: ICollection<UnknownRecord> | undefined = useMemo(() => {
    if (!selectedCollection) return undefined
    return {
      name: `Preview`,
      schema: z.object({}),
      defaultValues: {} as UnknownRecord,
      uiSchema: uiSchema,
      context: selectedCollection.context
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
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Header
        uiSchema={uiSchema}
        setUiSchema={setUiSchema}
        isLoading={isLoading}
        selectedCollectionName={selectedCollectionName}
        setSelectedCollectionName={setSelectedCollectionName}
        collections={collections ?? []}
      />

      <Box
        sx={{
          display: 'flex',
          gap: 4,
          alignItems: 'flex-start',
          justifyContent: 'center',
          flex: 1,
          overflow: 'hidden'
        }}
      >
        <Panel
          title='בילדר'
          sx={{
            width: {
              xs: '350px',
              sm: '450px',
              md: '550px',
              lg: '650px',
              xl: '800px'
            }
          }}
        >
          <DNDCardBuilder
            key={selectedCollectionName}
            setUiSchema={setUiSchema}
            uiSchema={uiSchema}
            onEditingStateChange={setEditingState}
          />
        </Panel>

        <Panel title='תצוגה מקדימה'>
          <DynamicForm
            key={selectedCollectionName}
            collection={previewCollection}
            editingState={editingState}
          />
        </Panel>
      </Box>
    </Box>
  )
}

export default DNDCard
