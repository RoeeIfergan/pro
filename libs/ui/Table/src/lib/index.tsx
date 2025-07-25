import { useCallback, useMemo } from 'react'

import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  ColumnDef,
  Row
} from '@tanstack/react-table'

import { TData } from './types'
import TableProvider from './TableProvider'
import { TableContainer, Table, Box, Paper, styled } from '@mui/material'
import Headers from './Headers'
import Body from './Body'
import { computeColumns } from './utils'

type TableProps<TData> = {
  data: TData[]
  reverseColumns?: boolean
  columns: ColumnDef<TData>[]
  getRowCanExpand?: (row: Row<TData>) => boolean
}

const StyledTable = styled(Table)(({ width, height }) => ({
  width,
  height,
  display: 'flex',
  flexDirection: 'column'
  // overflow: 'auto',
}))

const ReactTable = ({
  data,
  width,
  height,
  columns,
  reverseColumns,
  getRowCanExpand
}: TableProps<TData>): JSX.Element => {
  const getSubRows = useCallback(
    (originalRow: TData) => originalRow.subRows,
    []
  )
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

  // const renderBody = computedData

  return (
    <TableProvider table={table}>
      <TableContainer
        component={Paper}
        id='tableContainer'
        style={{ overflow: 'hidden' }}
      >
        <StyledTable
          id='table-ref'
          size='small'
          stickyHeader
          component={Box}
          width={width}
        >
          <Headers />
          <Body width={width} height={height} />
        </StyledTable>
      </TableContainer>
    </TableProvider>
  )
}

export default ReactTable
