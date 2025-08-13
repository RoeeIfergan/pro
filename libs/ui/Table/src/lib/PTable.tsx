import React, { useRef, useMemo, useCallback, Fragment, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  flexRender,
  Row,
  Header as TableHeader
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
  CircularProgress,
  Box,
  Typography
} from '@mui/material'
import {
  ExpandMore,
  ExpandLess,
  ArrowUpward,
  ArrowDownward,
  ViewColumn,
  UnfoldMore,
  DragIndicator
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  useDraggable,
  useDroppable
} from '@dnd-kit/core'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { PTableProps } from '../types'

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
  getRowCanExpand
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
            sx={{ padding: 0 }}
          />
        ),
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
              size='small'
              disableRipple
            />
          )
        },
        enableResizing: false,
        enableSorting: false,
        enableGrouping: false,
        size: 50
      })
    }

    if (renderSubComponent) {
      cols.unshift({
        id: 'expander',
        cell: ({ row }) => {
          const isGrouped = row.getIsGrouped()
          const canExpand = !isGrouped && (getRowCanExpand ? getRowCanExpand(row) : true)
          return (
            <IconButton
              onClick={canExpand ? row.getToggleExpandedHandler() : undefined}
              size='small'
              disabled={!canExpand}
            >
              {row.getIsExpanded() ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )
        },
        enableResizing: false,
        enableSorting: false,
        enableGrouping: false,
        size: 50
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
    estimateSize: () => 52, // Estimated row height
    overscan: 10
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

  // Handle row clicks
  const handleRowClick = (row: Row<TData>, event: React.MouseEvent) => {
    if (event.detail === 1 && onClickRow) {
      onClickRow(row)
    } else if (event.detail === 2 && onDoubleClickRow) {
      onDoubleClickRow(row)
    }
  }

  // Helper function to determine if a column should have a right border
  const shouldShowRightBorder = (columnId: string, allColumns: string[]) => {
    const isSpecialColumn = columnId === 'select' || columnId === 'expander'
    if (!isSpecialColumn) return true

    const currentIndex = allColumns.indexOf(columnId)
    const nextColumn = allColumns[currentIndex + 1]
    const nextIsSpecial = nextColumn === 'select' || nextColumn === 'expander'

    return !nextIsSpecial
  }

  const isHeaderReorderable = (header: TableHeader<TData, unknown>) => {
    const id = header.column.id
    const meta = (header.column.columnDef as any)?.meta
    const explicitlyReorderable = meta?.reorderable
    const isSpecial = id === 'select' || id === 'expander'
    if (isSpecial) return false
    if (explicitlyReorderable === false) return false
    return true
  }

  const DraggableHeaderCell = ({ header }: { header: TableHeader<TData, unknown> }) => {
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
          borderRight: shouldShowRightBorder(
            header.column.id,
            (header as any).headerGroup.headers.map((h: any) => h.column.id)
          )
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

        {/* Keep column resizer */}
        {enableColumnResizing && header.column.getCanResize() && (
          <Box
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: 6,
              height: '100%',
              cursor: 'col-resize',
              userSelect: 'none',
              touchAction: 'none',
              backgroundColor: header.column.getIsResizing() ? 'primary.main' : 'transparent',
              '&:hover': { backgroundColor: 'primary.light' },
              zIndex: 12
            }}
          />
        )}

        {/* Droppable divider sits just left of the resizer to avoid interaction conflicts */}
        <DroppableDivider id={`divider:${columnId}`} rightOffset={6} />
      </TableCell>
    )
  }

  const StaticHeaderCell = ({ header }: { header: TableHeader<TData, unknown> }) => {
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
          borderRight: shouldShowRightBorder(
            header.column.id,
            (header as any).headerGroup.headers.map((h: any) => h.column.id)
          )
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

        {/* Keep column resizer */}
        {enableColumnResizing && header.column.getCanResize() && (
          <Box
            onMouseDown={header.getResizeHandler()}
            onTouchStart={header.getResizeHandler()}
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: 6,
              height: '100%',
              cursor: 'col-resize',
              userSelect: 'none',
              touchAction: 'none',
              backgroundColor: header.column.getIsResizing() ? 'primary.main' : 'transparent',
              '&:hover': { backgroundColor: 'primary.light' },
              zIndex: 12
            }}
          />
        )}

        {/* Droppable divider sits just left of the resizer to avoid interaction conflicts */}
        {isHeaderReorderable(header as any) && (
          <DroppableDivider id={`divider:${header.column.id}`} rightOffset={6} />
        )}
      </TableCell>
    )
  }

  // Right-edge droppable divider that shows the drop line
  const DroppableDivider = ({ id, rightOffset = 0 }: { id: string; rightOffset?: number }) => {
    const { isOver, setNodeRef } = useDroppable({ id })
    return (
      <Box
        ref={setNodeRef}
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 10,
          height: '100%',
          userSelect: 'none',
          touchAction: 'none',
          backgroundColor: isOver ? 'action.hover' : 'transparent'
        }}
      />
    )
  }

  const handleColumnDragStart = useCallback((event: DragStartEvent) => {
    const id = String(event.active.id)
    setActiveDragId(id.startsWith('col:') ? id.slice(4) : id)
  }, [])

  const handleColumnDragEnd = useCallback(
    (event: DragEndEvent) => {
      console.log('handleColumnDragEnd', event)
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
    [setColumnOrder, table, isRtl, columnOrder]
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
                  {headerGroup.headers.map((header) =>
                    isHeaderReorderable(header as any) ? (
                      <DraggableHeaderCell key={header.id} header={header as any} />
                    ) : (
                      <StaticHeaderCell key={header.id} header={header as any} />
                    )
                  )}
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
                const groupedCell = row.getVisibleCells().find((cell) => cell.getIsGrouped())
                const groupValue = groupedCell
                  ? flexRender(groupedCell.column.columnDef.cell, groupedCell.getContext())
                  : 'Group'
                const groupCount = row.subRows.length

                return (
                  <Fragment key={row.id}>
                    <TableRow
                      hover
                      sx={{
                        backgroundColor: 'primary.light',
                        '&:hover': {
                          backgroundColor: 'primary.main'
                        },
                        height: virtualRow.size,
                        cursor: 'pointer'
                      }}
                      onClick={row.getToggleExpandedHandler()}
                    >
                      <TableCell
                        colSpan={table.getAllLeafColumns().length}
                        sx={{
                          fontWeight: 'bold',
                          padding: '12px 16px',
                          borderBottom: '2px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton size='small' sx={{ color: 'primary.contrastText' }}>
                            {row.getIsExpanded() ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                          <Typography
                            variant='subtitle1'
                            component='span'
                            sx={{ color: 'primary.contrastText', fontWeight: 600 }}
                          >
                            {groupValue}
                          </Typography>
                          <Typography
                            variant='body2'
                            component='span'
                            sx={{ color: 'primary.contrastText', opacity: 0.8 }}
                          >
                            ({groupCount} {groupCount === 1 ? 'item' : 'items'})
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                )
              }

              // Handle regular data rows
              return (
                <Fragment key={row.id}>
                  <TableRow
                    hover
                    onClick={(e) => handleRowClick(row, e)}
                    sx={{
                      cursor: onClickRow || onDoubleClickRow ? 'pointer' : 'default',
                      height: virtualRow.size,
                      backgroundColor: row.depth > 0 ? 'grey.25' : 'background.paper'
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isPinned = cell.column.getIsPinned()
                      return (
                        <TableCell
                          key={cell.id}
                          align='left'
                          sx={{
                            width: cell.column.getSize(),
                            minWidth: cell.column.getSize(),
                            maxWidth: cell.column.getSize(),
                            position: isPinned ? 'sticky' : 'static',
                            left:
                              isPinned === 'left' ? `${cell.column.getStart('left')}px` : undefined,
                            right:
                              isPinned === 'right'
                                ? `${cell.column.getStart('right')}px`
                                : undefined,
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
                            padding:
                              cell.column.id === 'select' || cell.column.id === 'expander'
                                ? '4px'
                                : '12px',
                            paddingLeft:
                              row.depth > 0 && cell.column.id !== 'select'
                                ? `${16 + row.depth * 20}px`
                                : undefined
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
                    })}
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
                  <CircularProgress size={24} />
                  <Typography variant='body2' sx={{ mt: 1 }}>
                    Loading more...
                  </Typography>
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
                  <Typography variant='body2' color='text.secondary'>
                    No more data to load
                  </Typography>
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
                  <Typography variant='body1' color='text.secondary'>
                    No data available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <DragOverlay dropAnimation={null}>
          {activeDragId && (
            <Box
              sx={{
                px: 1,
                py: 0.5,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                boxShadow: 3,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                pointerEvents: 'none'
              }}
            >
              <DragIndicator fontSize='small' />
              <Typography variant='body2'>{activeDragId}</Typography>
            </Box>
          )}
        </DragOverlay>
      </DndContext>
    </TableContainer>
  )
}
