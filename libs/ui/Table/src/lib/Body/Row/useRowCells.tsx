import { useMemo } from 'react'
import { Cell } from '@tanstack/react-table'
import { TData } from '../../types'
import { ReactTableRow } from './types'

type RowCells = Cell<TData, unknown>[]

const useRowCells = (row: ReactTableRow): RowCells => {
  const headerGroups = useMemo(
    () => row.getVisibleCells().filter((cell) => cell.column.depth === row.depth),
    []
  )

  return row.getVisibleCells().filter((cell) => cell.column.depth === row.depth)
}

export default useRowCells
