import { ColumnDef } from '@tanstack/react-table'

type columns<TData> = ColumnDef<TData>[]

export const reverseColumns = <TData>(columns: columns<TData>): columns<TData> => {
  if (!columns) return columns

  columns.reverse()
  columns.map((column) => {
    if (column && 'columns' in column && column.columns) {
      reverseColumns(column.columns)
    }
  })

  return columns
}
export const computeColumns = <TData>(
  columns: columns<TData>,
  shouldReverseColumns?: boolean
): columns<TData> => {
  if (!shouldReverseColumns) return columns

  const reversedColumns = reverseColumns(columns)

  return reversedColumns
}
