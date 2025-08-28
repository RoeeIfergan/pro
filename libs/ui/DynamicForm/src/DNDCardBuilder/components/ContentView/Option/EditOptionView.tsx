import React, { useState } from 'react'
import SettingsIcon from '@mui/icons-material/Settings'
import { useDNDCardBuilderContext } from '../../../utils/context'
import MenuList, { MenuCategory } from '../MenuList'
import EditOptionCategory from './EditOptionCategory'

type OptionCategoryType = 'general'

const categories: MenuCategory[] = [{ id: 'general', label: 'כללי', icon: <SettingsIcon /> }]

const EditOptionView: React.FC<{ rowIndex: number; fieldIndex: number; optionIndex: number }> = ({
  rowIndex,
  fieldIndex,
  optionIndex
}) => {
  const { uiSchema } = useDNDCardBuilderContext()
  const [selectedCategory, setSelectedCategory] = useState<OptionCategoryType>('general')

  const field = uiSchema.rows?.[rowIndex]?.fields?.[fieldIndex]
  const option = (field as { options?: { values?: unknown[] } })?.options?.values?.[optionIndex]

  if (!field || !option) {
    return null
  }

  const availableCategories: OptionCategoryType[] = ['general']

  return (
    <>
      <MenuList
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={(categoryId) => setSelectedCategory(categoryId as OptionCategoryType)}
        availableCategories={availableCategories}
      />

      <EditOptionCategory
        selectedCategory={selectedCategory}
        rowIndex={rowIndex}
        fieldIndex={fieldIndex}
        optionIndex={optionIndex}
      />
    </>
  )
}

export default EditOptionView
