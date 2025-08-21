import { Box, Button, IconButton, Tooltip } from '@mui/material'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useContext } from 'react'
import { DNDCardBuilderContext } from '../utils/context'
import { useSortable } from '@dnd-kit/sortable'
import { ILayoutFieldWithIds } from '../types'
import { DND_CARD_BUILDER_LABELS } from '../utils/constants'

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
  const { handleRemoveField, navigateToEditField } = contextValue

  const handleEditField = () => {
    navigateToEditField(field, rowIndex, fieldIndex)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
      <Tooltip title={DND_CARD_BUILDER_LABELS.DRAG_TOOLTIP}>
        <IconButton size='small' sx={{ cursor: 'grab' }} {...listeners}>
          <DragIndicatorIcon fontSize='small' />
        </IconButton>
      </Tooltip>

      <Button
        sx={{
          width: '100%',
          p: 2,
          display: 'flex',
          height: 56,
          color: 'text.primary',
          borderColor: 'divider',
          justifyContent: 'space-between',
          position: 'relative',
          '& .edit-icons': {
            opacity: 0,
            transform: 'scale(0.8)',
            transition: 'all 0.2s ease-in-out'
          },
          '&:hover .edit-icons': {
            opacity: 1,
            transform: 'scale(1)'
          },
          '&:hover': {
            backgroundColor: 'action.hover',
            borderColor: 'divider',
            color: 'text.primary'
          }
        }}
        color='primary'
        variant='outlined'
        onClick={handleEditField}
      >
        {String(field.label ?? field.path)}

        <Box className='edit-icons'>
          <Tooltip title={DND_CARD_BUILDER_LABELS.EDIT_FIELD}>
            <IconButton
              size='small'
              onClick={(e) => {
                e.stopPropagation()
                handleEditField()
              }}
            >
              <EditIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          <Tooltip title={DND_CARD_BUILDER_LABELS.DELETE_FIELD}>
            <IconButton
              size='small'
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveField(rowIndex, fieldIndex)
              }}
            >
              <DeleteIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Box>
      </Button>
    </Box>
  )
}

export default Field
