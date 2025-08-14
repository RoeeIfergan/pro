import React from 'react'
import { Box, IconButton, TableCell } from '@mui/material'
import { useDraggable } from '@dnd-kit/core'
import { flexRender, Header as TableHeader } from '@tanstack/react-table'
import {
  DragIndicator,
  UnfoldMore,
  ViewColumn,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material'
import { DroppableDivider } from './DroppableDivider'
import { ColumnResizer } from './ColumnResizer'

export interface DraggableHeaderCellProps<TData> {
  header: TableHeader<TData, unknown>
  enableColumnResizing: boolean
  shouldShowRightBorder: (columnId: string, allColumns: string[]) => boolean
  headerGroupColumnIds: string[]
}

export function DraggableHeaderCell<TData>({
  header,
  enableColumnResizing,
  shouldShowRightBorder,
  headerGroupColumnIds
}: DraggableHeaderCellProps<TData>) {
  const columnId = header.column.id
  const isPinned = header.column.getIsPinned()
  const { attributes, listeners, setNodeRef } = useDraggable({ id: `col:${columnId}` })

  return (
    <TableCell
      key={header.id}
      align='left'
      sx={{
        width: header.getSize(),
        minWidth: header.getSize(),
        maxWidth: header.getSize(),
        position: 'sticky',
        top: 0,
        left: isPinned === 'left' ? `${header.getStart('left')}px` : undefined,
        right: isPinned === 'right' ? `${header.getStart('right')}px` : undefined,
        borderRight: shouldShowRightBorder(header.column.id, headerGroupColumnIds)
          ? '1px solid'
          : 'none',
        borderColor: 'divider',
        userSelect: 'none',
        backgroundColor: isPinned ? 'grey.50' : 'background.paper',
        zIndex: isPinned ? 11 : 10
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: header.column.getCanSort() ? 'pointer' : 'default'
        }}
        onClick={header.column.getToggleSortingHandler()}
      >
        {!header.isPlaceholder && (
          <>
            <Box
              ref={setNodeRef}
              {...attributes}
              {...listeners}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              role='button'
              tabIndex={0}
              aria-roledescription='column drag handle'
              sx={{ display: 'inline-flex', alignItems: 'center', cursor: 'grab' }}
            >
              <DragIndicator fontSize='small' />
            </Box>
            {flexRender(header.column.columnDef.header, header.getContext())}
            {header.column.getCanGroup() && (
              <IconButton
                size='small'
                onClick={(e) => {
                  e.stopPropagation()
                  header.column.getToggleGroupingHandler()()
                }}
              >
                {header.column.getIsGrouped() ? <UnfoldMore /> : <ViewColumn />}
              </IconButton>
            )}
            {header.column.getIsSorted() === 'asc' ? (
              <ArrowUpward fontSize='small' />
            ) : header.column.getIsSorted() === 'desc' ? (
              <ArrowDownward fontSize='small' />
            ) : null}
          </>
        )}
      </Box>

      <ColumnResizer header={header} enable={enableColumnResizing} />

      <DroppableDivider id={`divider:${columnId}`} />
    </TableCell>
  )
}
