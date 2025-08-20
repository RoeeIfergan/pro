import React, { useRef, useMemo, useCallback, Fragment, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  Row,
  Header as TableHeader,
  Cell
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Checkbox,
  IconButton,
  Stack
} from '@mui/material'
import { ExpandMore, ExpandLess } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { DndContext, DragStartEvent, DragEndEvent, DragOverlay } from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { PTableProps } from '../types'
import { SortableBodyCell } from './components/SortableBodyCell'
import { HeaderCell } from './components/HeaderCell'
import { GroupedRow } from './components/GroupedRow'
import { DragOverlayLabel } from './components/DragOverlayLabel'
import { LoadingContent } from './components/LoadingContent'
import { NoMoreDataConent } from './components/NoMoreDataConent'
import { NoDataAvailableConent } from './components/NoDataAvailableConent'

const DEFAULT_ROW_HEIGHT = 52

export function PTable<TData, TValue = unknown>({
  data,
  columns,
  selected = {},
  setSelected,
  isLoading = false,
  loadMore,
  hasNext = false,
  onClickRow,
  onDoubleClickRow,
  columnOrder,
  setColumnOrder,
  columnPinning,
  setColumnPinning,
  columnGrouping = [],
  setColumnGrouping,
  columnVisibility,
  setColumnVisibility,
  enableRowSelection = true,
  enableColumnResizing = true,
  enableGrouping = false,
  enableColumnPinning = false,
  enableSorting = true,
  renderSubComponent,
  getRowCanExpand,
  overscan = 10
}: PTableProps<TData, TValue>) {
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const theme = useTheme()
  const isRtl = theme.direction === 'rtl'
  const [activeDragId, setActiveDragId] = useState<string | null>(null)

  // Memoize table columns with selection column if enabled
  const tableColumns = useMemo(() => {
    const cols = [...columns]

    if (enableRowSelection) {
      cols.unshift({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            size='small'
            disableRipple
            sx={{ px: 0 }}
          />
        ),
        cell: ({ row }) => {
          const isGrouped = row.getIsGrouped()
          const canExpand = !isGrouped && (getRowCanExpand ? getRowCanExpand(row) : true)
          return (
            <Stack direction='row' spacing={1} sx={{ justifyContent: 'flex-start' }}>
              {renderSubComponent && (
                <IconButton
                  onClick={canExpand ? row.getToggleExpandedHandler() : undefined}
                  size='small'
                  disabled={!canExpand}
                >
                  {row.getIsExpanded() ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              )}
              <Checkbox
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                indeterminate={row.getIsSomeSelected()}
                onChange={row.getToggleSelectedHandler()}
                size='small'
                disableRipple
                sx={{ px: 0 }}
              />
            </Stack>
          )
        },
        enableResizing: false,
        enableSorting: false,
        enableGrouping: false,
        maxSize: 80
      })
    }

    return cols
  }, [columns, enableRowSelection, renderSubComponent, getRowCanExpand])

  // Initialize table instance
  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: enableGrouping ? getGroupedRowModel() : undefined,
    getExpandedRowModel: renderSubComponent ? getExpandedRowModel() : undefined,
    getRowCanExpand: renderSubComponent ? getRowCanExpand : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,

    enableColumnResizing,
    enableGrouping,
    enableSorting,
    enableColumnPinning,
    columnResizeMode: 'onChange',
    columnResizeDirection: isRtl ? 'rtl' : 'ltr',
    getRowId: (row: TData) => (row as TData & { id?: string | number })?.id?.toString() ?? '',
    state: {
      rowSelection: selected,
      columnOrder,
      columnPinning,
      grouping: columnGrouping,
      columnVisibility
    },
    onRowSelectionChange: setSelected,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onGroupingChange: setColumnGrouping,
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection:
      typeof enableRowSelection === 'function' ? enableRowSelection : !!enableRowSelection,
    debugTable: process.env.NODE_ENV === 'development'
  })

  const { rows } = table.getRowModel()

  // Virtualization
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => DEFAULT_ROW_HEIGHT,
    measureElement: (el) =>
      el instanceof HTMLElement ? el.getBoundingClientRect().height : DEFAULT_ROW_HEIGHT,
    getItemKey: (index) => rows[index]?.id ?? index,
    overscan
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()

  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0
  const paddingBottom =
    virtualRows.length > 0 ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0) : 0

  // Infinite scrolling
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
      if (loadMore && hasNext && !isLoading && scrollTop + clientHeight >= scrollHeight - 100) {
        loadMore()
      }
    },
    [loadMore, hasNext, isLoading]
  )

  const handleRowClick = (event: React.MouseEvent, row: Row<TData>) => {
    if (onClickRow) {
      onClickRow(row)
    }
  }

  const handleDoubleRowClick = (event: React.MouseEvent, row: Row<TData>) => {
    if (onDoubleClickRow) {
      onDoubleClickRow(row)
    }
  }

  const shouldShowRightBorder = useCallback((id: string, all: string[]) => {
    const idx = all.indexOf(id)
    if (idx === -1) return false
    return idx < all.length - 1
  }, [])

  const isHeaderReorderable = (header: TableHeader<TData, unknown>) => {
    const id = header.column.id
    const isGrouped = header.column.getIsGrouped?.() === true
    const isSpecial = id === 'select'
    if (isSpecial) return false
    if (isGrouped) return false
    return true
  }

  const handleColumnDragStart = useCallback((event: DragStartEvent) => {
    const id = String(event.active.id)
    setActiveDragId(id.startsWith('col:') ? id.slice(4) : id)
  }, [])

  const handleColumnDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || !setColumnOrder) return
      const allIds = table.getAllLeafColumns().map((c) => c.id)

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
    [setColumnOrder, table, columnOrder]
  )

  return (
    <TableContainer
      ref={tableContainerRef}
      sx={{
        height: '100%',
        overflow: 'auto',
        border: '1px solid',
        borderColor: 'divider'
      }}
      onScroll={handleScroll}
    >
      <DndContext
        onDragStart={handleColumnDragStart}
        onDragEnd={handleColumnDragEnd}
        modifiers={[restrictToHorizontalAxis]}
      >
        <Table
          stickyHeader
          sx={{
            width: table.getTotalSize(),
            minWidth: '100%'
          }}
        >
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <HeaderCell
                      key={header.id}
                      header={header}
                      enableColumnResizing={!!enableColumnResizing}
                      isDraggable={isHeaderReorderable(header)}
                      showDivider={isHeaderReorderable(header)}
                    />
                  ))}
                </TableRow>
              )
            })}
          </TableHead>

          <TableBody>
            {paddingTop > 0 && (
              <TableRow>
                <TableCell
                  colSpan={table.getAllLeafColumns().length}
                  sx={{ height: paddingTop, padding: 0, border: 'none' }}
                />
              </TableRow>
            )}

            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index]
              if (!row) return null

              // Handle grouped rows differently - full width summary
              if (row.getIsGrouped()) {
                return (
                  <Fragment key={row.id}>
                    <GroupedRow
                      row={row}
                      virtualRowSize={virtualRow.size}
                      colSpan={table.getAllLeafColumns().length}
                      virtualRowIndex={virtualRow.index}
                      measureElement={rowVirtualizer.measureElement}
                    />
                  </Fragment>
                )
              }

              // Handle regular data rows
              return (
                <Fragment key={row.id}>
                  <TableRow
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    hover
                    onClick={(e) => handleRowClick(e, row)}
                    onDoubleClick={(e) => handleDoubleRowClick(e, row)}
                    sx={{
                      cursor: onClickRow || onDoubleClickRow ? 'pointer' : 'default',
                      height: virtualRow.size,
                      backgroundColor: row.depth > 0 ? 'grey.25' : 'background.paper'
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <SortableBodyCell<TData, TValue>
                        key={cell.id}
                        cell={cell as Cell<TData, TValue>}
                        row={row}
                        isRtl={isRtl}
                        shouldShowRightBorder={shouldShowRightBorder}
                      />
                    ))}
                  </TableRow>
                  {renderSubComponent && row.getIsExpanded() && !row.getIsGrouped() && (
                    <TableRow>
                      <TableCell
                        colSpan={row.getVisibleCells().length}
                        sx={{ padding: 0, border: 'none' }}
                      >
                        {renderSubComponent({ row })}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              )
            })}

            {paddingBottom > 0 && (
              <TableRow>
                <TableCell
                  colSpan={table.getAllLeafColumns().length}
                  sx={{ height: paddingBottom, padding: 0, border: 'none' }}
                />
              </TableRow>
            )}

            {/* Loading indicator for infinite scroll */}
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={table.getAllLeafColumns().length}
                  sx={{ textAlign: 'center', padding: 2 }}
                >
                  <LoadingContent />
                </TableCell>
              </TableRow>
            )}

            {/* No more data indicator */}
            {!hasNext && !isLoading && data.length > 0 && (
              <TableRow>
                <TableCell
                  colSpan={table.getAllLeafColumns().length}
                  sx={{ textAlign: 'center', padding: 2 }}
                >
                  <NoMoreDataConent />
                </TableCell>
              </TableRow>
            )}

            {/* Empty state */}
            {data.length === 0 && !isLoading && (
              <TableRow>
                <TableCell
                  colSpan={table.getAllLeafColumns().length}
                  sx={{ textAlign: 'center', padding: 4 }}
                >
                  <NoDataAvailableConent />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <DragOverlay dropAnimation={null}>
          {activeDragId && <DragOverlayLabel label={activeDragId} />}
        </DragOverlay>
      </DndContext>
    </TableContainer>
  )
}
