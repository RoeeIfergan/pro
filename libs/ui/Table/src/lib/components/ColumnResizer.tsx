import { Box } from '@mui/material'
import { Header as TableHeader } from '@tanstack/react-table'

export function ColumnResizer<TData>({
  header,
  enable
}: {
  header: TableHeader<TData, unknown>
  enable: boolean
}) {
  if (!enable || !header.column.getCanResize()) return null
  return (
    <Box
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
      sx={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: 6,
        height: '100%',
        cursor: 'col-resize',
        userSelect: 'none',
        touchAction: 'none',
        backgroundColor: header.column.getIsResizing() ? 'primary.main' : 'transparent',
        '&:hover': { backgroundColor: 'primary.light' },
        zIndex: 12
      }}
    />
  )
}
