import { Box, Typography, Button } from '@mui/material'
import { useMemo, useState, useCallback } from 'react'
import { PTable } from '@pro3/Table'
import { createColumnHelper } from '@tanstack/react-table'

// Simple example data type
interface Person {
  id: number
  firstName: string
  lastName: string
  age: number
  email: string
  city: string
  phone: string
  department: string
  position: string
  salary: number
  hireDate: string
  manager: string
  country: string
  zipCode: string
  address: string
  company: string
  experience: number
  status: string
  skills: string
  notes: string
  subRows?: Person[]
}

// Generate sample data
const generateData = (count: number): Person[] => {
  const data: Person[] = []

  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations']
  const positions = ['Developer', 'Manager', 'Analyst', 'Coordinator', 'Director', 'Specialist']
  const statuses = ['Active', 'Inactive', 'On Leave', 'Terminated']
  const countries = ['USA', 'Canada', 'UK', 'Germany', 'France']
  const companies = ['TechCorp', 'DataSys', 'InnovateLab', 'GlobalTech', 'NextGen']
  const skills = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'TypeScript']

  for (let i = 0; i < count; i++) {
    const person: Person = {
      id: i + 1,
      firstName: `First${i + 1}`,
      lastName: `Last${i + 1}`,
      age: 20 + (i % 50),
      email: `user${i + 1}@example.com`,
      city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][i % 5],
      phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      department: departments[i % departments.length],
      position: positions[i % positions.length],
      salary: 50000 + (i % 20) * 5000,
      hireDate: new Date(2020 + (i % 4), i % 12, (i % 28) + 1).toISOString().split('T')[0],
      manager: `Manager${(i % 10) + 1}`,
      country: countries[i % countries.length],
      zipCode: String(10000 + (i % 90000)),
      address: `${i + 1} Main St, Suite ${i % 100}`,
      company: companies[i % companies.length],
      experience: 1 + (i % 20),
      status: statuses[i % statuses.length],
      skills: skills.slice(0, (i % 4) + 1).join(', '),
      notes: `Notes for employee ${i + 1}`
    }
    data.push(person)
  }

  return data
}

const columnHelper = createColumnHelper<Person>()

const TableView = () => {
  const [data, setData] = useState(() => generateData(100))
  const [isLoading, setIsLoading] = useState(false)
  const [hasNext, setHasNext] = useState(true)
  const [selected, setSelected] = useState({})
  const [columnOrder, setColumnOrder] = useState<string[]>([])
  const [columnPinning, setColumnPinning] = useState<{ left?: string[]; right?: string[] }>({})
  const [columnGrouping, setColumnGrouping] = useState<string[]>([])
  const [columnVisibility, setColumnVisibility] = useState<{ [key: string]: boolean }>({})

  const columns = useMemo(
    () => [
      columnHelper.accessor('firstName', {
        header: 'First Name',
        size: 120,
        enableGrouping: true
      }),
      columnHelper.accessor('lastName', {
        header: 'Last Name',
        size: 120,
        enableGrouping: true
      }),
      columnHelper.accessor('age', {
        header: 'Age',
        size: 80,
        enableGrouping: true
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        size: 180
      }),
      columnHelper.accessor('city', {
        header: 'City',
        size: 120,
        enableGrouping: true
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        size: 140
      }),
      columnHelper.accessor('department', {
        header: 'Department',
        size: 120,
        enableGrouping: true
      }),
      columnHelper.accessor('position', {
        header: 'Position',
        size: 120,
        enableGrouping: true
      }),
      columnHelper.accessor('salary', {
        header: 'Salary',
        size: 100,
        cell: (info) => `$${info.getValue().toLocaleString()}`,
        enableGrouping: true
      }),
      columnHelper.accessor('hireDate', {
        header: 'Hire Date',
        size: 120
      }),
      columnHelper.accessor('manager', {
        header: 'Manager',
        size: 120,
        enableGrouping: true
      }),
      columnHelper.accessor('country', {
        header: 'Country',
        size: 100,
        enableGrouping: true
      }),
      columnHelper.accessor('zipCode', {
        header: 'Zip Code',
        size: 100
      }),
      columnHelper.accessor('address', {
        header: 'Address',
        size: 200
      }),
      columnHelper.accessor('company', {
        header: 'Company',
        size: 120,
        enableGrouping: true
      }),
      columnHelper.accessor('experience', {
        header: 'Experience',
        size: 100,
        cell: (info) => `${info.getValue()} years`,
        enableGrouping: true
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        size: 100,
        enableGrouping: true
      }),
      columnHelper.accessor('skills', {
        header: 'Skills',
        size: 200
      }),
      columnHelper.accessor('notes', {
        header: 'Notes',
        size: 150
      })
    ],
    []
  )

  const loadMore = useCallback(() => {
    if (isLoading || !hasNext) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const newData = generateData(50)
      const startId = data.length + 1
      const updatedData = newData.map((item, index) => ({
        ...item,
        id: startId + index
      }))

      setData((prev) => [...prev, ...updatedData])
      setIsLoading(false)

      // Stop loading more after 500 items
      if (data.length > 500) {
        setHasNext(false)
      }
    }, 1000)
  }, [isLoading, hasNext, data.length])

  const handleRowClick = useCallback((row: { original: Person }) => {
    console.log('Row clicked:', row.original)
  }, [])

  const handleDoubleClick = useCallback((row: { original: Person }) => {
    console.log('Row double clicked:', row.original)
  }, [])

  const renderSubComponent = useCallback(({ row }: { row: { original: Person } }) => {
    return (
      <Box sx={{ p: 2, backgroundColor: 'grey.100' }}>
        <Typography variant='h6' gutterBottom>
          Details for {row.original.firstName} {row.original.lastName}
        </Typography>
        <pre style={{ fontSize: '12px', margin: 0 }}>{JSON.stringify(row.original, null, 2)}</pre>
      </Box>
    )
  }, [])

  const getRowCanExpand = useCallback((_row: { original: Person }) => {
    // Only allow expansion for rows where age is even (just as an example)
    return true
  }, [])

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant='h4' p={2}>
        Advanced Table Demo with PTable
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant='outlined'
          size='small'
          onClick={() => setColumnVisibility((prev) => ({ ...prev, age: !prev.age }))}
        >
          Toggle Age Column
        </Button>
        <Button
          variant='outlined'
          size='small'
          onClick={() =>
            setColumnGrouping((prev) =>
              prev.includes('department')
                ? prev.filter((id) => id !== 'department')
                : [...prev, 'department']
            )
          }
        >
          Toggle Department Grouping
        </Button>
        <Button
          variant='outlined'
          size='small'
          onClick={() =>
            setColumnPinning((prev) => ({
              ...prev,
              left: prev.left?.includes('firstName') ? [] : ['firstName']
            }))
          }
        >
          Toggle Pin First Name
        </Button>
        <Button
          variant='outlined'
          size='small'
          onClick={() => setColumnVisibility((prev) => ({ ...prev, salary: !prev.salary }))}
        >
          Toggle Salary Column
        </Button>
        <Button
          variant='outlined'
          size='small'
          onClick={() =>
            setColumnGrouping((prev) =>
              prev.includes('status') ? prev.filter((id) => id !== 'status') : [...prev, 'status']
            )
          }
        >
          Toggle Status Grouping
        </Button>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <PTable
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
