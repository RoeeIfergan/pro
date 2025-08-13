import {
  ColumnDef,
  RowSelectionState,
  ColumnOrderState,
  ColumnPinningState,
  GroupingState,
  VisibilityState,
  Row,
  OnChangeFn
} from '@tanstack/react-table'

export interface PTableProps<TData = unknown, TValue = unknown> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  selected?: RowSelectionState
  setSelected?: OnChangeFn<RowSelectionState>
  isLoading?: boolean
  loadMore?: () => void
  hasNext?: boolean
  onClickRow?: (row: Row<TData>) => void
  onDoubleClickRow?: (row: Row<TData>) => void
  columnOrder?: ColumnOrderState
  setColumnOrder?: OnChangeFn<ColumnOrderState>
  columnPinning?: ColumnPinningState
  setColumnPinning?: OnChangeFn<ColumnPinningState>
  columnGrouping?: GroupingState
  setColumnGrouping?: OnChangeFn<GroupingState>
  columnVisibility?: VisibilityState
  setColumnVisibility?: OnChangeFn<VisibilityState>
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
  enableColumnResizing?: boolean
  enableSubRows?: boolean
  enableGrouping?: boolean
  enableColumnPinning?: boolean
  enableSorting?: boolean
  getSubRows?: (originalRow: TData, index: number) => TData[] | undefined
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement
  getRowCanExpand?: (row: Row<TData>) => boolean
}

export interface VirtualItem {
  index: number
  start: number
  size: number
  end: number
  key: string
}

export interface ColumnResizeState {
  [columnId: string]: number
}
