import { Box } from '@mui/material'
import { useDNDCardBuilderContext } from '../../utils/context'
import EditFieldView from './Field/EditFieldView'
import EditRowsView from './Rows/EditRowsView'
import EditRowView from './Row/EditRowView'
import EditOptionView from './Option/EditOptionView'

const ContentView = () => {
  const { currentView, editingField, editingRow, editingOption } = useDNDCardBuilderContext()

  return (
    <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {currentView === 'editField' && editingField && (
        <EditFieldView rowIndex={editingField.rowIndex} fieldIndex={editingField.fieldIndex} />
      )}

      {currentView === 'editRow' && editingRow && <EditRowView rowIndex={editingRow.rowIndex} />}

      {currentView === 'editOption' && editingOption && (
        <EditOptionView
          rowIndex={editingOption.rowIndex}
          fieldIndex={editingOption.fieldIndex}
          optionIndex={editingOption.optionIndex}
        />
      )}

      {currentView === 'rows' && <EditRowsView />}
    </Box>
  )
}

export default ContentView
