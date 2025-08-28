import React from 'react'
import { Box, Stack, Chip, Typography, TextField, FormControlLabel, Switch } from '@mui/material'
import { DragEndEvent } from '@dnd-kit/core'
import { FieldComponentType, type ILayoutField, type IOption } from '../../../../DynamicForm/types'
import { DND_CARD_BUILDER_LABELS } from '../../../utils/constants'
import { useDNDCardBuilderContext } from '../../../utils/context'
import ItemsList from '../ItemsList/ItemsList'
import { arrayMove } from '@dnd-kit/sortable'

export interface SortableOptionsManagerProps {
  localField: ILayoutField
  options?: IOption[]
  onFieldChange: (updater: (prev: ILayoutField | null) => ILayoutField | null) => void
}

const SortableOptionsManager: React.FC<SortableOptionsManagerProps> = ({
  options = [],
  localField,
  onFieldChange
}) => {
  const { navigateToEditOption, editingField } = useDNDCardBuilderContext()

  const onChange = (newOptions: IOption[]) => {
    onFieldChange((prev) =>
      prev
        ? ({
            ...prev,
            options: {
              ...(prev as { options?: { values?: IOption[] } }).options,
              values: newOptions
            }
          } as ILayoutField)
        : prev
    )
  }

  const handleAddOption = () => {
    const newOption: IOption = {
      value: `option_${options.length + 1}`,
      label: `Option ${options.length + 1}`
    }
    onChange([...options, newOption])
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) {
      return
    }

    if (over && active.id !== over.id) {
      const oldIndex = options.findIndex(({ value }) => value === active.id)
      const newIndex = options.findIndex(({ value }) => value === over.id)

      onChange(arrayMove(options, oldIndex, newIndex))
    }
  }

  const handleRemoveOption = (itemIndex: number) => {
    const newOptions = [...options.slice(0, itemIndex), ...options.slice(itemIndex + 1)]
    onChange(newOptions)
  }

  const handleEditOption = (itemIndex: number) => {
    if (editingField && navigateToEditOption) {
      navigateToEditOption({
        rowIndex: editingField.rowIndex,
        fieldIndex: editingField.fieldIndex,
        optionIndex: itemIndex
      })
    }
  }

  return (
    <ItemsList
      renderHeader={
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ sm: 'center' }}>
          {localField.component === FieldComponentType.select && (
            <TextField
              label={DND_CARD_BUILDER_LABELS.PLACEHOLDER}
              value={(localField as { placeholder?: string }).placeholder ?? ''}
              onChange={(e) =>
                onFieldChange((prev) =>
                  prev
                    ? ({
                        ...prev,
                        placeholder: e.target.value
                      } as ILayoutField)
                    : prev
                )
              }
              placeholder={DND_CARD_BUILDER_LABELS.SELECT_PLACEHOLDER}
              fullWidth
              helperText={DND_CARD_BUILDER_LABELS.SELECT_PLACEHOLDER_HELPER}
              sx={{ flex: 1 }}
            />
          )}

          <FormControlLabel
            control={
              <Switch
                checked={(localField as { multiple?: boolean }).multiple || false}
                onChange={(e) =>
                  onFieldChange((prev) =>
                    prev
                      ? ({
                          ...prev,
                          multiple: e.target.checked
                        } as ILayoutField)
                      : prev
                  )
                }
              />
            }
            label={DND_CARD_BUILDER_LABELS.ALLOW_MULTIPLE}
            sx={{
              minWidth: 'fit-content',
              '& .MuiFormControlLabel-label': {
                fontSize: '0.875rem'
              }
            }}
          />
        </Stack>
      }
      items={options.map(({ value }) => value as string)}
      onAddItem={handleAddOption}
      addItemLabel={DND_CARD_BUILDER_LABELS.ADD_FIELD}
      onDragEnd={handleDragEnd}
      onDeleteItem={handleRemoveOption}
      onEditItem={handleEditOption}
      renderLabel={(itemIndex) => {
        const option = options[itemIndex] as IOption

        return (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack
              direction='row'
              alignItems='center'
              spacing={1}
              sx={{
                flexWrap: 'wrap',
                gap: 1
              }}
            >
              <Typography variant='body2' noWrap>
                {String(option.label)}
              </Typography>

              <Chip
                label={String(option.value)}
                size='small'
                color='primary'
                variant='outlined'
                sx={{ fontSize: '0.75rem' }}
              />

              {option.icon && (
                <Chip
                  label={option.icon}
                  size='small'
                  color='error'
                  variant='outlined'
                  sx={{ fontSize: '0.75rem' }}
                />
              )}

              {option.badge && (
                <Chip
                  label={option.badge.text}
                  size='small'
                  color={option.badge.color || 'default'}
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
            </Stack>
          </Box>
        )
      }}
      emptyListMessage='אין אפשרויות'
    />
  )
}

export default SortableOptionsManager
