import { DND_CARD_BUILDER_LABELS } from '../../../../utils/constants'
import ItemsList from '../../ItemsList/ItemsList'
import RowItemTooltip from '../RowItemTooltip'
import { useDNDCardBuilderContext } from '../../../../utils/context'
import { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

const RowsCategory = () => {
  const { uiSchema, setUiSchema, handleAddRow, handleRemoveRow, navigateToEditRow } =
    useDNDCardBuilderContext()

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      setUiSchema((prev) => {
        const rows = [...prev.rows]
        const oldIndex = rows.findIndex((row) => row._id === active.id)
        const newIndex = rows.findIndex((row) => row._id === over.id)

        return {
          ...prev,
          rows: arrayMove(rows, oldIndex, newIndex)
        }
      })
    }
  }

  return (
    <ItemsList
      items={uiSchema.rows.map((row) => row._id ?? '') ?? []}
      onAddItem={handleAddRow}
      addItemLabel={DND_CARD_BUILDER_LABELS.ADD_ROW}
      onDragEnd={handleDragEnd}
      onDeleteItem={handleRemoveRow}
      onEditItem={(itemIndex) => navigateToEditRow({ rowIndex: itemIndex })}
      renderLabel={(itemIndex) => uiSchema.rows[itemIndex]?.title ?? `שורה ${itemIndex + 1}`}
      renderTooltipItem={RowItemTooltip}
      emptyListMessage='אין שורות בטופס זה'
    />
  )
}

export default RowsCategory
