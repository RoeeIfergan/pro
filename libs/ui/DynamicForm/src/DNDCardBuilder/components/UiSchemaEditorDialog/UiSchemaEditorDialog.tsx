import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
  IconButton,
  Tooltip
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import { create, InstanceProps } from 'react-modal-promise'
import { DND_CARD_BUILDER_LABELS } from '../../utils/constants'
import { ICardSchemaMeta } from '../../../DynamicForm/types'
import HighlightedJsonEditor from './HighlightedJsonEditor'

export interface UiSchemaEditorDialogProps extends InstanceProps<ICardSchemaMeta | null> {
  uiSchema: ICardSchemaMeta
}

const UiSchemaEditorDialog: React.FC<UiSchemaEditorDialogProps> = ({
  isOpen,
  onReject,
  onResolve,
  uiSchema
}) => {
  const [jsonString, setJsonString] = useState('')
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(true)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (uiSchema) {
      setJsonString(JSON.stringify(uiSchema, null, 2))
    }
  }, [uiSchema])

  const validateAndParseJson = (json: string) => {
    try {
      const parsed = JSON.parse(json)

      // Basic validation for UI schema structure
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('UI Schema must be an object')
      }

      if (!parsed.rows || !Array.isArray(parsed.rows)) {
        throw new Error('UI Schema must have a rows array')
      }

      setError('')
      setIsValid(true)
      return parsed as ICardSchemaMeta
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid JSON format'
      setError(errorMessage)
      setIsValid(false)
      return null
    }
  }

  const handleJsonChange = (value: string) => {
    setJsonString(value)

    if (value.trim()) {
      validateAndParseJson(value)
    } else {
      setError('')
      setIsValid(true)
    }
  }

  const handleApprove = () => {
    if (!jsonString.trim()) {
      setError('JSON content cannot be empty')
      setIsValid(false)
      return
    }

    const parsedSchema = validateAndParseJson(jsonString)
    if (parsedSchema && isValid) {
      onResolve(parsedSchema)
    }
  }

  const handleCancel = () => {
    onReject()
  }

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonString)
      setJsonString(JSON.stringify(parsed, null, 2))
      setError('')
      setIsValid(true)
    } catch {
      // Keep the current content if it can't be parsed
    }
  }

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleCancel}
      maxWidth='md'
      fullWidth
      PaperProps={{
        sx: { height: '80vh', display: 'flex', flexDirection: 'column' }
      }}
    >
      <DialogTitle>
        <Typography variant='h6'>עורך סכמת UI</Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
          ערוך את סכמת ה-UI בפורמט JSON
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='subtitle2' color='text.secondary'>
            JSON Schema
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Tooltip title={isCopied ? 'JSON הועתק' : 'העתק JSON ללוח'}>
              <IconButton size='small' onClick={handleCopyJson} disabled={!jsonString.trim()}>
                {isCopied ? <CheckIcon /> : <ContentCopyIcon />}
              </IconButton>
            </Tooltip>
            <Button
              size='small'
              variant='outlined'
              onClick={formatJson}
              disabled={!jsonString.trim()}
            >
              עיצוב JSON
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity='error' sx={{ mb: 1 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ flex: 1 }}>
          <HighlightedJsonEditor
            value={jsonString}
            onChange={handleJsonChange}
            placeholder='הזן את סכמת ה-UI בפורמט JSON...'
            error={!isValid}
          />
        </Box>

        <Typography variant='caption' color='text.secondary'>
          הסכמה חייבת לכלול מאפיין "layout" שהוא מערך של שורות
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={handleCancel} color='inherit'>
          {DND_CARD_BUILDER_LABELS.CANCEL}
        </Button>
        <Button
          onClick={handleApprove}
          variant='contained'
          disabled={!isValid || !jsonString.trim()}
        >
          {DND_CARD_BUILDER_LABELS.SAVE}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export const openUiSchemaEditorDialog = create(UiSchemaEditorDialog)

export default UiSchemaEditorDialog
