import { useDebouncedCallback } from 'use-debounce'

import Row from './Row'
import useRows from './Row/useRows'
import { Box, TableBody, TableCell, TableRow } from '@mui/material'
import { useTableContext } from '../TableProvider'
import { TableRowData, Virtualizer } from '../../types'

type bodyProps = {
  height: number
  virtualizer: Virtualizer
}

const HEADER_UPDATE_DEBOUNCE = 100
const getFirstVisibleItem = (virtualizer: Virtualizer) => {
  const scrollOffset = virtualizer.scrollOffset || 0

  return virtualizer.getVirtualItems().find((item) => {
    return item.start + item.size > scrollOffset
  })
}

const useCalcFirstVisibleItem = (virtualizer: Virtualizer, rows: TableRowData[]) => {
  const { setVisibleDepthRow } = useTableContext()

  const debouncedSetVisibleDepthRow = useDebouncedCallback(() => {
    const firstVisibleItem = getFirstVisibleItem(virtualizer)

    const firstVisibleItemIndex = firstVisibleItem?.index
    if (typeof firstVisibleItemIndex !== 'number') return

    const firstVisibleItemDepth = rows[firstVisibleItemIndex]?.depth

    setVisibleDepthRow(firstVisibleItemDepth)
  }, HEADER_UPDATE_DEBOUNCE)

  debouncedSetVisibleDepthRow()
}
const Body = ({ virtualizer, height }: bodyProps) => {
  const { table } = useTableContext()
  const computedRows = useRows(virtualizer)
  const currentRows = table?.getExpandedRowModel()?.rows

  useCalcFirstVisibleItem(virtualizer, currentRows)

  const virtualRows = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0

  const paddingBottom =
    virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0

  return (
    <TableBody
      sx={{
        display: 'flex',
        flexDirection: 'column'
      }}
      component={Box}
      height={height}
    >
      {paddingTop > 0 && (
        <TableRow component={Box}>
          <TableCell component={Box} style={{ height: `${paddingTop}px` }} />
        </TableRow>
      )}
      {computedRows.map(({ row, virtualRow }, rowIndex) => (
        <Row
          row={row}
          key={row.id}
          virtualizer={virtualizer}
          virtualRowIndex={virtualRow.index}
          isLastRow={rowIndex === computedRows.length - 1}
        />
      ))}
      {paddingBottom > 0 && (
        <TableRow component={Box}>
          <TableCell component={Box} style={{ height: `${paddingBottom}px` }} />
        </TableRow>
      )}
    </TableBody>
  )
}

export default Body
