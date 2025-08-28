import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { Select } from '@mui/material'
import { MenuItem } from '@mui/material'
import { ICardSchemaMeta, ICollection } from '@pro3/DynamicForm'
import EditIcon from '@mui/icons-material/Edit'
import { openUiSchemaEditorDialog } from '@pro3/DynamicForm'

const Header = ({
  uiSchema,
  setUiSchema,
  isLoading,
  selectedCollectionName,
  setSelectedCollectionName,
  collections
}: {
  uiSchema: ICardSchemaMeta
  setUiSchema: (uiSchema: ICardSchemaMeta) => void
  isLoading: boolean
  selectedCollectionName: string
  setSelectedCollectionName: (name: string) => void
  collections: ICollection[]
}) => {
  const handleOpenJsonEditor = async () => {
    try {
      const result = await openUiSchemaEditorDialog({
        uiSchema: uiSchema
      })
      if (result) {
        setUiSchema(result)
      }
    } catch {
      // User cancelled the dialog
    }
  }

  return (
    <Stack
      direction='row'
      spacing={2}
      alignItems='center'
      p={2}
      border='1px solid'
      borderColor='divider'
    >
      <Typography variant='h5'>עיצוב כרטיס</Typography>

      <Tooltip title='עריכת סכמת UI'>
        <IconButton size='small' onClick={handleOpenJsonEditor}>
          <EditIcon />
        </IconButton>
      </Tooltip>

      <Box sx={{ flex: 1 }} />

      <Select
        size='small'
        value={isLoading ? 'loading' : selectedCollectionName}
        onChange={(e) => setSelectedCollectionName(String(e.target.value))}
        disabled={isLoading}
        sx={{ minWidth: 200, backgroundColor: 'background.default' }}
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
  )
}

export default Header
