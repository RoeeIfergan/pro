import { Box, styled, TableCell, TableHead } from '@mui/material'
import useHeaders from './useHeaders'
import { useTableContext } from '../TableProvider'
import { flexRender } from '@tanstack/react-table'

const StyledTableHeader = styled(TableHead, {
  shouldForwardProp: (prop) => prop !== 'depth'
})(({ depth }) => ({
  display: 'flex',
  position: 'sticky',
  top: 0
  // marginLeft: `${20 * depth}px`
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  display: 'flex',
  backgroundColor: theme.palette.primary.light
}))

type depth = number
type HeadersProps = { depth?: depth }

const Headers = ({ depth }: HeadersProps): JSX.Element => {
  const { visibleDepthRow } = useTableContext()

  const headers = useHeaders({ depth: depth || visibleDepthRow })

  return (
    <Box style={{ display: 'flex', flexDirection: 'row' }}>
      {/* <RowIndent depth={depth} /> */}
      <StyledTableHeader component={Box} depth={depth || 0}>
        {headers.map((header) => (
          <StyledTableCell
            key={header.id}
            component={Box}
            colSpan={header.colSpan}
          >
            <Box style={{ width: header.getSize() }}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </Box>
          </StyledTableCell>
        ))}
      </StyledTableHeader>
    </Box>
  )
}

export default Headers
