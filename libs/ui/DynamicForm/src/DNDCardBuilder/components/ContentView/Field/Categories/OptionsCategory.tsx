import React from 'react'
import { ISelectLayoutField, ILayoutField } from '../../../../../DynamicForm/types'
import { useDNDCardBuilderContext } from '../../../../utils/context'
import SelectOptionsPanel from './SelectOptionsPanel'

interface OptionsCategoryProps {
  rowIndex: number
  fieldIndex: number
}

const OptionsCategory: React.FC<OptionsCategoryProps> = ({ rowIndex, fieldIndex }) => {
  const { setUiSchema, uiSchema } = useDNDCardBuilderContext()

  const field = uiSchema.rows?.[rowIndex]?.fields?.[fieldIndex] as ISelectLayoutField

  const updateField = (updates: ILayoutField | null) => {
    if (!field || !updates) return

    setUiSchema((prev) => ({
      ...prev,
      rows: prev.rows.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              fields: row.fields?.map((fieldItem) =>
                fieldItem._id === field._id ? updates : fieldItem
              )
            }
          : row
      )
    }))
  }

  if (!field) {
    return null
  }

  return (
    <SelectOptionsPanel
      localField={field}
      onFieldChange={(updater) => { 
        const updated = updater(field)
        updateField(updated)
      }}
    />
  )
}

export default OptionsCategory
