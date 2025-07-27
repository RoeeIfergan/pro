import {
  createContext,
  SetStateAction,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Header, Table } from '@tanstack/table-core'
import { TData } from './types'
import { Box } from '@mui/material'

type table = Table<TData> | null

const TableContext = createContext<TableContextValue | null>(null)

type TableContextProps = {
  table?: table
  width?: number
}

type TableContextValue = TableContextProps & {
  width: number
  maxRowWidth: number
  visibleDepthRow: number
  setVisibleDepthRow: SetStateAction<number>
}

type Props = React.PropsWithChildren & TableContextProps

const cellPadding = 16 * 2
const getColumnWidth = (columns: Header<TData, unknown>[]) =>
  columns.reduce((acc, column) => acc + column.getSize() + cellPadding, 0)

const getMaxRowWidth = (columns: Header<TData, unknown>[]): number => {
  if (!columns) return 0

  const currentDepthColumnsWidth = getColumnWidth(columns)

  const columnsWithChildren = columns.filter((column) => !!column.columns)

  const maxChildColumnSize = columnsWithChildren.reduce(
    (acc, column) => Math.max(acc, getMaxRowWidth(column.columns)),
    0
  )

  return Math.max(currentDepthColumnsWidth, maxChildColumnSize)
}
const useMaxRowWidth = (table) => {
  const columns = table?.getAllColumns()
  const maxWidth = useMemo(() => getMaxRowWidth(columns), [columns])

  return maxWidth
}

const TableProvider = ({ children, table }: Props): JSX.Element => {
  const tableWidthRef = useRef()
  const [width, setWidth] = useState(10)
  const [visibleDepthRow, setVisibleDepthRow] = useState(0)

  const maxRowWidth = useMaxRowWidth(table)
  // console.log(maxRowWidth)
  useLayoutEffect(() => {
    const updateWidth = () => setWidth(tableWidthRef?.current?.clientWidth || 0)

    if (tableWidthRef.current) {
      window?.addEventListener('resize', updateWidth, false)
    }

    return () => window?.removeEventListener('resize', updateWidth)
  }, [])

  const contextValue = useMemo(
    (): TableContextValue => ({
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
        ref={(newRef) => {
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
