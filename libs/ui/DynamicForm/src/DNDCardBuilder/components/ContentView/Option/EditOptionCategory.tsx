import React from 'react'
import { Box } from '@mui/material'
import GeneralOptionCategory from './Categories/GeneralOptionCategory'

interface EditOptionCategoryProps {
  selectedCategory: string
  rowIndex: number
  fieldIndex: number
  optionIndex: number
}

const EditOptionCategory: React.FC<EditOptionCategoryProps> = ({
  selectedCategory,
  rowIndex,
  fieldIndex,
  optionIndex
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        p: 4
      }}
    >
      {selectedCategory === 'general' && (
        <GeneralOptionCategory
          rowIndex={rowIndex}
          fieldIndex={fieldIndex}
          optionIndex={optionIndex}
        />
      )}
    </Box>
  )
}

export default EditOptionCategory
