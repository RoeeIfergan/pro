import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { Button, Divider, Stack } from '@mui/material'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDNDCardBuilderContext } from '../utils/context'
import Row from './Row'

const Rows = () => {
  const { handleAddRow, setUiSchema, uiSchema } = useDNDCardBuilderContext()
  const sensors = useSensors(useSensor(PointerSensor))

  const swap = <T,>(arr: T[], i: number, j: number): T[] => {
    const next = [...arr]
    const tmp = next[i]
    next[i] = next[j]
    next[j] = tmp
    return next
  }

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)

    // Row re-ordering (by stable ids)
    const rowIds = uiSchema.layout.map((row) => row._id)
    if (rowIds.includes(activeId) && rowIds.includes(overId)) {
      const activeIndex = rowIds.indexOf(activeId)
      const overIndex = rowIds.indexOf(overId)
      if (activeIndex === overIndex) return
      setUiSchema((prev) => ({ ...prev, layout: swap(prev.layout, activeIndex, overIndex) }))
      return
    }

    // Field re-ordering and cross-row moves (by stable ids)
    const locateFieldById = (id: string): { rowIndex: number; fieldIndex: number } | null => {
      for (let r = 0; r < uiSchema.layout.length; r++) {
        const fields = uiSchema.layout[r].fields ?? []
        const idx = fields.findIndex((f) => String((f as unknown as { _id: string })._id) === id)
        if (idx !== -1) return { rowIndex: r, fieldIndex: idx }
      }
      return null
    }

    const activeFieldLoc = locateFieldById(activeId)
    if (activeFieldLoc) {
      const { rowIndex: rowA, fieldIndex: fieldA } = activeFieldLoc

      // Drop over a specific field -> insert before that field (supports same-row and cross-row)
      const overFieldLoc = locateFieldById(overId)
      if (overFieldLoc) {
        const { rowIndex: rowB, fieldIndex: fieldB } = overFieldLoc
        if (rowA === rowB && fieldA === fieldB) return

        setUiSchema((prev) => {
          const layout = [...prev.layout]
          const sourceFields = [...(layout[rowA].fields ?? [])]
          const [moved] = sourceFields.splice(fieldA, 1)
          const targetFields = rowA === rowB ? sourceFields : [...(layout[rowB].fields ?? [])]
          const insertIndex = Math.max(0, Math.min(fieldB, targetFields.length))
          targetFields.splice(insertIndex, 0, moved)

          layout[rowA] = { ...layout[rowA], fields: rowA === rowB ? targetFields : sourceFields }
          layout[rowB] = { ...layout[rowB], fields: targetFields }
          return { ...prev, layout }
        })
        return
      }

      // Drop over a row container -> append to end of that row
      const overRowIndex = rowIds.indexOf(overId)
      if (overRowIndex !== -1) {
        const rowB = overRowIndex
        setUiSchema((prev) => {
          const layout = [...prev.layout]
          const sourceFields = [...(layout[rowA].fields ?? [])]
          const [moved] = sourceFields.splice(fieldA, 1)
          const targetFields = rowA === rowB ? sourceFields : [...(layout[rowB].fields ?? [])]
          targetFields.push(moved)
          layout[rowA] = { ...layout[rowA], fields: rowA === rowB ? targetFields : sourceFields }
          layout[rowB] = { ...layout[rowB], fields: targetFields }
          return { ...prev, layout }
        })
        return
      }
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <Stack spacing={2}>
        <Button variant='contained' onClick={handleAddRow} disabled={!uiSchema}>
          Add Row
        </Button>

        <Divider />

        <SortableContext
          items={uiSchema.layout.map((row) => row._id)}
          strategy={verticalListSortingStrategy}
        >
          {uiSchema.layout.map((row, rowIndex) => (
            <Row key={row._id} row={row} rowIndex={rowIndex} />
          ))}
        </SortableContext>
      </Stack>
    </DndContext>
  )
}

export default Rows
