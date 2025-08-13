import { Box, Typography } from '@mui/material'
import { useState, useCallback } from 'react'
import { PTable } from '@pro3/Table'
import { useCars, useCarsColumns, Car } from './useCars'

const CarsTable = () => {
  const { data, isLoading, hasNext, loadMore } = useCars()
  const columns = useCarsColumns()

  const [selected, setSelected] = useState({})
  const [columnOrder, setColumnOrder] = useState<string[]>([])
  const [columnPinning, setColumnPinning] = useState<{ left?: string[]; right?: string[] }>({})
  const [columnGrouping, setColumnGrouping] = useState<string[]>([])
  const [columnVisibility, setColumnVisibility] = useState<{ [key: string]: boolean }>({})

  const handleRowClick = useCallback((row: { original: Car }) => {
    console.log('Car clicked:', row.original)
  }, [])

  const handleDoubleClick = useCallback((row: { original: Car }) => {
    console.log('Car double clicked:', row.original)
  }, [])

  const renderSubComponent = useCallback(({ row }: { row: { original: Car } }) => {
    return (
      <Box sx={{ p: 2, backgroundColor: 'grey.100' }}>
        <Typography variant='h6' gutterBottom>
          Details for {row.original.year} {row.original.make} {row.original.model}
        </Typography>
        <pre style={{ fontSize: '12px', margin: 0 }}>{JSON.stringify(row.original, null, 2)}</pre>
      </Box>
    )
  }, [])

  const getRowCanExpand = useCallback((_row: { original: Car }) => {
    return true
  }, [])

  return (
    <PTable<Car>
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
  )
}

export default CarsTable
