import { useSortable } from '@dnd-kit/sortable'
import { Box, IconButton, Paper, Stack, Tooltip } from '@mui/material'
import { CSS } from '@dnd-kit/utilities'
import Fields from './Fields'
import { useContext } from 'react'
import { DNDCardBuilderContext } from '../utils/context'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { IFieldRowWithIds } from '../types'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

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
  const { handleRemoveRow, handleAddField, fieldPathOptions } = useContext(DNDCardBuilderContext)

  return (
    <SortableRow key={row._id} id={row._id}>
      {({ listeners }) => (
        <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 1 }}>
          <Paper
            variant='outlined'
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              flex: 1,
              width: {
                xs: 300,
                sm: 400,
                md: 500,
                lg: 600,
                xl: 700
              }
            }}
          >
            <Stack direction='row' spacing={1} alignItems='center'>
              <Tooltip title='גרור'>
                <IconButton
                  size='small'
                  sx={{ cursor: 'grab', alignSelf: 'flex-start' }}
                  {...listeners}
                >
                  <DragIndicatorIcon fontSize='small' />
                </IconButton>
              </Tooltip>

              <Tooltip title='מחק'>
                <IconButton size='small' color='error' onClick={() => handleRemoveRow(rowIndex)}>
                  <DeleteIcon fontSize='inherit' />
                </IconButton>
              </Tooltip>

              <Box sx={{ flex: 1 }} />
              <Tooltip title='הוסף שדה'>
                <IconButton
                  size='small'
                  color='primary'
                  onClick={() => handleAddField(rowIndex)}
                  disabled={fieldPathOptions.length === 0}
                >
                  <AddIcon fontSize='inherit' />
                </IconButton>
              </Tooltip>
            </Stack>
            <Fields row={row} rowIndex={rowIndex} />
          </Paper>
        </Box>
      )}
    </SortableRow>
  )
}

export default Row
