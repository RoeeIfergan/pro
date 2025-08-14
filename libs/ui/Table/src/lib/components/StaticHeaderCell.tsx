import { Box, IconButton, TableCell } from '@mui/material'
import { flexRender, Header as TableHeader } from '@tanstack/react-table'
import { UnfoldMore, ViewColumn, ArrowUpward, ArrowDownward } from '@mui/icons-material'
import { DroppableDivider } from './DroppableDivider'
import { ColumnResizer } from './ColumnResizer'

export interface StaticHeaderCellProps<TData> {
  header: TableHeader<TData, unknown>
  enableColumnResizing: boolean
  shouldShowRightBorder: (columnId: string, allColumns: string[]) => boolean
  showDivider?: boolean
  headerGroupColumnIds: string[]
}

export function StaticHeaderCell<TData>({
  header,
  enableColumnResizing,
  shouldShowRightBorder,
  showDivider,
  headerGroupColumnIds
}: StaticHeaderCellProps<TData>) {
  const isPinned = header.column.getIsPinned()

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

      {showDivider && <DroppableDivider id={`divider:${header.column.id}`} />}
    </TableCell>
  )
}
