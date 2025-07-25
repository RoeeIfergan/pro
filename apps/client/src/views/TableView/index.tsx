import { Box, Typography } from '@mui/material'
import Table from '@pro2/Table'
import { useMemo } from 'react'
import { makeData } from './makeData'
import { getColumns } from './columns'

const viewableEntities = ['demands', 'collectionTargets', 'pirs']
const TableView = () => {
  const data = useMemo(() => makeData(3, 3, 3, false, viewableEntities), [])
  const columns = useMemo(() => getColumns(viewableEntities), [])

  return (
    <Box>
      <Typography>Table View</Typography>
      <Table
        // width={1200}
        height={800}
        data={data}
        // reverseColumns
        columns={columns}
      />
    </Box>
  )
}

export default TableView
