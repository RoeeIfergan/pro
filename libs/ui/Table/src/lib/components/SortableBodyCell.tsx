import { TableCell } from '@mui/material'
import { useSortable } from '@dnd-kit/sortable'
import { flexRender, Cell, Row } from '@tanstack/react-table'

interface SortableBodyCellProps<TData> {
  cell: Cell<TData, unknown>
  row: Row<TData>
  isRtl?: boolean
  shouldShowRightBorder: (id: string, all: string[]) => boolean
}

export function SortableBodyCell<TData>({
  cell,
  row,
  isRtl,
  shouldShowRightBorder
}: SortableBodyCellProps<TData>) {
  const isPinned = cell.column.getIsPinned()
  const { setNodeRef, transform, isDragging } = useSortable({ id: cell.column.id })

  return (
    <TableCell
      ref={setNodeRef}
      key={cell.id}
      align='left'
      sx={{
        width: cell.column.getSize(),
        minWidth: cell.column.getSize(),
        position: isPinned ? 'sticky' : 'static',
        left: isPinned === 'left' ? `${cell.column.getStart('left')}px` : undefined,
        right: isPinned === 'right' ? `${cell.column.getStart('right')}px` : undefined,
        borderRight: shouldShowRightBorder(
          cell.column.id,
          row.getVisibleCells().map((c) => c.column.id)
        )
          ? '1px solid'
          : 'none',
        borderColor: 'divider',
        backgroundColor: isPinned ? 'grey.50' : 'inherit',
        zIndex: isPinned ? 1 : 0,
        boxShadow:
          isPinned === 'left'
            ? '2px 0 4px rgba(0,0,0,0.1)'
            : isPinned === 'right'
              ? '-2px 0 4px rgba(0,0,0,0.1)'
              : 'none',
        padding: cell.column.id === 'select' ? '4px' : '12px',
        paddingLeft:
          row.depth > 0 && cell.column.id !== 'select' ? `${16 + row.depth * 20}px` : undefined,
        transition: 'width transform 0.2s ease-in-out',
        transform: transform
          ? `translate(${(isRtl ? -1 : 1) * Math.round(transform.x)}px, 0px)`
          : 'none',
        opacity: isDragging ? 0.95 : 1
      }}
    >
      {cell.getIsAggregated()
        ? flexRender(
            cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
            cell.getContext()
          )
        : cell.getIsPlaceholder()
          ? null
          : flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  )
}
