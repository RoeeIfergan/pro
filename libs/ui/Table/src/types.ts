import { Row } from '@tanstack/react-table'
import { Virtualizer as TanStackVirtualizer } from '@tanstack/react-virtual'

export type TData = object & {
  subRows?: TData[]
}
export type TableRowData = Row<TData>
export type Virtualizer = TanStackVirtualizer<Element, Element>
