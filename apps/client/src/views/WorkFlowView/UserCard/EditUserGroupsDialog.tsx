import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Autocomplete,
  TextField
} from '@mui/material'
import { GetUserGroupSchemaDTO } from '@pro3/schemas'

interface EditUserGroupsDialogProps {
  open: boolean
  onClose: () => void
  onSave: (selectedGroups: string[]) => void
  userGroups: GetUserGroupSchemaDTO[]
  currentUserGroups: GetUserGroupSchemaDTO[]
}

export function EditUserGroupsDialog({
  open,
  onClose,
  onSave,
  userGroups,
  currentUserGroups
}: EditUserGroupsDialogProps) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>(
    currentUserGroups.map((group) => group.id)
  )

  const handleSave = () => {
    onSave(selectedGroups)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Edit User Groups</DialogTitle>
      <DialogContent>
        <Autocomplete
          multiple
          id='user-groups-select'
          options={userGroups}
          value={userGroups.filter((group) => selectedGroups.includes(group.id))}
          onChange={(_, newValue) => {
            setSelectedGroups(newValue.map((group) => group.id))
          }}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField {...params} label='User Groups' placeholder='Select groups' />
          )}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option.id}
                label={option.name}
                size='small'
                sx={{
                  height: 24,
                  marginY: 0.25
                }}
              />
            ))
          }
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant='contained' color='primary'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
