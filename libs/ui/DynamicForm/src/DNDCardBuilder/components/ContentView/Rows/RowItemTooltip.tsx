import { Box, Button, Typography } from '@mui/material'
import { useDNDCardBuilderContext } from '../../../utils/context'
import { DND_CARD_BUILDER_LABELS } from '../../../utils/constants'

const RowItemTooltip = ({ itemIndex: rowIndex }: { itemIndex: number }) => {
  const { setHoveredItem, navigateToEditField, uiSchema } = useDNDCardBuilderContext()

  const row = uiSchema.rows[rowIndex]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography
        variant='body2'
        color='text.secondary'
        sx={{
          cursor: 'help',
          '&:hover': {
            color: 'primary.main'
          }
        }}
      >
        ({row.fields?.length} {row.fields?.length === 1 ? 'שדה' : 'שדות'})
      </Typography>
      {row.fields?.length && row.fields.length > 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5,
            p: 1,
            minWidth: 100
          }}
        >
          {row.fields?.map((field, fieldIndex) => (
            <Button
              key={field._id}
              size='small'
              variant='outlined'
              sx={{
                fontSize: '0.75rem'
              }}
              onMouseEnter={() => setHoveredItem({ _id: field._id as string })}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => {
                navigateToEditField({ rowIndex, fieldIndex })
              }}
            >
              {field.label || field.path || DND_CARD_BUILDER_LABELS.NEW_FIELD_LABEL}
            </Button>
          ))}
        </Box>
      ) : (
        'אין שדות בשורה זו'
      )}
    </Box>
  )
}

export default RowItemTooltip
