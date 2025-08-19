import { Button, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useFieldById } from '../../../../hooks/fields'
import { CSS } from '@dnd-kit/utilities'
import { DragIndicator } from '@mui/icons-material'
import { useSortable } from '@dnd-kit/sortable'

interface ScreensDialogProps {
  fieldId: number
  onDelete: () => void
}

const FieldConfigListItem = styled(ListItem)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1)
}))

export default function ScreenFieldConfigsListItem(props: ScreensDialogProps) {
  const { data: field } = useFieldById(props.fieldId)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props.fieldId
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  }

  if (!field) return null

  return (
    <FieldConfigListItem ref={setNodeRef} style={style}>
      <ListItemIcon {...listeners} {...attributes} sx={{ mr: 2, cursor: 'move' }}>
        <DragIndicator />
      </ListItemIcon>
      <ListItemText primary={field.name} />
      <Button size='small' onClick={props.onDelete}>
        Remove
      </Button>
    </FieldConfigListItem>
  )
}
