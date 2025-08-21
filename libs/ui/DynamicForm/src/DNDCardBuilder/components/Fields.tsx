import React, { useContext } from 'react'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import Field from './Field'
import { IFieldRowWithIds } from '../types'
import { Box, Button } from '@mui/material'
import { DNDCardBuilderContext } from '../utils/context'
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { DND_CARD_BUILDER_LABELS } from '../utils/constants'

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
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children({ listeners })}
    </div>
  )
}

const Fields = ({ row, rowIndex }: { row: IFieldRowWithIds; rowIndex: number }) => {
  const { handleAddField, fieldPathOptions, setUiSchema } = useContext(DNDCardBuilderContext)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  )

  const handleDragEnd = (event: unknown) => {
    const { active, over } = event as { active: { id: string }; over: { id: string } }

    if (over && active.id !== over.id) {
      const fields = [...row.fields]

      const oldIndex = row.fields.findIndex((field) => field._id === active.id)
      const newIndex = row.fields.findIndex((field) => field._id === over.id)

      fields[oldIndex] = row.fields[newIndex]
      fields[newIndex] = row.fields[oldIndex]

      setUiSchema((prev) => ({
        ...prev,
        layout: prev.layout.map((rowItem) =>
          rowItem._id === row._id
            ? {
                ...rowItem,
                fields
              }
            : rowItem
        )
      }))
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={row.fields.map((field) => field._id)}
        strategy={verticalListSortingStrategy}
      >
        {row.fields.map((field, fieldIndex) => (
          <SortableItem key={field._id} id={field._id}>
            {({ listeners }) => (
              <Field
                field={field}
                fieldIndex={fieldIndex}
                rowIndex={rowIndex}
                listeners={listeners}
              />
            )}
          </SortableItem>
        ))}
      </SortableContext>

      <Box flex={1} display='flex' justifyContent='flex-end' alignItems='center'>
        <Button
          variant='outlined'
          color='primary'
          onClick={() => handleAddField(rowIndex)}
          disabled={fieldPathOptions.length === 0}
          sx={{
            mt: 3,
            width: 'calc(100% - 42px)',
            color: 'primary.main',
            '&:hover': {
              color: 'primary.light'
            }
          }}
        >
          {DND_CARD_BUILDER_LABELS.ADD_FIELD}
        </Button>
      </Box>
    </DndContext>
  )
}

export default Fields
