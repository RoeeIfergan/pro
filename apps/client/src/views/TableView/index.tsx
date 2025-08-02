import { Box, Typography } from '@mui/material'
import { useMemo } from 'react'
import { makeData } from './makeData'
import { createComputedColumns } from './columns'
import Table from '@pro3/Table'

const viewableEntities = ['demands', 'collectionTargets', 'pirs']
const TableView = () => {
  const data = useMemo(() => makeData(25, 25, 25, false, viewableEntities), [])
  const columns = useMemo(() => createComputedColumns(viewableEntities), [])

  return (
    <Box p={3}>
      <Typography variant='h4' p={2}>
        Table View
      </Typography>
      <Table
        height={800}
        data={data}
        // reverseColumns
        columns={columns}
      />
    </Box>
  )
}

export default TableView
