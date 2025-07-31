import { Box, styled, TableCell, TableHead, TableHeadProps, useTheme } from '@mui/material'
import useHeaders from './useHeaders'
import { useTableContext } from '../TableProvider'
import { flexRender } from '@tanstack/react-table'

const StyledTableHeader = styled(TableHead)<TableHeadProps>(() => ({
  display: 'flex',
  position: 'sticky',
  top: -1,
  zIndex: 5
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  display: 'flex',
  backgroundColor: theme.palette.primary.light
}))

type depth = number
type HeadersProps = { depth?: depth }

const Headers = ({ depth }: HeadersProps): JSX.Element => {
  const theme = useTheme()
  const { visibleDepthRow } = useTableContext()

  const headers = useHeaders({ depth: depth || visibleDepthRow })

  return (
    <StyledTableHeader component={Box}>
      <Box style={{ width: '20px', backgroundColor: theme.palette.primary.light }} />
      {headers.map((header) => (
        <StyledTableCell key={header.id} component={Box} colSpan={header.colSpan}>
          <Box style={{ width: header.getSize(), overflow: 'hidden' }}>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </Box>
        </StyledTableCell>
      ))}
    </StyledTableHeader>
  )
}

export default Headers
