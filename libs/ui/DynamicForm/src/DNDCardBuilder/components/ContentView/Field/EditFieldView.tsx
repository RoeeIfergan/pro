import React, { useState } from 'react'
import SettingsIcon from '@mui/icons-material/Settings'
import LayoutIcon from '@mui/icons-material/ViewQuilt'
import ValidateIcon from '@mui/icons-material/VerifiedUser'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import ListIcon from '@mui/icons-material/List'
import TuneIcon from '@mui/icons-material/Tune'
import { FieldComponentType } from '../../../../DynamicForm/types'
import { useDNDCardBuilderContext } from '../../../utils/context'
import { DND_CARD_BUILDER_LABELS } from '../../../utils/constants'
import MenuList, { MenuCategory } from '../MenuList'
import EditFieldCategory from './EditFieldCategory'

type CategoryType = 'basic' | 'layout' | 'validation' | 'input' | 'options' | 'advanced'

const categories: MenuCategory[] = [
  { id: 'basic', label: 'בסיסי', icon: <SettingsIcon /> },
  { id: 'layout', label: 'פריסה', icon: <LayoutIcon /> },
  { id: 'validation', label: 'ולידציה', icon: <ValidateIcon /> },
  { id: 'input', label: 'קלט', icon: <TextFieldsIcon /> },
  { id: 'options', label: DND_CARD_BUILDER_LABELS.SELECT_PROPERTIES_SECTION, icon: <ListIcon /> },
  { id: 'advanced', label: 'מתקדם', icon: <TuneIcon /> }
]

const EditFieldView: React.FC<{ rowIndex: number; fieldIndex: number }> = ({
  rowIndex,
  fieldIndex
}) => {
  const { uiSchema } = useDNDCardBuilderContext()
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('basic')

  const field = uiSchema.rows?.[rowIndex]?.fields?.[fieldIndex]

  if (!field) {
    return null
  }

  const getAvailableCategories = (): CategoryType[] => {
    const baseCategories: CategoryType[] = ['basic', 'layout', 'validation']

    if (
      [
        FieldComponentType.inputText,
        FieldComponentType.inputNumber,
        FieldComponentType.inputEmail,
        FieldComponentType.inputPassword,
        FieldComponentType.textarea,
        FieldComponentType.inputDateRange
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

  const availableCategories = getAvailableCategories()

  return (
    <>
      <MenuList
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={(categoryId) => setSelectedCategory(categoryId as CategoryType)}
        availableCategories={availableCategories}
      />

      <EditFieldCategory
        selectedCategory={selectedCategory}
        rowIndex={rowIndex}
        fieldIndex={fieldIndex}
      />
    </>
  )
}

export default EditFieldView
