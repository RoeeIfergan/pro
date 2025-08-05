import { useCallback, useMemo, useRef } from 'react'

import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  ColumnDef,
  Row
} from '@tanstack/react-table'

// import { TData } from './types'
import TableProvider from './TableProvider'
import { TableContainer, Paper, Table, Box } from '@mui/material'
import Headers from './Headers'
import Body from './Body'
import { useVirtualizer } from '@tanstack/react-virtual'
import { TData } from '../types'
import { computeColumns } from './utils'

type GTableProps = {
  height: number
  data: TData[]
  reverseColumns?: boolean
  columns: ColumnDef<TData>[]
  getRowCanExpand?: (row: Row<TData>) => boolean
}

// const StyledTable = styled((props: TableProps) => <Table {...props} />)(() => ({
//   display: 'flex',
//   flexDirection: 'column',
//   position: 'relative',
//   overflow: 'auto'
// }))

const OVERSCAN_SIZE = 5

function ReactTable({
  data,
  height,
  columns,
  reverseColumns,
  getRowCanExpand
}: GTableProps): JSX.Element {
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
  const tableContainerRef = useRef(null)
  const virtualizer = useVirtualizer({
    count: virtualizeAmount,
    horizontal: false,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 42,
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
        <Table size='small' stickyHeader id='table-ref' component={Box} ref={tableContainerRef}>
          <Headers />
          <Body virtualizer={virtualizer} height={height} />
        </Table>
      </TableContainer>
    </TableProvider>
  )
}

export default ReactTable
