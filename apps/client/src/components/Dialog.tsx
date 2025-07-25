import { Dialog as MuiDialog, DialogTitle, Box, Button, DialogContent } from '@mui/material'

import { translate } from 'utils/translate'

const Dialog = ({
  isOpen,
  onClose,
  title = '',
  body = '',
  maxWidth = 'sm',
  fullWidth = true,
  disableSave = true,
  onSave
}) => {
  return (
    <MuiDialog onClose={onClose} open={isOpen} maxWidth={maxWidth} fullWidth={fullWidth}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{body}</DialogContent>
      <Box sx={{ m: 3 }}>
        <Button disabled={disableSave} onClick={onSave}>
          {translate('action.save')}
        </Button>
        <Button onClick={onClose}>{translate('action.cancel')}</Button>
      </Box>
    </MuiDialog>
  )
}

export default Dialog
