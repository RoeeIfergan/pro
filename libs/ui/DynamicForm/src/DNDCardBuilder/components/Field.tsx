import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { ILayoutFieldWithIds } from '../types'
import { useContext } from 'react'
import { DNDCardBuilderContext } from '../utils/context'
import { openEditFieldDialog } from './EditFieldDialog'
import { useSortable } from '@dnd-kit/sortable'

const Field = ({
  field,
  fieldIndex,
  rowIndex,
  listeners
}: {
  field: ILayoutFieldWithIds
  fieldIndex: number
  rowIndex: number
  listeners: ReturnType<typeof useSortable>['listeners']
}) => {
  const contextValue = useContext(DNDCardBuilderContext)
  const { handleRemoveField } = contextValue

  const handleEditField = () => {
    openEditFieldDialog({
      field,
      rowIndex,
      context: contextValue
    })
  }

  return (
    <Stack direction='row' spacing={1} alignItems='center' sx={{ width: '100%' }}>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Typography variant='body2' sx={{ fontFamily: 'monospace' }}>
          {String(field.label ?? field.path)}
        </Typography>
      </Box>

      <Stack direction='row' spacing={0.5}>
        <Tooltip title='Drag to reorder'>
          <IconButton size='small' sx={{ cursor: 'grab' }} {...listeners}>
            <DragIndicatorIcon fontSize='small' />
          </IconButton>
        </Tooltip>

        <Tooltip title='Edit field'>
          <IconButton size='small' onClick={handleEditField} color='primary'>
            <EditIcon fontSize='small' />
          </IconButton>
        </Tooltip>

        <Tooltip title='Delete field'>
          <IconButton
            size='small'
            onClick={() => handleRemoveField(rowIndex, fieldIndex)}
            color='error'
          >
            <DeleteIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  )
}

export default Field
