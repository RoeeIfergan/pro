import { Box, Typography } from '@mui/material'
import { useState, useCallback } from 'react'
import { PTable } from '@pro3/Table'
import { usePersons, usePersonsColumns, Person } from './usePersons'
import CarsTable from './CarsTable'

const TableView = () => {
  const { data, isLoading, hasNext, loadMore } = usePersons()
  const columns = usePersonsColumns()

  const [selected, setSelected] = useState({})
  const [columnOrder, setColumnOrder] = useState<string[]>([])
  const [columnPinning, setColumnPinning] = useState<{ left?: string[]; right?: string[] }>({})
  const [columnGrouping, setColumnGrouping] = useState<string[]>([])
  const [columnVisibility, setColumnVisibility] = useState<{ [key: string]: boolean }>({})

  const handleRowClick = useCallback((row: { original: Person }) => {
    console.log('Row clicked:', row.original)
  }, [])

  const handleDoubleClick = useCallback((row: { original: Person }) => {
    console.log('Row double clicked:', row.original)
  }, [])

  const renderSubComponent = useCallback(({ row }: { row: { original: Person } }) => {
    return (
      <Box sx={{ pl: 2 }}>
        <Typography variant='h6' gutterBottom>
          Cars for {row.original.firstName} {row.original.lastName}
        </Typography>
        <CarsTable />
      </Box>
    )
  }, [])

  const getRowCanExpand = useCallback((_row: { original: Person }) => {
    // Only allow expansion for rows where age is even (just as an example)
    return true
  }, [])

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <Typography variant='h4' p={2}>
        Advanced Table Demo with PTable
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <PTable<Person>
          data={data}
          columns={columns}
          selected={selected}
          setSelected={setSelected}
          isLoading={isLoading}
          loadMore={loadMore}
          hasNext={hasNext}
          onClickRow={handleRowClick}
          onDoubleClickRow={handleDoubleClick}
          columnOrder={columnOrder}
          setColumnOrder={setColumnOrder}
          columnPinning={columnPinning}
          setColumnPinning={setColumnPinning}
          columnGrouping={columnGrouping}
          setColumnGrouping={setColumnGrouping}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          enableRowSelection
          enableColumnResizing
          enableGrouping
          enableColumnPinning
          enableSorting
          renderSubComponent={renderSubComponent}
          getRowCanExpand={getRowCanExpand}
        />
      </Box>
    </Box>
  )
}

export default TableView
