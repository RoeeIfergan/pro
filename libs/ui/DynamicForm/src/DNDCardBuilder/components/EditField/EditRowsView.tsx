import React, { useContext } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  Chip,
  Tooltip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import SettingsIcon from '@mui/icons-material/Settings'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { DNDCardBuilderContext } from '../../utils/context'
import { IFieldRowWithIds } from '../../types'
import { DND_CARD_BUILDER_LABELS } from '../../utils/constants'

function SortableRowItem({
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

const EditRowsView: React.FC = () => {
  const { uiSchema, setUiSchema, handleAddRow, navigateToEditRow } =
    useContext(DNDCardBuilderContext)

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
      const layout = [...uiSchema.layout]

      // Check if we're dragging rows
      const activeRowIndex = uiSchema.layout.findIndex((row) => row._id === active.id)
      const overRowIndex = uiSchema.layout.findIndex((row) => row._id === over.id)

      if (activeRowIndex !== -1 && overRowIndex !== -1) {
        // Row reordering
        layout[activeRowIndex] = uiSchema.layout[overRowIndex]
        layout[overRowIndex] = uiSchema.layout[activeRowIndex]

        setUiSchema((prev) => ({
          ...prev,
          layout
        }))
      }
    }
  }

  const handleDeleteRow = (rowIndex: number) => {
    setUiSchema((prev) => ({
      ...prev,
      layout: prev.layout.filter((_, index) => index !== rowIndex)
    }))
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
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          backgroundColor: 'primary.dark',
          gap: 1
        }}
      >
        <Typography variant='h6' sx={{ color: 'primary.contrastText' }}>
          {DND_CARD_BUILDER_LABELS.EDIT_ROWS_TITLE}
        </Typography>
      </Box>

      {/* Scrollable content with sortable rows */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={uiSchema.layout.map((row) => row._id)}
            strategy={verticalListSortingStrategy}
          >
            {uiSchema.layout.map((row: IFieldRowWithIds, rowIndex: number) => (
              <SortableRowItem key={row._id} id={row._id}>
                {({ listeners }) => (
                  <Card sx={{ mb: 2, backgroundColor: 'background.paper' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        {/* Row info and drag handle */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size='small'
                            sx={{
                              cursor: 'grab',
                              color: 'text.secondary',
                              '&:hover': { color: 'primary.main' }
                            }}
                            {...listeners}
                          >
                            <DragHandleIcon />
                          </IconButton>
                          <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
                            {row.title || `שורה ${rowIndex + 1}`}
                          </Typography>
                          <Tooltip
                            title={
                              row.fields.length > 0 ? (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, p: 1 }}>
                                  {row.fields.map((field) => (
                                    <Chip
                                      key={field._id}
                                      size='small'
                                      label={
                                        field.label ||
                                        field.path ||
                                        DND_CARD_BUILDER_LABELS.NEW_FIELD_LABEL
                                      }
                                      sx={{
                                        backgroundColor: 'primary.light',
                                        color: 'primary.contrastText',
                                        fontSize: '0.75rem'
                                      }}
                                    />
                                  ))}
                                </Box>
                              ) : (
                                'אין שדות בשורה זו'
                              )
                            }
                            placement='bottom'
                            arrow
                          >
                            <Typography
                              variant='body2'
                              color='text.secondary'
                              sx={{
                                cursor: 'help',
                                '&:hover': {
                                  color: 'primary.main'
                                }
                              }}
                            >
                              ({row.fields.length} {row.fields.length === 1 ? 'שדה' : 'שדות'})
                            </Typography>
                          </Tooltip>
                        </Box>

                        {/* Action buttons */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size='small' onClick={() => navigateToEditRow(rowIndex)}>
                            <SettingsIcon fontSize='small' />
                          </IconButton>

                          <IconButton size='small' onClick={() => handleDeleteRow(rowIndex)}>
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </SortableRowItem>
            ))}
          </SortableContext>
        </DndContext>
      </Box>

      <Box sx={{ mt: 1, mb: 1, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant='outlined'
          onClick={handleAddRow}
          sx={{
            width: 'calc(100% - 42px)',
            minHeight: 56,
            color: 'primary.main',
            borderColor: 'primary.main',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover'
            }
          }}
        >
          <Typography color='primary.main'>{DND_CARD_BUILDER_LABELS.ADD_ROW}</Typography>
        </Button>
      </Box>
    </Box>
  )
}

export default EditRowsView
