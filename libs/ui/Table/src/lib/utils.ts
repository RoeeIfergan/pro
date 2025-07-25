import { ColumnDef } from '@tanstack/react-table'
import { TData } from './types'

type columns = ColumnDef<TData>[]

export const reverseColumns = (columns: columns): columns => {
  if (!columns) return columns

  columns.reverse()
  columns.map((column) => {
    if (column.columns) {
      reverseColumns(column.columns)
    }
  })

  return columns
}
export const computeColumns = (columns: columns, shouldReverseColumns?: boolean): columns => {
  if (!shouldReverseColumns) return columns

  const reversedColumns = reverseColumns(columns)

  return reversedColumns
}
