import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Stack
} from '@mui/material'
import { FieldComponentType, UnknownRecord } from '../../lib/types'
import { ILayoutFieldWithIds } from '../types'
import { create, InstanceProps } from 'react-modal-promise'
import { DNDCardBuilderContextType } from '../utils/context'

export interface EditFieldDialogProps extends InstanceProps<void> {
  field: ILayoutFieldWithIds | null
  rowIndex: number
  context: DNDCardBuilderContextType
}

const EditFieldDialog: React.FC<EditFieldDialogProps> = ({
  isOpen,
  onReject,
  onResolve,
  field,
  rowIndex,
  context
}) => {
  const { fieldPathOptions, setUiSchema } = context

  const [localField, setLocalField] = useState<ILayoutFieldWithIds<UnknownRecord> | null>(
    (field as ILayoutFieldWithIds<UnknownRecord>) ?? null
  )

  const handleSave = () => {
    if (!localField) return
    setUiSchema((prev) => ({
      ...prev,
      layout: prev.layout.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              fields: row.fields.map((fieldItem) =>
                fieldItem._id === field?._id ? { ...fieldItem, ...localField } : fieldItem
              )
            }
          : row
      )
    }))

    onResolve()
    onReject()
  }

  const handleCancel = () => {
    onReject()
  }

  if (!field || !localField) {
    return null
  }

  return (
    <Dialog open={isOpen} onClose={handleCancel} maxWidth='sm' fullWidth>
      <DialogTitle>Edit Field</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ pt: 2 }}>
          <TextField
            label='שם השדה (תווית)'
            value={localField.label ?? ''}
            onChange={(e) =>
              setLocalField((prev) =>
                prev
                  ? ({ ...prev, label: e.target.value } as ILayoutFieldWithIds<UnknownRecord>)
                  : prev
              )
            }
            placeholder='הכנס תווית לשדה...'
            fullWidth
            helperText='זה יוצג כתווית השדה'
          />

          <Autocomplete
            freeSolo
            options={fieldPathOptions}
            value={String(localField.path ?? '')}
            onChange={(_, newValue) => {
              if (typeof newValue === 'string') {
                setLocalField((prev) =>
                  prev ? ({ ...prev, path: newValue } as ILayoutFieldWithIds<UnknownRecord>) : prev
                )
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Field Path'
                onBlur={(e) =>
                  setLocalField((prev) =>
                    prev
                      ? ({ ...prev, path: e.target.value } as ILayoutFieldWithIds<UnknownRecord>)
                      : prev
                  )
                }
                fullWidth
              />
            )}
          />

          <FormControl fullWidth>
            <InputLabel>Component Type</InputLabel>
            <Select
              value={localField.component}
              label='Component Type'
              onChange={(e) =>
                setLocalField((prev) =>
                  prev
                    ? ({
                        ...prev,
                        component: e.target.value as FieldComponentType
                      } as ILayoutFieldWithIds<UnknownRecord>)
                    : prev
                )
              }
            >
              {Object.values(FieldComponentType).map((ct) => (
                <MenuItem key={ct} value={ct}>
                  {ct}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} variant='contained' color='primary'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export const openEditFieldDialog = create(EditFieldDialog)

export default EditFieldDialog
