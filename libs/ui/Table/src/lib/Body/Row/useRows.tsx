import { useTableContext } from '../../TableProvider'
import { useMemo } from 'react'
import { Row } from '@tanstack/react-table'
import { VirtualItem } from '@tanstack/react-virtual'
import { TData, Virtualizer } from '../../../types'

const defaultRows: Row<TData>[] = []
type computedRow = {
  row: Row<TData>
  virtualRow: VirtualItem
}
const useRows = (virtualizer: Virtualizer): computedRow[] => {
  const { table } = useTableContext()

  const visibleRows = table?.getRowModel().rows

  const rows = visibleRows || defaultRows

  const virtualItems = virtualizer.getVirtualItems()

  return useMemo(
    () =>
      virtualItems.reduce<computedRow[]>((acc, virtualRow) => {
        const row = rows[virtualRow.index]

        acc.push({
          row,
          virtualRow
        })

        return acc
      }, []),
    [rows, virtualItems]
  )
}

export default useRows
