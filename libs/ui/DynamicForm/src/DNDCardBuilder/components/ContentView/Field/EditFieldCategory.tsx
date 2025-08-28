import React from 'react'
import { Box } from '@mui/material'
import BasicCategory from './Categories/BasicCategory'
import LayoutCategory from './Categories/LayoutCategory'
import ValidationCategory from './Categories/ValidationCategory'
import InputCategory from './Categories/InputCategory'
import OptionsCategory from './Categories/OptionsCategory'
import AdvancedCategory from './Categories/AdvancedCategory'

interface EditFieldCategoryProps {
  selectedCategory: string
  rowIndex: number
  fieldIndex: number
}

const EditFieldCategory: React.FC<EditFieldCategoryProps> = ({
  selectedCategory,
  rowIndex,
  fieldIndex
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        p: selectedCategory === 'options' ? 0 : 4
      }}
    >
      {selectedCategory === 'basic' && (
        <BasicCategory rowIndex={rowIndex} fieldIndex={fieldIndex} />
      )}
      {selectedCategory === 'layout' && (
        <LayoutCategory rowIndex={rowIndex} fieldIndex={fieldIndex} />
      )}
      {selectedCategory === 'validation' && (
        <ValidationCategory rowIndex={rowIndex} fieldIndex={fieldIndex} />
      )}
      {selectedCategory === 'input' && (
        <InputCategory rowIndex={rowIndex} fieldIndex={fieldIndex} />
      )}
      {selectedCategory === 'options' && (
        <OptionsCategory rowIndex={rowIndex} fieldIndex={fieldIndex} />
      )}
      {selectedCategory === 'advanced' && (
        <AdvancedCategory rowIndex={rowIndex} fieldIndex={fieldIndex} />
      )}
    </Box>
  )
}

export default EditFieldCategory
