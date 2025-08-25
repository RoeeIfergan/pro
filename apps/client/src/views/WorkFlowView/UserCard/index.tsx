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
  OutlinedInput,
  Chip,
  SelectChangeEvent
} from '@mui/material'
import { useUsers, useUser, useUpdateUser } from '../../../hooks/users'
import { useUserGroups } from '../../../hooks/userGroups'
import { useUserOrders } from '../../../hooks/userOrders'
import { useState } from 'react'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

const UserCard = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const { data: users, isLoading: isLoadingUsers } = useUsers()
  const { data: selectedUser } = useUser(selectedUserId)
  const { data: userGroups, isLoading: isLoadingGroups } = useUserGroups()
  const { data: userOrders, isLoading: isLoadingOrders } = useUserOrders(selectedUserId)
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser()

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId)
  }

  const handleUserGroupsChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value }
    } = event

    const selectedGroups = typeof value === 'string' ? value.split(',') : value

    if (selectedUser) {
      updateUser({
        userId: selectedUser.id,
        data: {
          ...selectedUser,
          userGroupIds: selectedGroups
        }
      })
    }
  }

  const loading = isLoadingUsers || isLoadingGroups || isLoadingOrders || isUpdating

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

            <FormControl fullWidth>
              <InputLabel id='user-groups-label'>User Groups</InputLabel>
              <Select
                labelId='user-groups-label'
                id='user-groups'
                multiple
                value={selectedUser?.userGroupIds || []}
                onChange={handleUserGroupsChange}
                input={<OutlinedInput label='User Groups' />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((groupId: string) => {
                      const group = userGroups?.find((g) => g.id === groupId)
                      return <Chip key={groupId} label={group?.name || groupId} size='small' />
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
                disabled={loading}
              >
                {userGroups?.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ my: 2 }} />
            <Typography variant='h6' gutterBottom>
              Accessible Orders
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {userOrders?.map((order: any) => (
                <Box key={order.id} sx={{ p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
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
