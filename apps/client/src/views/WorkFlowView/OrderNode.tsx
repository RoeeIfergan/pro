import { Handle, Position } from '@xyflow/react'
import { Box, Chip, Divider, Stack, Typography } from '@mui/material'
import { useStepUserGroups } from '../../hooks/stepUserGroups'
import { useStepOrders } from '../../hooks/stepOrders'

interface UserGroup {
  id: string
  name: string
}

interface Order {
  id: string
  name: string
}

interface NodeData {
  id: string
  name: string
  label: string
}

const OrderNode = ({ data }: { data: NodeData }) => {
  const { data: userGroups } = useStepUserGroups(data.id)
  const { data: orders } = useStepOrders(data.id)

  return (
    <Box
      sx={{
        background: 'white',
        color: 'black',
        padding: 1,
        borderRadius: 1,
        border: '1px solid #ccc',
        minWidth: 250
      }}
    >
      <Handle type='target' position={Position.Top} />
      <Handle type='source' position={Position.Bottom} />
      <Stack spacing={1}>
        <Typography variant='subtitle1'>{data.name}</Typography>

        <Box>
          <Typography variant='caption' color='textSecondary'>
            User Groups:
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
            {(userGroups as UserGroup[])?.map((group: UserGroup) => (
              <Chip key={group.id} label={group.name} size='small' color='primary' />
            ))}
          </Box>
        </Box>

        <Divider />

        <Box>
          <Typography variant='caption' color='textSecondary'>
            Orders:
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
            {(orders as Order[])?.map((order: Order) => (
              <Chip key={order.id} label={order.name} size='small' color='secondary' />
            ))}
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}

export default OrderNode
