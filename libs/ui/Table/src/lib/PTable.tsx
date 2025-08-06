import React, { useRef, useMemo, useCallback, Fragment } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  flexRender,
  ColumnResizeMode,
  Row
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
  UnfoldMore
} from '@mui/icons-material'
import { PTableProps } from '../types'

export function PTable<TData>({
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
}: PTableProps<TData>) {
  const tableContainerRef = useRef<HTMLDivElement>(null)

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
            />
          )
        },
        enableResizing: false,
        enableSorting: false,
        enableGrouping: false,
        size: 20
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
        size: 20
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
    columnResizeMode: 'onChange' as ColumnResizeMode,
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
    enableRowSelection: () => true, // Allow all rows to be selectable
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
      <Table
        stickyHeader
        sx={{
          width: table.getTotalSize(),
          minWidth: '100%'
        }}
      >
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
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
                        headerGroup.headers.map((h) => h.column.id)
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
                      {header.isPlaceholder ? null : (
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

                    {/* Column resizer */}
                    {enableColumnResizing && header.column.getCanResize() && (
                      <Box
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        sx={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          height: '100%',
                          cursor: 'col-resize',
                          userSelect: 'none',
                          touchAction: 'none',
                          backgroundColor: header.column.getIsResizing()
                            ? 'primary.main'
                            : 'transparent',
                          '&:hover': {
                            backgroundColor: 'primary.light'
                          }
                        }}
                      />
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
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
                            isPinned === 'right' ? `${cell.column.getStart('right')}px` : undefined,
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
    </TableContainer>
  )
}
