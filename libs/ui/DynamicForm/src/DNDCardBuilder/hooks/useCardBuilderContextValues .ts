import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import {
  FieldComponentType,
  ICardSchemaMeta,
  IFieldRow,
  ILayoutField,
  WidthKey
} from '../../DynamicForm/types'
import { UnknownRecord } from '../../DynamicForm/types'
import { DND_CARD_BUILDER_LABELS } from '../utils/constants'

export type ViewType = 'rows' | 'editRow' | 'editField' | 'editOption'

export interface EditingFieldInfo {
  rowIndex: number
  fieldIndex: number
}

export interface HoveredInfo {
  _id: string
}

export interface EditingRowInfo {
  rowIndex: number
}

export interface EditingOptionInfo {
  rowIndex: number
  fieldIndex: number
  optionIndex: number
}

export const useCardBuilderContextValues = ({
  setUiSchema,
  uiSchema
}: {
  setUiSchema: Dispatch<SetStateAction<ICardSchemaMeta>>
  uiSchema: ICardSchemaMeta
}) => {
  // View management state
  const [currentView, setCurrentView] = useState<ViewType>('rows')
  const [editingField, setEditingField] = useState<EditingFieldInfo | null>(null)
  const [editingRow, setEditingRow] = useState<EditingRowInfo | null>(null)
  const [editingOption, setEditingOption] = useState<EditingOptionInfo | null>(null)

  const [hoveredItem, setHoveredItem] = useState<HoveredInfo | null>(null)

  const createId = () =>
    (typeof crypto !== 'undefined' && 'randomUUID' in crypto && crypto.randomUUID()) ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`

  const handleRemoveField = useCallback(
    ({ rowIndex, fieldIndex }: { rowIndex: number; fieldIndex: number }) => {
      setUiSchema((prev) => {
        const rows = [...prev.rows]
        const fields = [...(rows[rowIndex].fields ?? [])].filter((_, i) => i !== fieldIndex)
        rows[rowIndex] = { ...rows[rowIndex], fields }
        return { ...prev, rows }
      })
    },
    [setUiSchema]
  )

  const handleChangeFieldPath = useCallback(
    (rowIndex: number, fieldIndex: number, path: string) => {
      setUiSchema((prev) => {
        const rows = [...prev.rows]
        const fields = [...(rows[rowIndex].fields ?? [])]
        const field = { ...fields[fieldIndex], path } as ILayoutField
        fields[fieldIndex] = field
        rows[rowIndex] = { ...rows[rowIndex], fields }
        return { ...prev, rows }
      })
    },
    [setUiSchema]
  )

  const handleChangeFieldComponent = useCallback(
    (rowIndex: number, fieldIndex: number, component: FieldComponentType) => {
      setUiSchema((prev) => {
        const rows = [...prev.rows]
        const fields = [...(rows[rowIndex].fields ?? [])]
        const field = { ...fields[fieldIndex], component } as ILayoutField
        fields[fieldIndex] = field
        rows[rowIndex] = { ...rows[rowIndex], fields }
        return { ...prev, rows }
      })
    },
    [setUiSchema]
  )

  const fieldPathOptions = useMemo<string[]>(() => {
    if (!uiSchema) return []
    const paths = new Set<string>()
    uiSchema.rows.forEach((row) => {
      row.fields?.forEach((f) => paths.add(String(f.path)))
    })
    return Array.from(paths)
  }, [uiSchema])

  const handleAddField = useCallback(
    ({ rowIndex }: { rowIndex: number }) => {
      if (!uiSchema) return

      const defaultPath = fieldPathOptions?.[0] ?? 'newField'

      const newField = {
        _id: createId(),
        path: defaultPath as unknown as keyof UnknownRecord,
        label: DND_CARD_BUILDER_LABELS.NEW_FIELD_LABEL,
        component: FieldComponentType.inputText,
        placeholder: DND_CARD_BUILDER_LABELS.NEW_FIELD_PLACEHOLDER,
        width: WidthKey.W12
      } as unknown as ILayoutField

      setUiSchema((prev) => {
        const rows = [...prev.rows]
        const currentFields = rows[rowIndex]?.fields ?? []
        const newFieldIndex = currentFields.length // Index of the new field (last position)
        const row = {
          ...(rows[rowIndex] ?? { fields: [] }),
          fields: [...currentFields, newField]
        } as IFieldRow
        rows[rowIndex] = row

        // Navigate to the newly created field
        setTimeout(() => {
          setEditingField({ rowIndex, fieldIndex: newFieldIndex })
          setCurrentView('editField')
        }, 0)

        return { ...prev, rows }
      })
    },
    [setUiSchema, fieldPathOptions, uiSchema]
  )

  const handleRowTitleChange = useCallback(
    (rowIndex: number, title: string) => {
      setUiSchema((prev) => {
        const rows = [...prev.rows]
        rows[rowIndex] = { ...rows[rowIndex], title }
        return { ...prev, rows }
      })
    },
    [setUiSchema]
  )

  const handleRemoveRow = useCallback(
    (rowIndex: number) => {
      setHoveredItem(null)

      setUiSchema((prev) => {
        const rows = [...prev.rows]
        rows.splice(rowIndex, 1)
        return { ...prev, rows }
      })
    },
    [setUiSchema]
  )

  const handleAddRow = useCallback(() => {
    setUiSchema((prev) => {
      const newRows = [
        ...prev.rows,
        { _id: createId(), title: DND_CARD_BUILDER_LABELS.NEW_ROW_LABEL, fields: [] }
      ]

      // Navigate to the newly created row (last index)
      const newRowIndex = newRows.length - 1
      setTimeout(() => {
        setEditingRow({ rowIndex: newRowIndex })
        setCurrentView('editRow')
      }, 0)

      return { ...prev, rows: newRows }
    })
  }, [setUiSchema])

  // View navigation methods
  const navigateToEditRow = useCallback((editingRow: EditingRowInfo) => {
    setHoveredItem(null)
    setEditingRow(editingRow)
    setCurrentView('editRow')
  }, [])

  const navigateToEditField = useCallback((editingField: EditingFieldInfo) => {
    setHoveredItem(null)
    setEditingRow({ rowIndex: editingField.rowIndex })
    setEditingField(editingField)
    setCurrentView('editField')
  }, [])

  const navigateBackToRows = useCallback(() => {
    setHoveredItem(null)
    setEditingField(null)
    setEditingRow(null)
    setCurrentView('rows')
  }, [])

  const navigateBackToRow = useCallback(() => {
    setHoveredItem(null)
    setEditingField(null)
    setCurrentView('editRow')
  }, [])

  const navigateToEditOption = useCallback((editingOption: EditingOptionInfo) => {
    setHoveredItem(null)
    setEditingRow({ rowIndex: editingOption.rowIndex })
    setEditingField({ rowIndex: editingOption.rowIndex, fieldIndex: editingOption.fieldIndex })
    setEditingOption(editingOption)
    setCurrentView('editOption')
  }, [])

  const navigateBackToField = useCallback(() => {
    setHoveredItem(null)
    setEditingOption(null)
    setCurrentView('editField')
  }, [])

  return useMemo(
    () => ({
      fieldPathOptions,
      handleChangeFieldPath,
      handleChangeFieldComponent,
      handleRemoveField,
      handleAddField,
      handleRowTitleChange,
      handleRemoveRow,
      handleAddRow,
      setUiSchema,
      uiSchema,
      // View navigation
      currentView,
      editingField,
      editingRow,
      editingOption,
      hoveredItem,
      navigateToEditRow,
      navigateToEditField,
      navigateToEditOption,
      navigateBackToRows,
      navigateBackToRow,
      navigateBackToField,
      setHoveredItem
    }),
    [
      fieldPathOptions,
      handleChangeFieldPath,
      handleChangeFieldComponent,
      handleRemoveField,
      handleAddField,
      handleRowTitleChange,
      handleRemoveRow,
      handleAddRow,
      setUiSchema,
      uiSchema,
      currentView,
      editingField,
      editingRow,
      editingOption,
      hoveredItem,
      navigateToEditRow,
      navigateToEditField,
      navigateToEditOption,
      navigateBackToRows,
      navigateBackToRow,
      navigateBackToField,
      setHoveredItem
    ]
  )
}
