import React, { useContext } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { DNDCardBuilderContext } from '../utils/context'
import { IFieldRowWithIds } from '../types'
import Field from './Field'

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
    padding: '10px',
    margin: '5px 0',
    border: '1px solid #ccc',
    borderRadius: '8px',
    opacity: isDragging ? 0.5 : 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children({ listeners })}
    </div>
  )
}

const Fields = ({ row, rowIndex }: { row: IFieldRowWithIds; rowIndex: number }) => {
  const sensors = useSensors(useSensor(PointerSensor))

  const { setUiSchema } = useContext(DNDCardBuilderContext)

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
    </DndContext>
  )
}

export default Fields
