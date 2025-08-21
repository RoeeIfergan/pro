import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { FieldComponentType, WidthKey } from '../../lib/types'
import { ICardSchemaMetaWithIds, IFieldRowWithIds, ILayoutFieldWithIds } from '../types'
import { UnknownRecord } from '../../lib/types'
import { DND_CARD_BUILDER_LABELS } from '../utils/constants'

export type ViewType = 'rows' | 'editRow' | 'editField'

export interface EditingFieldInfo {
  field: ILayoutFieldWithIds
  rowIndex: number
  fieldIndex: number
}

export interface EditingRowInfo {
  rowIndex: number
}

export const useCardBuilderContextValues = ({
  setUiSchema,
  uiSchema
}: {
  setUiSchema: Dispatch<SetStateAction<ICardSchemaMetaWithIds>>
  uiSchema: ICardSchemaMetaWithIds
}) => {
  // View management state
  const [currentView, setCurrentView] = useState<ViewType>('rows')
  const [editingField, setEditingField] = useState<EditingFieldInfo | null>(null)
  const [editingRow, setEditingRow] = useState<EditingRowInfo | null>(null)
  const createId = () =>
    (typeof crypto !== 'undefined' && 'randomUUID' in crypto && crypto.randomUUID()) ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`

  const handleRemoveField = useCallback(
    (rowIndex: number, fieldIndex: number) => {
      setUiSchema((prev) => {
        const layout = [...prev.layout]
        const fields = [...(layout[rowIndex].fields ?? [])].filter((_, i) => i !== fieldIndex)
        layout[rowIndex] = { ...layout[rowIndex], fields }
        return { ...prev, layout }
      })
    },
    [setUiSchema]
  )

  const handleChangeFieldPath = useCallback(
    (rowIndex: number, fieldIndex: number, path: string) => {
      setUiSchema((prev) => {
        const layout = [...prev.layout]
        const fields = [...(layout[rowIndex].fields ?? [])]
        const field = { ...fields[fieldIndex], path } as ILayoutFieldWithIds<UnknownRecord>
        fields[fieldIndex] = field
        layout[rowIndex] = { ...layout[rowIndex], fields }
        return { ...prev, layout }
      })
    },
    [setUiSchema]
  )

  const handleChangeFieldComponent = useCallback(
    (rowIndex: number, fieldIndex: number, component: FieldComponentType) => {
      setUiSchema((prev) => {
        const layout = [...prev.layout]
        const fields = [...(layout[rowIndex].fields ?? [])]
        const field = { ...fields[fieldIndex], component } as ILayoutFieldWithIds<UnknownRecord>
        fields[fieldIndex] = field
        layout[rowIndex] = { ...layout[rowIndex], fields }
        return { ...prev, layout }
      })
    },
    [setUiSchema]
  )

  const fieldPathOptions = useMemo<string[]>(() => {
    if (!uiSchema) return []
    const paths = new Set<string>()
    uiSchema.layout.forEach((row) => {
      row.fields?.forEach((f) => paths.add(String(f.path)))
    })
    return Array.from(paths)
  }, [uiSchema])

  const handleAddField = useCallback(
    (rowIndex: number) => {
      if (!uiSchema || fieldPathOptions.length === 0) return
      const defaultPath = fieldPathOptions[0]
      if (!defaultPath) return
      const newField = {
        _id: createId(),
        path: defaultPath as unknown as keyof UnknownRecord,
        label: DND_CARD_BUILDER_LABELS.NEW_FIELD_LABEL,
        component: FieldComponentType.inputText,
        placeholder: DND_CARD_BUILDER_LABELS.NEW_FIELD_PLACEHOLDER,
        width: WidthKey.W12
      } as unknown as ILayoutFieldWithIds<UnknownRecord>

      setUiSchema((prev) => {
        const layout = [...prev.layout]
        const currentFields = layout[rowIndex]?.fields ?? []
        const newFieldIndex = currentFields.length // Index of the new field (last position)
        const row = {
          ...(layout[rowIndex] ?? { fields: [] }),
          fields: [...currentFields, newField]
        } as IFieldRowWithIds<UnknownRecord>
        layout[rowIndex] = row

        // Navigate to the newly created field
        setTimeout(() => {
          setEditingField({ field: newField, rowIndex, fieldIndex: newFieldIndex })
          setCurrentView('editField')
        }, 0)

        return { ...prev, layout }
      })
    },
    [setUiSchema, fieldPathOptions, uiSchema]
  )

  const handleRowTitleChange = useCallback(
    (rowIndex: number, title: string) => {
      setUiSchema((prev) => {
        const layout = [...prev.layout]
        layout[rowIndex] = { ...layout[rowIndex], title }
        return { ...prev, layout }
      })
    },
    [setUiSchema]
  )

  const handleRemoveRow = useCallback(
    (rowIndex: number) => {
      setUiSchema((prev) => {
        const layout = [...prev.layout]
        layout.splice(rowIndex, 1)
        return { ...prev, layout }
      })
    },
    [setUiSchema]
  )

  const handleAddRow = useCallback(() => {
    setUiSchema((prev) => {
      const newLayout = [
        ...prev.layout,
        { _id: createId(), title: DND_CARD_BUILDER_LABELS.NEW_ROW_LABEL, fields: [] }
      ]

      // Navigate to the newly created row (last index)
      const newRowIndex = newLayout.length - 1
      setTimeout(() => {
        setEditingRow({ rowIndex: newRowIndex })
        setCurrentView('editRow')
      }, 0)

      return { ...prev, layout: newLayout }
    })
  }, [setUiSchema])

  // View navigation methods
  const navigateToEditRow = useCallback((rowIndex: number) => {
    setEditingRow({ rowIndex })
    setCurrentView('editRow')
  }, [])

  const navigateToEditField = useCallback(
    (field: ILayoutFieldWithIds, rowIndex: number, fieldIndex: number) => {
      setEditingField({ field, rowIndex, fieldIndex })
      setCurrentView('editField')
    },
    []
  )

  const navigateBackToRows = useCallback(() => {
    setEditingField(null)
    setEditingRow(null)
    setCurrentView('rows')
  }, [])

  const navigateBackToRow = useCallback(() => {
    setEditingField(null)
    setCurrentView('editRow')
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
      navigateToEditRow,
      navigateToEditField,
      navigateBackToRows,
      navigateBackToRow
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
      navigateToEditRow,
      navigateToEditField,
      navigateBackToRows,
      navigateBackToRow
    ]
  )
}
