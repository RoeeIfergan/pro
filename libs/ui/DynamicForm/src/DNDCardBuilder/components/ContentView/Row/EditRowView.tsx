import React, { useState } from 'react'
import SettingsIcon from '@mui/icons-material/Settings'
import LayoutIcon from '@mui/icons-material/ViewQuilt'
import TuneIcon from '@mui/icons-material/Tune'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import { useDNDCardBuilderContext } from '../../../utils/context'
import { DND_CARD_BUILDER_LABELS } from '../../../utils/constants'
import MenuList, { MenuCategory } from '../MenuList'
import EditRowCategory from './EditRowCategory'

type CategoryType = 'fields' | 'settings' | 'layout' | 'advanced'

const DEFAULT_CATEGORY = 'fields'

const categories: MenuCategory[] = [
  { id: 'fields', label: 'שדות', icon: <TextFieldsIcon /> },
  { id: 'settings', label: DND_CARD_BUILDER_LABELS.SETTINGS_SECTION, icon: <SettingsIcon /> },
  { id: 'layout', label: 'פריסה', icon: <LayoutIcon /> },
  { id: 'advanced', label: 'מתקדם', icon: <TuneIcon /> }
]

const EditRowView: React.FC<{ rowIndex: number }> = ({ rowIndex }) => {
  const { uiSchema } = useDNDCardBuilderContext()
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(DEFAULT_CATEGORY)

  const row = uiSchema.rows[rowIndex]

  if (!row) {
    return null
  }

  return (
    <>
      <MenuList
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={(categoryId) => setSelectedCategory(categoryId as CategoryType)}
      />

      <EditRowCategory selectedCategory={selectedCategory} rowIndex={rowIndex} />
    </>
  )
}

export default EditRowView
