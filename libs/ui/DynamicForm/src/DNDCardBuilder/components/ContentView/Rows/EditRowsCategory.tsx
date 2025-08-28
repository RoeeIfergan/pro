import RowsCategory from './Categeries/RowsCategory'
import LayoutCategery from './Categeries/LayoutCategery'
import { Box } from '@mui/material'

const EditRowsCategory = ({ selectedCategory }: { selectedCategory: string }) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        p: selectedCategory === 'rows' ? 0 : 4
      }}
    >
      {selectedCategory === 'rows' && <RowsCategory />}

      {selectedCategory === 'layout' && <LayoutCategery />}
    </Box>
  )
}

export default EditRowsCategory
