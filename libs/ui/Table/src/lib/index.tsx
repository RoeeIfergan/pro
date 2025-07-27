import { useCallback, useMemo, useRef } from 'react'

import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  ColumnDef,
  Row
} from '@tanstack/react-table'

import { TData } from './types'
import TableProvider from './TableProvider'
import { TableContainer, Table, Box, Paper, styled, TableProps } from '@mui/material'
import Headers from './Headers'
import Body from './Body'
import { computeColumns } from './utils'
import { useVirtualizer } from '@tanstack/react-virtual'

type GTableProps = {
  width: number
  height: number
  data: TData[]
  reverseColumns?: boolean
  columns: ColumnDef<TData>[]
  getRowCanExpand?: (row: Row<TData>) => boolean
}

const StyledTable = styled(Table)<TableProps>(() => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'auto'
}))

const OVERSCAN_SIZE = 5

const ReactTable = ({
  data,
  height,
  columns,
  reverseColumns,
  getRowCanExpand
}: GTableProps): JSX.Element => {
  const getSubRows = useCallback((originalRow: TData) => originalRow.subRows, [])
  const { computedData, computedColumns } = useMemo(
    () => ({
      computedData: [...data],
      computedColumns: computeColumns(columns, reverseColumns)
    }),
    [data, columns, reverseColumns]
  )

  const table = useReactTable<TData>({
    data: computedData,
    columns: computedColumns,
    getSubRows,
    getRowCanExpand,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel()
  })
  const currentRows = table.getExpandedRowModel()?.rows
  const virtualizeAmount = currentRows.length || 0
  const tableContainerRef = useRef()
  const virtualizer = useVirtualizer({
    count: virtualizeAmount,
    horizontal: false,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: (index) => 42,
    // debug: true,
    overscan: OVERSCAN_SIZE //TODO: Increase
  })

  return (
    <TableProvider table={table}>
      <TableContainer
        component={Paper}
        id='tableContainer'
        style={{ width: '100%', overflow: 'hidden' }}
      >
        <StyledTable
          id='table-ref'
          size='small'
          stickyHeader
          component={Box}
          ref={tableContainerRef}
        >
          <Headers />
          <Body virtualizer={virtualizer} height={height} />
        </StyledTable>
      </TableContainer>
    </TableProvider>
  )
}

export default ReactTable
