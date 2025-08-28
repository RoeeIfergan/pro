import React from 'react'
import { Box } from '@mui/material'
import FieldsCategory from './Categories/FieldsCategory'
import SettingsCategory from './Categories/SettingsCategory'
import LayoutCategory from './Categories/LayoutCategory'
import AdvancedCategory from './Categories/AdvancedCategory'

interface EditRowCategoryProps {
  selectedCategory: string
  rowIndex: number
}

const EditRowCategory: React.FC<EditRowCategoryProps> = ({ selectedCategory, rowIndex }) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        p: selectedCategory === 'fields' ? 0 : 4
      }}
    >
      {selectedCategory === 'fields' && <FieldsCategory rowIndex={rowIndex} />}
      {selectedCategory === 'settings' && <SettingsCategory rowIndex={rowIndex} />}
      {selectedCategory === 'layout' && <LayoutCategory rowIndex={rowIndex} />}
      {selectedCategory === 'advanced' && <AdvancedCategory rowIndex={rowIndex} />}
    </Box>
  )
}

export default EditRowCategory
