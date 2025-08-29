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
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import BlockIcon from '@mui/icons-material/Block'
import { useUsers, useUser, useUpdateUserGroups, useUserOrders } from '../../../hooks/users'
import { useUserGroups } from '../../../hooks/userGroups'
import { useEffect, useState } from 'react'
import { EditUserGroupsDialog } from './EditUserGroupsDialog'
import EditIcon from '@mui/icons-material/Edit'
import { useReactFlow } from '@xyflow/react'
import { useApproveOrders, useRejectOrders } from '../../../hooks/userOrders'

interface Order {
  id: string
  name: string
  type: string
  stepId: string
  createdAt: string
  updatedAt: string
}

const UserCard = () => {
  const { fitView } = useReactFlow()
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { data: users, isLoading: isLoadingUsers } = useUsers()
  const { data: selectedUser } = useUser(selectedUserId)
  const { data: userGroups, isLoading: isLoadingGroups } = useUserGroups()
  const { data: userOrders, isLoading: isLoadingOrders } = useUserOrders(selectedUserId)
  const { mutate: approveOrders, isPending: isApproving } = useApproveOrders()
  const { mutate: rejectOrders, isPending: isRejecting } = useRejectOrders()
  const { mutate: updateUserGroups, isPending: isUpdating } = useUpdateUserGroups()

  console.log({ userGroups, userOrders, selectedUser })

  useEffect(() => {
    if (!selectedUser) return
    const nodeIds = selectedUser.stepsIds.map((stepId: string) => ({ id: stepId }))

    console.log({ nodeIds: selectedUser.stepsIds })
    fitView({ nodes: nodeIds, duration: 500 })
  }, [fitView, selectedUser])

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId)
  }

  const handleEditGroups = () => {
    setIsEditDialogOpen(true)
  }

  const handleSaveGroups = (groupIds: string[]) => {
    if (selectedUserId) {
      updateUserGroups({ userId: selectedUserId, groupIds })
    }
  }

  const loading =
    isLoadingUsers || isLoadingGroups || isLoadingOrders || isUpdating || isApproving || isRejecting

  // console.log(selectedUser)
  console.log(userOrders)

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 500,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
                <strong>Name:</strong> {selectedUser?.name}
              </Typography>
              <Typography variant='body1'>
                <strong>Organization ID:</strong> {selectedUser.organizationId}
              </Typography>
            </Box>

            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1
                }}
              >
                <Typography variant='body1'>
                  <strong>User Groups:</strong>
                </Typography>
                <IconButton
                  size='small'
                  onClick={handleEditGroups}
                  disabled={loading || !selectedUserId}
                >
                  <EditIcon fontSize='small' />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {selectedUser?.userGroups?.length > 0 ? (
                  selectedUser.userGroups.map((group) => {
                    return (
                      <Chip
                        key={group.id}
                        label={group.name || 'Loading...'}
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
              {userGroups && selectedUser && (
                <EditUserGroupsDialog
                  open={isEditDialogOpen}
                  onClose={() => setIsEditDialogOpen(false)}
                  onSave={handleSaveGroups}
                  userGroups={userGroups}
                  currentUserGroups={selectedUser.userGroups || []}
                />
              )}
            </Box>

            <Divider sx={{ my: 2 }} />
            <Typography variant='h6' gutterBottom>
              Accessible Orders
            </Typography>
            <List
              sx={{
                flex: 1,
                maxHeight: 200,
                overflowY: 'auto',
                '& .MuiListItem-root': {
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': {
                    borderBottom: 'none'
                  }
                }
              }}
            >
              {userOrders?.map((order: Order) => (
                <ListItem
                  key={order.id}
                  secondaryAction={
                    <Box>
                      <IconButton
                        size='small'
                        color='error'
                        onClick={() => rejectOrders({ userId: selectedUserId, ids: [order.id] })}
                        disabled={loading}
                      >
                        <BlockIcon />
                      </IconButton>
                      <IconButton
                        size='small'
                        onClick={() => approveOrders({ userId: selectedUserId, ids: [order.id] })}
                        disabled={loading}
                      >
                        <SendIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText primary={order.name} />
                </ListItem>
              ))}
              {(!userOrders || userOrders.length === 0) && (
                <ListItem>
                  <ListItemText primary='No orders available' sx={{ color: 'text.secondary' }} />
                </ListItem>
              )}
            </List>
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
