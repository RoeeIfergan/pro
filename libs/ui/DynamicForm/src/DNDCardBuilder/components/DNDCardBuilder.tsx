import { Dispatch, SetStateAction, useEffect } from 'react'
import DNDCardBuilderProvider from './DNDCardBuilderProvider'
import { useDNDCardBuilderContext } from '../utils/context'
import Header from './Header'
import BreadcrumbsBar from './BreadcrumbsBar'
import ContentView from './ContentView/ContentView'
import { Box } from '@mui/material'
import { EditingState, ICardSchemaMeta } from '../../DynamicForm/types'

interface DNDCardBuilderProps {
  uiSchema: ICardSchemaMeta
  setUiSchema: Dispatch<SetStateAction<ICardSchemaMeta>>
  onEditingStateChange?: (editingState: EditingState) => void
}

const DNDCardBuilderContent = ({
  onEditingStateChange
}: {
  onEditingStateChange?: (editingState: EditingState) => void
}) => {
  const { editingField, editingRow, hoveredItem } = useDNDCardBuilderContext()

  useEffect(() => {
    if (onEditingStateChange) {
      onEditingStateChange({
        editingField,
        editingRow,
        hoveredItem
      })
    }
  }, [editingField, editingRow, hoveredItem, onEditingStateChange])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
        overflow: 'hidden',
        flex: 1
      }}
    >
      <Header />

      <BreadcrumbsBar />

      <ContentView />
    </Box>
  )
}

const DNDCardBuilder = (props: DNDCardBuilderProps) => {
  return (
    <DNDCardBuilderProvider uiSchema={props.uiSchema} setUiSchema={props.setUiSchema}>
      <DNDCardBuilderContent onEditingStateChange={props.onEditingStateChange} />
    </DNDCardBuilderProvider>
  )
}

export default DNDCardBuilder
