import React, { useState } from 'react'
import SettingsIcon from '@mui/icons-material/Settings'
import LayoutIcon from '@mui/icons-material/ViewQuilt'
import MenuList, { MenuCategory } from '../MenuList'

import EditRowsCategory from './EditRowsCategory'

type CategoryType = 'rows' | 'layout'

const categories: MenuCategory[] = [
  { id: 'rows', label: 'שורות', icon: <SettingsIcon /> },
  { id: 'layout', label: 'פריסה', icon: <LayoutIcon /> }
]

const DEFAULT_CATEGORY = 'rows'

const EditRowsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(DEFAULT_CATEGORY)

  return (
    <>
      <MenuList
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={(categoryId) => setSelectedCategory(categoryId as CategoryType)}
      />

      <EditRowsCategory selectedCategory={selectedCategory} />
    </>
  )
}

export default EditRowsView
