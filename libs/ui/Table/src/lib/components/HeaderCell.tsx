import { Box, IconButton, Stack, TableCell } from '@mui/material'
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

export interface HeaderCellProps<TData> {
  header: TableHeader<TData, unknown>
  enableColumnResizing: boolean
  shouldShowRightBorder: (columnId: string, allColumns: string[]) => boolean
  headerGroupColumnIds: string[]
  isDraggable?: boolean
  showDivider?: boolean
  isRtl?: boolean
}

export function HeaderCell<TData>({
  header,
  enableColumnResizing,
  shouldShowRightBorder,
  headerGroupColumnIds,
  isDraggable = false,
  showDivider = false
}: HeaderCellProps<TData>) {
  const columnId = header.column.id
  const isPinned = header.column.getIsPinned()
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `col:${columnId}`,
    disabled: !isDraggable
  })

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
          cursor: header.column.getCanSort() ? 'pointer' : 'default',
          '& .group-handle, & .sort-handle:not(.sorted), & .drag-handle': {
            opacity: 0,
            transition: 'opacity 0.2s ease-in-out'
          },
          '&:hover .group-handle, &:hover .sort-handle:not(.sorted), &:hover .drag-handle': {
            opacity: 1
          }
        }}
        onClick={header.column.getToggleSortingHandler()}
      >
        {!header.isPlaceholder && (
          <>
            {header.column.getCanGroup() && header.column.getIsGrouped() && (
              <IconButton
                className='group-handle'
                size='small'
                onClick={(e) => {
                  e.stopPropagation()
                  header.column.getToggleGroupingHandler()()
                }}
              >
                <UnfoldMore />
              </IconButton>
            )}

            <Stack direction='row' spacing={1}>
              {isDraggable && (
                <Box
                  className='drag-handle'
                  ref={setNodeRef}
                  {...attributes}
                  {...listeners}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  role='button'
                  tabIndex={0}
                  aria-roledescription='column drag handle'
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'grab'
                  }}
                >
                  <DragIndicator fontSize='small' />
                </Box>
              )}

              {flexRender(header.column.columnDef.header, header.getContext())}
            </Stack>
            {header.column.getCanSort() && (
              <Box
                className={`sort-handle${header.column.getIsSorted() ? ' sorted' : ''}`}
                sx={{ display: 'inline-flex', alignItems: 'center' }}
              >
                {header.column.getIsSorted() === 'asc' ? (
                  <ArrowUpward fontSize='small' />
                ) : header.column.getIsSorted() === 'desc' ? (
                  <ArrowDownward fontSize='small' />
                ) : (
                  <ArrowUpward fontSize='small' sx={{ opacity: 0.5 }} />
                )}
              </Box>
            )}
            {header.column.getCanGroup() && !header.column.getIsGrouped() && (
              <IconButton
                className='group-handle'
                size='small'
                onClick={(e) => {
                  e.stopPropagation()
                  header.column.getToggleGroupingHandler()()
                }}
              >
                <ViewColumn />
              </IconButton>
            )}
          </>
        )}
      </Box>

      <ColumnResizer header={header} enable={enableColumnResizing} />

      {(isDraggable || showDivider) && <DroppableDivider id={`divider:${columnId}`} />}
    </TableCell>
  )
}
