import {
  createContext,
  SetStateAction,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Table } from '@tanstack/table-core'
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
  visibleDepthRow: number
  setVisibleDepthRow: SetStateAction<number>
}

type Props = React.PropsWithChildren & TableContextProps

const TableProvider = ({ children, table }: Props): JSX.Element => {
  const tableWidthRef = useRef()
  const [width, setWidth] = useState(10)
  const [visibleDepthRow, setVisibleDepthRow] = useState(0)

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
      visibleDepthRow,
      setVisibleDepthRow
    }),
    [table, width, visibleDepthRow, setVisibleDepthRow]
  )

  return (
    <TableContext.Provider value={contextValue}>
      <Box
        // style={{ width: '100%', height: '100%' }}
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
