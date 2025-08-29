import { Box, Typography } from '@mui/material'
import { TOrder } from '@pro3/types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const HomepageView = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await axios.get<TOrder[]>('http://localhost:3000/api/orders')

      return data
    }
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <Box p={3}>
      <Typography variant='h4' p={2}>
        Homepage View
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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '500px',
            backgroundColor: '#353535',
            borderRadius: '5px'
          }}
        >
          {data.map((item) => (
            <Box>{item.name}</Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default HomepageView
