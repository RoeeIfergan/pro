import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Divider,
  Chip
} from '@mui/material'
import { useUsers, useUser } from '../../../hooks/users'
import { useUserGroups } from '../../../hooks/userGroups'
import { useUserOrders } from '../../../hooks/userOrders'
import { useState } from 'react'

interface Order {
  id: string
  name: string
  type: string
  stepId: string
  createdAt: string
  updatedAt: string
}

const UserCard = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const { data: users, isLoading: isLoadingUsers } = useUsers()
  const { data: selectedUser } = useUser(selectedUserId)
  const { data: userGroups, isLoading: isLoadingGroups } = useUserGroups()
  const { data: userOrders, isLoading: isLoadingOrders } = useUserOrders(selectedUserId)
  const { isPending: isUpdating } = { isPending: false }

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId)
  }

  const loading = isLoadingUsers || isLoadingGroups || isLoadingOrders || isUpdating

  console.log(selectedUser)

  return (
    <Card sx={{ minWidth: 275, maxWidth: 500, m: 2 }}>
      <CardContent>
        <Typography variant='h5' component='div' gutterBottom>
          User Selection
        </Typography>

        <FormControl fullWidth margin='normal'>
          <InputLabel id='user-select-label'>Select User</InputLabel>
          <Select
            labelId='user-select-label'
            id='user-select'
            value={selectedUser?.id || ''}
            label='Select User'
            onChange={(e) => handleUserChange(e.target.value as string)}
            disabled={loading}
          >
            {users?.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedUser && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant='h6' gutterBottom>
              User Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant='body1'>
                <strong>Name:</strong> {selectedUser.name}
              </Typography>
              <Typography variant='body1'>
                <strong>Organization ID:</strong> {selectedUser.organizationId}
              </Typography>
            </Box>

            <Box>
              <Typography variant='body1' gutterBottom>
                <strong>User Groups:</strong>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {selectedUser?.userGroupIds?.length > 0 ? (
                  selectedUser.userGroupIds.map((groupId: string) => {
                    const group = userGroups?.find((g) => g.id === groupId)
                    return (
                      <Chip
                        key={groupId}
                        label={group?.name || 'Loading...'}
                        size='small'
                        color='primary'
                        variant='outlined'
                      />
                    )
                  })
                ) : (
                  <Typography variant='body2' color='text.secondary'>
                    No user groups assigned
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />
            <Typography variant='h6' gutterBottom>
              Accessible Orders
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {userOrders?.map((order: Order) => (
                <Box key={order.id} sx={{ p: 1, borderRadius: 1 }}>
                  <Typography variant='body2'>
                    <strong>{order.name}</strong>
                  </Typography>
                  <Typography variant='caption' color='textSecondary'>
                    Type: {order.type}
                  </Typography>
                </Box>
              ))}
              {userOrders?.length === 0 && (
                <Typography variant='body2' color='textSecondary'>
                  No orders available
                </Typography>
              )}
            </Box>
          </>
        )}

        {loading && (
          <Box sx={{ mt: 2 }}>
            <Typography>Loading...</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default UserCard
