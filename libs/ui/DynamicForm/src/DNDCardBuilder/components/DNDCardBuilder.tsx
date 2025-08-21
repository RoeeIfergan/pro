import { Dispatch, SetStateAction, useEffect } from 'react'
import DNDCardBuilderProvider from './DNDCardBuilderProvider'
import { ICardSchemaMetaWithIds } from '../types'
import { EditFieldView, EditRowView, EditRowsView } from './EditField'
import { useDNDCardBuilderContext } from '../utils/context'

export interface EditingState {
  editingField: {
    field: { _id: string }
    rowIndex: number
    fieldIndex: number
  } | null
  editingRow: {
    rowIndex: number
  } | null
}

interface DNDCardBuilderProps {
  uiSchema: ICardSchemaMetaWithIds
  setUiSchema: Dispatch<SetStateAction<ICardSchemaMetaWithIds>>
  onEditingStateChange?: (editingState: EditingState) => void
}

const DNDCardBuilderContent = ({
  onEditingStateChange
}: {
  onEditingStateChange?: (editingState: EditingState) => void
}) => {
  const contextValue = useDNDCardBuilderContext()
  const { currentView, editingField, editingRow, navigateBackToRows, navigateBackToRow } =
    contextValue

  // Notify parent about editing state changes
  useEffect(() => {
    if (onEditingStateChange) {
      onEditingStateChange({
        editingField,
        editingRow
      })
    }
  }, [editingField, editingRow, onEditingStateChange])

  // Field editing view
  if (currentView === 'editField' && editingField) {
    return (
      <EditFieldView
        field={editingField.field}
        rowIndex={editingField.rowIndex}
        fieldIndex={editingField.fieldIndex}
        context={contextValue}
        onBack={navigateBackToRow}
      />
    )
  }

  // Row editing view
  if (currentView === 'editRow' && editingRow) {
    return <EditRowView rowIndex={editingRow.rowIndex} onBack={navigateBackToRows} />
  }

  // Root view (rows grid)
  return <EditRowsView />
}

const DNDCardBuilder = (props: DNDCardBuilderProps) => {
  return (
    <DNDCardBuilderProvider uiSchema={props.uiSchema} setUiSchema={props.setUiSchema}>
      <DNDCardBuilderContent onEditingStateChange={props.onEditingStateChange} />
    </DNDCardBuilderProvider>
  )
}

export default DNDCardBuilder
