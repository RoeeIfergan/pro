import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Stack,
  Chip
} from '@mui/material'
import { Delete, Edit } from '@mui/icons-material'
import { useScreens } from '../../hooks/screens'

interface ScreensTableProps {
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export default function ScreensTable(props: ScreensTableProps) {
  const { data } = useScreens({})

  return (
    <TableContainer component={Paper} variant='outlined'>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Fields</TableCell>
            <TableCell align='right'></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component='th' scope='row'>
                {row.id}
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                {row.fieldConfigs.map((fieldConfig) => (
                  <Chip sx={{ mr: 0.5 }} key={fieldConfig.fieldId} label={fieldConfig.field.name} />
                ))}
              </TableCell>
              <TableCell align='right'>
                <Stack gap={1} direction='row' justifyContent='flex-end'>
                  <IconButton size='small' onClick={() => props.onEdit(row.id)}>
                    <Edit />
                  </IconButton>
                  <IconButton size='small' onClick={() => props.onDelete(row.id)}>
                    <Delete />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
