import React, { useContext } from 'react'
import { Box, Typography, IconButton, TextField } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { DNDCardBuilderContext } from '../../utils/context'
import Field from '../Field'
import { DND_CARD_BUILDER_LABELS } from '../../utils/constants'
import BreadcrumbsBar from '../BreadcrumbsBar'

function SortableItem({
  id,
  children
}: {
  id: string
  children: (bind: { listeners: ReturnType<typeof useSortable>['listeners'] }) => React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children({ listeners })}
    </div>
  )
}

export interface EditRowViewProps {
  rowIndex: number
  onBack: () => void
}

const EditRowView: React.FC<EditRowViewProps> = ({ rowIndex, onBack }) => {
  const {
    uiSchema,
    setUiSchema,
    handleAddField,
    fieldPathOptions,
    navigateBackToRows,
    navigateBackToRow,
    handleRowTitleChange
  } = useContext(DNDCardBuilderContext)

  const row = uiSchema.layout[rowIndex]

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  )

  const handleDragEnd = (event: unknown) => {
    const { active, over } = event as { active: { id: string }; over: { id: string } }

    if (over && active.id !== over.id) {
      const fields = [...row.fields]

      const oldIndex = row.fields.findIndex((field) => field._id === active.id)
      const newIndex = row.fields.findIndex((field) => field._id === over.id)

      fields[oldIndex] = row.fields[newIndex]
      fields[newIndex] = row.fields[oldIndex]

      setUiSchema((prev) => ({
        ...prev,
        layout: prev.layout.map((rowItem, index) =>
          index === rowIndex
            ? {
                ...rowItem,
                fields
              }
            : rowItem
        )
      }))
    }
  }

  if (!row) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'background.default',
        overflow: 'hidden',
        width: '100%',
        height: '100%'
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
          {DND_CARD_BUILDER_LABELS.EDIT_ROW_TITLE}
        </Typography>
      </Box>

      {/* Breadcrumbs */}
      <BreadcrumbsBar
        currentView='editRow'
        editingRow={{ rowIndex }}
        uiSchema={uiSchema}
        navigateBackToRows={navigateBackToRows}
        navigateBackToRow={navigateBackToRow}
      />

      {/* Row Title Editor */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          variant='outlined'
          label='כותרת השורה'
          value={row.title || ''}
          onChange={(e) => handleRowTitleChange && handleRowTitleChange(rowIndex, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur()
            }
          }}
          size='small'
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: '1rem'
            },
            minHeight: 56
          }}
        />
      </Box>

      {/* Scrollable content with sortable fields */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={row.fields.map((field) => field._id)}
            strategy={verticalListSortingStrategy}
          >
            {row.fields.map((field, fieldIndex) => (
              <SortableItem key={field._id} id={field._id}>
                {({ listeners }) => (
                  <Box sx={{ mb: 2 }}>
                    <Field
                      field={field}
                      fieldIndex={fieldIndex}
                      rowIndex={rowIndex}
                      listeners={listeners}
                    />
                  </Box>
                )}
              </SortableItem>
            ))}
          </SortableContext>

          {/* Add Field Button */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: 'calc(100% - 42px)',
                height: 56,
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: fieldPathOptions.length === 0 ? 'not-allowed' : 'pointer',
                opacity: fieldPathOptions.length === 0 ? 0.5 : 1,
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => fieldPathOptions.length > 0 && handleAddField(rowIndex)}
            >
              <Typography color='text.secondary'>{DND_CARD_BUILDER_LABELS.ADD_FIELD}</Typography>
            </Box>
          </Box>
        </DndContext>
      </Box>
    </Box>
  )
}

export default EditRowView
