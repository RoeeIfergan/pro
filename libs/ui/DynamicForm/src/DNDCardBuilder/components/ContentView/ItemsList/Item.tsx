import { Box, Button, IconButton, Tooltip } from '@mui/material'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useSortable } from '@dnd-kit/sortable'
import { DND_CARD_BUILDER_LABELS } from '../../../utils/constants'
import { useDNDCardBuilderContext } from '../../../utils/context'

const Item = ({
  id,
  onDelete,
  onEdit,
  label,
  listeners,
  tooltipTitle
}: {
  id: string
  onDelete: () => void
  onEdit: () => void
  label?: string | React.ReactNode
  listeners: ReturnType<typeof useSortable>['listeners']
  tooltipTitle?: React.ReactNode
}) => {
  const { setHoveredItem } = useDNDCardBuilderContext()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, px: 2 }}>
      <Tooltip title={DND_CARD_BUILDER_LABELS.DRAG_TOOLTIP}>
        <IconButton size='small' sx={{ cursor: 'grab' }} {...listeners}>
          <DragIndicatorIcon fontSize='small' />
        </IconButton>
      </Tooltip>

      <Tooltip title={tooltipTitle ?? ''}>
        <Button
          sx={{
            width: '100%',
            px: 2,
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
              backgroundColor: 'action.primary',
              borderColor: 'divider',
              color: 'text.primary'
            }
          }}
          color='primary'
          variant='outlined'
          onClick={onEdit}
          onMouseEnter={() => setHoveredItem({ _id: id })}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {label}

          <Box className='edit-icons'>
            <Tooltip title={DND_CARD_BUILDER_LABELS.EDIT_FIELD}>
              <IconButton
                size='small'
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
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
                  onDelete()
                }}
              >
                <DeleteIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
        </Button>
      </Tooltip>
    </Box>
  )
}

export default Item
