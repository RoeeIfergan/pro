import React from 'react'
import { Box, IconButton, Tooltip } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

export interface CardHeaderProps {
  onSend?: () => void
  onDelete?: () => void
  onHelp?: () => void
  disableSend?: boolean
  disableDelete?: boolean
  disableSave?: boolean
  disableHelp?: boolean
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  onSend,
  onDelete,
  onHelp,
  disableSend,
  disableDelete,
  disableSave,
  disableHelp
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 0,
        p: 1,
        backgroundColor: 'primary.dark'
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row-reverse' }}>
        <Tooltip title='עזרה'>
          <span>
            <IconButton aria-label='help' onClick={onHelp} disabled={disableHelp} size='large'>
              <HelpOutlineIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title='מחק'>
          <span>
            <IconButton
              aria-label='delete'
              onClick={onDelete}
              disabled={disableDelete}
              size='large'
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row-reverse' }}>
        <Tooltip title='שלח'>
          <span>
            <IconButton aria-label='send' onClick={onSend} disabled={disableSend} size='large'>
              <SendIcon sx={{ transform: 'rotate(180deg)' }} />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title='שמור'>
          <span>
            <IconButton aria-label='save' type='submit' disabled={disableSave} size='large'>
              <SaveIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default CardHeader
