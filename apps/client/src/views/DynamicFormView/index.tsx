import { Box, MenuItem, Select, Typography } from '@mui/material'
import DynamicForm, { getCollections, ICollection } from '@pro3/DynamicForm'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

const DynamicFormView = () => {
  const queryClient = useQueryClient()
  const collections = useMemo(() => getCollections(queryClient), [queryClient])
  const [collection, setCollection] = useState<ICollection>(collections[0])

  return (
    <Box p={3}>
      <Typography variant='h4' p={2}>
        Card View
      </Typography>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            width: '100%',
            backgroundColor: '#353535',
            borderRadius: '5px'
          }}
        >
          <Select
            value={collection.name}
            onChange={(e) => setCollection(collections.find((c) => c.name === e.target.value))}
          >
            {collections.map((collection) => (
              <MenuItem key={collection.name} value={collection.name}>
                {collection.name}
              </MenuItem>
            ))}
          </Select>

          <DynamicForm key={collection.name} collection={collection} />
        </Box>
      </Box>
    </Box>
  )
}

export default DynamicFormView
