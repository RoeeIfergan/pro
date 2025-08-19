import { CreateFieldConfigDto, Field } from '@deliveries/entities'
import { List, Stack } from '@mui/material'
import ScreenFieldConfigsListItem from './screen-fields-list-item'
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import AddScreenFieldConfigsListItem from './add-screen-field'
import { useMemo } from 'react'

interface ScreensDialogProps {
  value: CreateFieldConfigDto[]
  onChange: (update: CreateFieldConfigDto[]) => void
}

export default function ScreenFieldConfigsList(props: ScreensDialogProps) {
  const handleRemove = (index: number) => () => {
    const updatedFields = [...props.value]
    updatedFields.splice(index, 1)
    props.onChange(updatedFields)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const from = props.value.findIndex(({ fieldId }) => fieldId === event.active.id)
    const to = props.value.findIndex(({ fieldId }) => fieldId === event.over?.id)

    if (to === -1) return

    const updatedArray = arrayMove(props.value, +from, +to).map((item, index) => ({
      ...item,
      sequence: index
    }))

    props.onChange(updatedArray)
  }

  const handleAdd = (field: Field) => {
    const fieldConfig: CreateFieldConfigDto = {
      fieldId: field.id,
      sequence: props.value.length
    }

    props.onChange([...props.value, fieldConfig])
  }

  const existingFieldIds = useMemo(() => props.value.map(({ fieldId }) => fieldId), [props.value])

  return (
    <Stack direction='column' gap={1} alignItems='stretch'>
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <SortableContext items={existingFieldIds} strategy={verticalListSortingStrategy}>
          <List sx={{ p: 0, gap: 1 }}>
            {props.value.map((fieldConfig, index) => (
              <ScreenFieldConfigsListItem
                key={fieldConfig.fieldId}
                fieldId={fieldConfig.fieldId}
                onDelete={handleRemove(index)}
              />
            ))}
          </List>
        </SortableContext>
      </DndContext>
      <AddScreenFieldConfigsListItem
        key='add'
        onAdd={handleAdd}
        existingFieldIds={existingFieldIds}
      />
    </Stack>
  )
}
