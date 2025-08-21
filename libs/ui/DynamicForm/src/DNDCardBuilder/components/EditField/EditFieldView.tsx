import React, { useState } from 'react'
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Stack,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Paper,
  Divider
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SettingsIcon from '@mui/icons-material/Settings'
import LayoutIcon from '@mui/icons-material/ViewQuilt'
import ValidateIcon from '@mui/icons-material/VerifiedUser'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import ListIcon from '@mui/icons-material/List'
import TuneIcon from '@mui/icons-material/Tune'
import { FieldComponentType, UnknownRecord } from '../../../lib/types'
import { ILayoutFieldWithIds } from '../../types'
import { DNDCardBuilderContextType } from '../../utils/context'
import { DND_CARD_BUILDER_LABELS } from '../../utils/constants'
import BreadcrumbsBar from '../BreadcrumbsBar'
import WidthPicker from './WidthPicker'
import SelectPropertiesAccordion from './SelectPropertiesAccordion'

type CategoryType = 'basic' | 'layout' | 'validation' | 'input' | 'options' | 'advanced'

interface Category {
  id: CategoryType
  label: string
  icon: React.ReactNode
}

const categories: Category[] = [
  { id: 'basic', label: 'בסיסי', icon: <SettingsIcon /> },
  { id: 'layout', label: 'פריסה', icon: <LayoutIcon /> },
  { id: 'validation', label: 'ולידציה', icon: <ValidateIcon /> },
  { id: 'input', label: 'קלט', icon: <TextFieldsIcon /> },
  { id: 'options', label: 'אפשרויות', icon: <ListIcon /> },
  { id: 'advanced', label: 'מתקדם', icon: <TuneIcon /> }
]

export interface EditFieldViewProps {
  rowIndex: number
  fieldIndex: number
  context: DNDCardBuilderContextType
  onBack: () => void
}

const EditFieldView: React.FC<EditFieldViewProps> = ({ rowIndex, fieldIndex, context, onBack }) => {
  const { fieldPathOptions, setUiSchema, uiSchema, navigateBackToRows, navigateBackToRow } = context
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('basic')

  const field = uiSchema.layout?.[rowIndex]?.fields?.[fieldIndex]

  const updateField = (updates: Record<string, unknown>) => {
    if (!field) return

    console.log('updates', updates)

    setUiSchema((prev) => ({
      ...prev,
      layout: prev.layout.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              fields: row.fields.map((fieldItem) =>
                fieldItem._id === field._id ? { ...fieldItem, ...updates } : fieldItem
              )
            }
          : row
      )
    }))
  }

  if (!field) {
    return null
  }

  // Helper function to determine which categories should be shown for the current field type
  const getAvailableCategories = (): CategoryType[] => {
    const baseCategories: CategoryType[] = ['basic', 'layout', 'validation']

    // Add input category for text-based fields
    if (
      [
        FieldComponentType.inputText,
        FieldComponentType.inputNumber,
        FieldComponentType.inputEmail,
        FieldComponentType.inputPassword,
        FieldComponentType.textarea
      ].includes(field.component)
    ) {
      baseCategories.push('input')
    }

    // Add options category for select-based fields
    if (
      [
        FieldComponentType.select,
        FieldComponentType.buttonsGroup,
        FieldComponentType.chipsSelect
      ].includes(field.component)
    ) {
      baseCategories.push('options')
    }

    baseCategories.push('advanced')
    return baseCategories
  }

  // Render content based on selected category
  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'basic':
        return renderBasicProperties()
      case 'layout':
        return renderLayoutProperties()
      case 'validation':
        return renderValidationProperties()
      case 'input':
        return renderInputProperties()
      case 'options':
        return renderOptionsProperties()
      case 'advanced':
        return renderAdvancedProperties()
      default:
        return null
    }
  }

  // Basic properties (field name, path, component type)
  const renderBasicProperties = () => (
    <Stack spacing={3}>
      <TextField
        label={DND_CARD_BUILDER_LABELS.FIELD_NAME}
        value={field.label || ''}
        onChange={(e) => updateField({ label: e.target.value })}
        placeholder={DND_CARD_BUILDER_LABELS.FIELD_NAME_PLACEHOLDER}
        fullWidth
      />

      <Autocomplete
        freeSolo
        options={fieldPathOptions}
        value={String(field.path ?? '')}
        onChange={(_, newValue) => {
          if (typeof newValue === 'string') {
            updateField({ path: newValue })
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={DND_CARD_BUILDER_LABELS.FIELD_PATH}
            onBlur={(e) => updateField({ path: e.target.value })}
            fullWidth
          />
        )}
      />

      <FormControl fullWidth>
        <InputLabel>{DND_CARD_BUILDER_LABELS.COMPONENT_TYPE}</InputLabel>
        <Select
          value={field.component}
          label={DND_CARD_BUILDER_LABELS.COMPONENT_TYPE}
          onChange={(e) => updateField({ component: e.target.value as FieldComponentType })}
        >
          {Object.values(FieldComponentType).map((ct) => (
            <MenuItem key={ct} value={ct}>
              {ct}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  )

  // Layout properties (width, spacing, etc.)
  const renderLayoutProperties = () => (
    <Stack spacing={3}>
      <WidthPicker value={field.width} onChange={(width) => updateField({ width })} />

      <FormControlLabel
        control={
          <Switch
            checked={Boolean((field as { hidden?: boolean }).hidden)}
            onChange={(e) => updateField({ hidden: e.target.checked })}
          />
        }
        label='שדה מוסתר'
      />

      <FormControlLabel
        control={
          <Switch
            checked={Boolean((field as { disabled?: boolean }).disabled)}
            onChange={(e) => updateField({ disabled: e.target.checked })}
          />
        }
        label='שדה מנוטרל'
      />
    </Stack>
  )

  // Validation properties
  const renderValidationProperties = () => (
    <Stack spacing={3}>
      <FormControlLabel
        control={
          <Switch
            checked={Boolean((field as { required?: boolean }).required)}
            onChange={(e) => updateField({ required: e.target.checked })}
          />
        }
        label='שדה חובה'
      />

      <Typography variant='body2' color='text.secondary'>
        מאפייני ולידציה נוספים יתווספו בעתיד
      </Typography>
    </Stack>
  )

  // Input-specific properties
  const renderInputProperties = () => (
    <Stack spacing={3}>
      <TextField
        label={DND_CARD_BUILDER_LABELS.PLACEHOLDER}
        value={(field as { placeholder?: string }).placeholder ?? ''}
        onChange={(e) => updateField({ placeholder: e.target.value })}
        fullWidth
      />

      <TextField
        label='תיאור'
        value={(field as { description?: string }).description ?? ''}
        onChange={(e) => updateField({ description: e.target.value })}
        multiline
        rows={3}
        fullWidth
      />
    </Stack>
  )

  // Options properties (for select fields)
  const renderOptionsProperties = () => (
    <Stack spacing={3}>
      <SelectPropertiesAccordion
        localField={field as ILayoutFieldWithIds<UnknownRecord>}
        onFieldChange={(updater) => {
          const updated = updater(field as ILayoutFieldWithIds<UnknownRecord>)
          if (updated) {
            updateField(updated)
          }
        }}
      />
    </Stack>
  )

  // Advanced properties
  const renderAdvancedProperties = () => (
    <Stack spacing={3}>
      <Typography variant='body2' color='text.secondary'>
        מאפיינים מתקדמים כמו לוגיקה מותנית יתווספו בעתיד
      </Typography>
    </Stack>
  )

  const availableCategories = getAvailableCategories()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'background.default',
        overflow: 'hidden',
        width: '100%'
      }}
    >
      {/* Header with back button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          backgroundColor: 'primary.dark',
          gap: 1
        }}
      >
        <IconButton onClick={onBack} sx={{ mr: 1, color: 'primary.contrastText' }}>
          <ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        <Typography variant='h6' sx={{ color: 'primary.contrastText' }}>
          {DND_CARD_BUILDER_LABELS.EDIT_FIELD_TITLE}
        </Typography>
      </Box>

      {/* Breadcrumbs */}
      <BreadcrumbsBar
        currentView='editField'
        editingField={{ field, rowIndex }}
        uiSchema={uiSchema}
        navigateBackToRows={navigateBackToRows}
        navigateBackToRow={navigateBackToRow}
      />

      {/* Main content area with sidebar and content */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar with categories */}
        <Paper
          sx={{
            width: 240,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 0,
            borderRight: 1,
            borderColor: 'divider'
          }}
        >
          <List sx={{ flex: 1, p: 0 }}>
            {availableCategories.map((categoryId) => {
              const category = categories.find((c) => c.id === categoryId)
              if (!category) return null

              return (
                <ListItem key={category.id} disablePadding>
                  <ListItemButton
                    selected={selectedCategory === category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    sx={{
                      minHeight: 48,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                        '&:hover': {
                          backgroundColor: 'primary.main'
                        },
                        '& .MuiListItemIcon-root': {
                          color: 'primary.contrastText'
                        }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>{category.icon}</ListItemIcon>
                    <ListItemText primary={category.label} />
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
        </Paper>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>{renderCategoryContent()}</Box>
        </Box>
      </Box>
    </Box>
  )
}

export default EditFieldView
