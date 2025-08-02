import { TableRowData } from '../../../types'

const useRowCells = (row: TableRowData) => {
  return row.getVisibleCells().filter((cell) => cell.column.depth === row.depth)
}

export default useRowCells
