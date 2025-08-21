import { useSortable } from '@dnd-kit/sortable'
import { Box, IconButton, Paper, Tooltip } from '@mui/material'
import { CSS } from '@dnd-kit/utilities'
import Fields from './Fields'
import { useContext } from 'react'
import { DNDCardBuilderContext } from '../utils/context'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { IFieldRowWithIds } from '../types/index'
import DeleteIcon from '@mui/icons-material/Delete'
import { DND_CARD_BUILDER_LABELS } from '../utils/constants'

const SortableRow = ({
  id,
  children
}: {
  id: string
  children: (bind: { listeners: ReturnType<typeof useSortable>['listeners'] }) => React.ReactNode
}) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? undefined,
    width: '100%',
    opacity: isDragging ? 0.5 : 1
  } satisfies React.CSSProperties
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children({ listeners })}
    </div>
  )
}

const Row = ({ row, rowIndex }: { row: IFieldRowWithIds; rowIndex: number }) => {
  const { handleRemoveRow } = useContext(DNDCardBuilderContext)

  return (
    <SortableRow key={row._id} id={row._id}>
      {({ listeners }) => (
        <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Tooltip title={DND_CARD_BUILDER_LABELS.DRAG_TOOLTIP}>
              <IconButton
                size='small'
                sx={{ cursor: 'grab', alignSelf: 'flex-start' }}
                {...listeners}
              >
                <DragIndicatorIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>

          <Paper
            sx={{
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              flex: 1,
              width: {
                xs: 300,
                sm: 400,
                md: 450,
                lg: 500,
                xl: 600
              }
            }}
          >
            <Fields row={row} rowIndex={rowIndex} />
          </Paper>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Tooltip title={DND_CARD_BUILDER_LABELS.DELETE_FIELD}>
              <IconButton size='small' onClick={() => handleRemoveRow(rowIndex)}>
                <DeleteIcon fontSize='inherit' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}
    </SortableRow>
  )
}

export default Row
