import { RowData } from '@tanstack/react-table'

export type TData = RowData & {
  subRows: TData[] | undefined
}
