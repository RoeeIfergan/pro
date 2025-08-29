import React, { useCallback, useState } from 'react'
import { DndContext, DragStartEvent, DragEndEvent, DragOverlay } from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { DragOverlayLabel } from './DragOverlayLabel'

interface CustomDndContextProps {
  children: React.ReactNode
  columnOrder?: string[]
  setColumnOrder?: (order: string[]) => void
  getAllLeafColumns: () => { id: string }[]
}

export function CustomDndProvider({
  children,
  columnOrder,
  setColumnOrder,
  getAllLeafColumns
}: CustomDndContextProps) {
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const handleColumnDragStart = useCallback(
    (event: DragStartEvent) => {
      const id = String(event.active.id)
      setActiveDragId(id.startsWith('col:') ? id.slice(4) : id)
    },
    [setActiveDragId]
  )

  const handleColumnDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || !setColumnOrder) return
      const allIds = getAllLeafColumns().map((c) => c.id)

      // Current reorderable order, controlled or fallback
      const current = columnOrder && columnOrder.length > 0 ? columnOrder : allIds

      const activeId = String(active.id).replace(/^col:/, '')
      const overDividerId = String(over.id).replace(/^divider:/, '')

      const from = current.indexOf(activeId)
      const to = current.indexOf(overDividerId)
      if (from === -1 || to === -1) return

      // If dropped on same index or to the right, do nothing per spec
      if (to === from || to === from - 1) {
        setActiveDragId(null)
        return
      }

      const nextVisual = current.slice()
      const [item] = nextVisual.splice(from, 1)
      nextVisual.splice(to > from ? to : to + 1, 0, item)

      setColumnOrder(nextVisual)
      setActiveDragId(null)
    },
    [setColumnOrder, columnOrder, getAllLeafColumns, setActiveDragId]
  )

  return (
    <DndContext
      onDragStart={handleColumnDragStart}
      onDragEnd={handleColumnDragEnd}
      modifiers={[restrictToHorizontalAxis]}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {activeDragId && <DragOverlayLabel label={activeDragId} />}
      </DragOverlay>
    </DndContext>
  )
}
