import React from 'react'
import type { IOption, ILayoutField } from '../../../../../DynamicForm/types'
import SortableOptionsManager from '../../EditField/SortableOptionsManager'

export interface SelectOptionsPanelProps {
  localField: ILayoutField
  onFieldChange: (updater: (prev: ILayoutField | null) => ILayoutField | null) => void
}

const SelectOptionsPanel: React.FC<SelectOptionsPanelProps> = ({ localField, onFieldChange }) => {
  return (
    <SortableOptionsManager
      options={(localField as { options?: { values?: IOption[] } }).options?.values || []}
      localField={localField}
      onFieldChange={onFieldChange}
    />
  )
}

export default SelectOptionsPanel
