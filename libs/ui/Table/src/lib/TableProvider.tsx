import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Column, Table } from '@tanstack/table-core'
import { Box } from '@mui/material'
import { TData } from '../types'

type table = Table<TData>

type TableContextProps = {
  table: table
}

type TableContextValue = TableContextProps & {
  width: number
  maxRowWidth: number
  visibleDepthRow: number
  setVisibleDepthRow: Dispatch<SetStateAction<number>>
}
const TableContext = createContext<TableContextValue | undefined>(undefined)

type Props = React.PropsWithChildren & TableContextProps

const cellPadding = 16 * 2
const getColumnWidth = (columns: Column<TData, unknown>[]) =>
  columns.reduce((acc, column) => acc + column.getSize() + cellPadding, 0)

const getMaxRowWidth = (columns: Column<TData, unknown>[]): number => {
  if (!columns) return 0

  const currentDepthColumnsWidth = getColumnWidth(columns)

  const columnsWithChildren = columns.filter((column) => !!column.columns)

  const maxChildColumnSize = columnsWithChildren.reduce(
    (acc, column) => Math.max(acc, getMaxRowWidth(column.columns)),
    0
  )

  return Math.max(currentDepthColumnsWidth, maxChildColumnSize)
}
const useMaxRowWidth = (table: table) => {
  const columns = table?.getAllColumns()
  const maxWidth = useMemo(() => getMaxRowWidth(columns), [columns])

  return maxWidth
}

const TableProvider = ({ children, table }: Props): JSX.Element => {
  const tableWidthRef = useRef<Element>()
  const [width, setWidth] = useState(0)
  const [visibleDepthRow, setVisibleDepthRow] = useState(0)

  const maxRowWidth = useMaxRowWidth(table)

  useLayoutEffect(() => {
    const updateWidth = () => setWidth(tableWidthRef.current?.clientWidth || 0)

    if (tableWidthRef.current) {
      window?.addEventListener('resize', updateWidth, false)
    }

    return () => window?.removeEventListener('resize', updateWidth)
  }, [])

  const contextValue = useMemo(
    () => ({
      table,
      width,
      maxRowWidth,
      visibleDepthRow,
      setVisibleDepthRow
    }),
    [table, width, maxRowWidth, visibleDepthRow]
  )

  return (
    <TableContext.Provider value={contextValue}>
      <Box
        ref={(newRef: Element | undefined) => {
          if (newRef) {
            const newWidth = newRef?.clientWidth
            tableWidthRef.current = newRef
            if (width !== newWidth) {
              setWidth(newWidth)
            }
          }
        }}
      >
        {children}
      </Box>
    </TableContext.Provider>
  )
}

const defaultTableContextValue = {}
export const useTableContext = (): TableContextValue => {
  const contextValue = useContext(TableContext)

  if (contextValue === undefined) {
    throw new Error('useTableContext can not be called outside of TableProvider!')
  }

  return contextValue || defaultTableContextValue
}

export default TableProvider
