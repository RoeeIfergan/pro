import React from 'react'
import { Box, Button, Typography, Stack, Paper, Alert, Divider } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import type { IOption } from '../../../lib/types'
import { DND_CARD_BUILDER_LABELS } from '../../utils/constants'
import OptionEditor from './OptionEditor'

export interface OptionsManagerProps {
  options?: IOption[]
  onChange: (options: IOption[]) => void
}

const OptionsManager: React.FC<OptionsManagerProps> = ({ options = [], onChange }) => {
  const handleAddOption = () => {
    const newOption: IOption = {
      value: `option_${options.length + 1}`,
      label: `Option ${options.length + 1}`
    }

    onChange([...options, newOption])
  }

  const handleUpdateOption = (index: number, updatedOption: IOption) => {
    const newOptions = [...options]
    newOptions[index] = updatedOption
    onChange(newOptions)
  }

  const handleDeleteOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    onChange(newOptions)
  }

  const handleMoveOption = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= options.length) return

    const newOptions = [...options]
    const [movedOption] = newOptions.splice(fromIndex, 1)
    newOptions.splice(toIndex, 0, movedOption)
    onChange(newOptions)
  }

  return (
    <Box>
      <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ mb: 2 }}>
        <Typography variant='subtitle1' fontWeight='medium'>
          {DND_CARD_BUILDER_LABELS.OPTIONS_COUNT(options.length)}
        </Typography>

        <Button startIcon={<AddIcon />} variant='contained' size='small' onClick={handleAddOption}>
          {DND_CARD_BUILDER_LABELS.ADD_OPTION}
        </Button>
      </Stack>

      {options.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
          <Typography color='text.secondary' sx={{ mb: 2 }}>
            {DND_CARD_BUILDER_LABELS.NO_OPTIONS_YET}
          </Typography>
          <Button startIcon={<AddIcon />} variant='outlined' onClick={handleAddOption}>
            {DND_CARD_BUILDER_LABELS.ADD_FIRST_OPTION}
          </Button>
        </Paper>
      ) : (
        <Stack spacing={1}>
          {/* Info message for first few options */}
          {options.length <= 2 && (
            <Alert severity='info' sx={{ mb: 2 }}>
              <Typography variant='body2'>
                <strong>טיפ:</strong> {DND_CARD_BUILDER_LABELS.OPTIONS_TIP}
              </Typography>
            </Alert>
          )}

          {options.map((option, index) => (
            <Box key={`${option.value}_${index}`}>
              <OptionEditor
                option={option}
                index={index}
                onUpdate={handleUpdateOption}
                onDelete={handleDeleteOption}
              />

              {/* Move buttons - you could enhance this with drag & drop later */}
              {options.length > 1 && (
                <Stack direction='row' spacing={1} justifyContent='center' sx={{ mb: 1, mt: -1 }}>
                  <Button
                    size='small'
                    variant='text'
                    onClick={() => handleMoveOption(index, index - 1)}
                    disabled={index === 0}
                  >
                    {DND_CARD_BUILDER_LABELS.MOVE_UP}
                  </Button>
                  <Button
                    size='small'
                    variant='text'
                    onClick={() => handleMoveOption(index, index + 1)}
                    disabled={index === options.length - 1}
                  >
                    {DND_CARD_BUILDER_LABELS.MOVE_DOWN}
                  </Button>
                </Stack>
              )}
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Button startIcon={<AddIcon />} variant='outlined' onClick={handleAddOption} fullWidth>
            {DND_CARD_BUILDER_LABELS.ADD_ANOTHER_OPTION}
          </Button>
        </Stack>
      )}

      {/* Summary */}
      {options.length > 0 && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant='body2' color='text.secondary'>
            <strong>{DND_CARD_BUILDER_LABELS.OPTIONS_SUMMARY}</strong> {options.length}{' '}
            {options.length !== 1
              ? DND_CARD_BUILDER_LABELS.OPTIONS_PLURAL
              : DND_CARD_BUILDER_LABELS.OPTION_SINGULAR}{' '}
            {DND_CARD_BUILDER_LABELS.CONFIGURED}
            {options.filter((opt) => opt.icon).length > 0 && (
              <>
                {' • '}
                {options.filter((opt) => opt.icon).length} {DND_CARD_BUILDER_LABELS.WITH_ICONS}
              </>
            )}
            {options.filter((opt) => opt.badge).length > 0 && (
              <>
                {' • '}
                {options.filter((opt) => opt.badge).length} {DND_CARD_BUILDER_LABELS.WITH_BADGES}
              </>
            )}
            {options.filter((opt) => opt.isIconOnly).length > 0 && (
              <>
                {' • '}
                {options.filter((opt) => opt.isIconOnly).length} {DND_CARD_BUILDER_LABELS.ICON_ONLY}
              </>
            )}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default OptionsManager
