import { Dispatch, SetStateAction, useCallback, useMemo } from 'react'
import { FieldComponentType, WidthKey } from '../../lib/types'
import { ICardSchemaMetaWithIds, IFieldRowWithIds, ILayoutFieldWithIds } from '../types'
import { UnknownRecord } from '../../lib/types'

export const useCardBuilderContextValues = ({
  setUiSchema,
  uiSchema
}: {
  setUiSchema: Dispatch<SetStateAction<ICardSchemaMetaWithIds>>
  uiSchema: ICardSchemaMetaWithIds
}) => {
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
        label: 'New Field',
        component: FieldComponentType.inputText,
        placeholder: 'Type here',
        width: WidthKey.W12
      } as unknown as ILayoutFieldWithIds<UnknownRecord>
      setUiSchema((prev) => {
        const layout = [...prev.layout]
        const row = {
          ...(layout[rowIndex] ?? { fields: [] }),
          fields: [...(layout[rowIndex]?.fields ?? []), newField]
        } as IFieldRowWithIds<UnknownRecord>
        layout[rowIndex] = row
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
    setUiSchema((prev) => ({
      ...prev,
      layout: [...prev.layout, { _id: createId(), title: 'New Row', fields: [] }]
    }))
  }, [setUiSchema])

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
      uiSchema
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
      uiSchema
    ]
  )
}
