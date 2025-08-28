import { Box, Button, Typography } from '@mui/material'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import Item from './Item'
import { CSS } from '@dnd-kit/utilities'

function SortableItem({
  id,
  children
}: {
  id: string
  children: (bind: { listeners: ReturnType<typeof useSortable>['listeners'] }) => React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    flex: 1
  }

  return (
    <Box ref={setNodeRef} style={style} {...attributes}>
      {children({ listeners })}
    </Box>
  )
}

const ItemsList = ({
  items,
  onAddItem,
  addItemLabel,
  onDragEnd,
  onDeleteItem,
  onEditItem,
  renderTooltipItem,
  emptyListMessage,
  renderLabel,
  renderHeader
}: {
  items: string[]
  onAddItem: () => void
  addItemLabel: string
  onDragEnd: (event: DragEndEvent) => void
  onDeleteItem: (itemIndex: number) => void
  onEditItem: (itemIndex: number) => void
  renderTooltipItem?: (props: { itemIndex: number }) => React.ReactNode
  renderLabel?: (itemIndex: number) => React.ReactNode | string
  emptyListMessage: string
  renderHeader?: React.ReactNode
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  )
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        pt: renderHeader ? 0 : 4,
        overflow: 'auto',
        maxHeight: '100%'
      }}
    >
      {renderHeader && (
        <Box sx={{ backgroundColor: 'background.default', position: 'sticky', top: 0 }}>
          {renderHeader}
        </Box>
      )}

      {items.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((itemId, itemIndex) => (
              <SortableItem key={itemId} id={itemId}>
                {({ listeners }) => (
                  <Item
                    id={itemId}
                    listeners={listeners}
                    onDelete={() => onDeleteItem(itemIndex)}
                    onEdit={() => onEditItem(itemIndex)}
                    label={renderLabel?.(itemIndex) ?? ''}
                    tooltipTitle={renderTooltipItem?.({ itemIndex })}
                  />
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        <Typography color='text.secondary' sx={{ fontWeight: 500 }}>
          {emptyListMessage}
        </Typography>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          px: 4,
          py: 4,
          pl: 7,
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'background.default'
        }}
      >
        <Button
          variant='outlined'
          onClick={onAddItem}
          sx={{
            width: '100%',
            minHeight: 56,
            color: 'primary.main',
            borderColor: 'primary.main',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover'
            }
          }}
        >
          <Typography color='primary.main'>{addItemLabel}</Typography>
        </Button>
      </Box>
    </Box>
  )
}

export default ItemsList
