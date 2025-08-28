import React from 'react'
import { useDNDCardBuilderContext } from '../../../../utils/context'
import ItemsList from '../../ItemsList/ItemsList'
import { DragEndEvent } from '@dnd-kit/core'
import { DND_CARD_BUILDER_LABELS } from '../../../../utils/constants'

interface FieldsCategoryProps {
  rowIndex: number
}

const FieldsCategory: React.FC<FieldsCategoryProps> = ({ rowIndex }) => {
  const { uiSchema, setUiSchema, handleAddField, navigateToEditField, handleRemoveField } =
    useDNDCardBuilderContext()

  const row = uiSchema.rows[rowIndex]

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      if (!row) {
        return
      }
      const fields = [...row.fields]

      const oldIndex = row.fields.findIndex((field) => field._id === active.id)
      const newIndex = row.fields.findIndex((field) => field._id === over.id)

      fields[oldIndex] = row.fields[newIndex]
      fields[newIndex] = row.fields[oldIndex]

      setUiSchema((prev) => ({
        ...prev,
        rows: prev.rows.map((rowItem, index) =>
          index === rowIndex
            ? {
                ...rowItem,
                fields
              }
            : rowItem
        )
      }))
    }
  }

  if (!row) {
    return null
  }

  return (
    <ItemsList
      items={row.fields.map((field) => field._id ?? '') ?? []}
      onAddItem={() => handleAddField({ rowIndex })}
      addItemLabel={DND_CARD_BUILDER_LABELS.ADD_FIELD}
      onDragEnd={handleDragEnd}
      onDeleteItem={(itemIndex) => handleRemoveField({ rowIndex, fieldIndex: itemIndex })}
      onEditItem={(itemIndex) => navigateToEditField({ rowIndex, fieldIndex: itemIndex })}
      renderLabel={(itemIndex) => row.fields[itemIndex]?.label ?? `שדה ${itemIndex + 1}`}
      emptyListMessage='אין שדות בשורה זו'
    />
  )
}

export default FieldsCategory
