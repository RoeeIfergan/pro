import { Box, Typography, Paper } from '@mui/material'
import { useDNDCardBuilderContext } from '../utils/context'
import { DND_CARD_BUILDER_LABELS } from '../utils/constants'

const EditRowsView = () => {
  const { handleAddRow, uiSchema, navigateToEditRow } = useDNDCardBuilderContext()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'background.default',
        overflow: 'hidden',
        width: '100%'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}
      >
        <Typography variant='h4' component='h1' gutterBottom>
          Edit Rows
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Manage and organize your form rows. Click on a row to edit its fields and properties.
        </Typography>
      </Box>
      {/* Scrollable grid of row squares */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 2,
            mb: 3
          }}
        >
          {uiSchema.layout.map((row, rowIndex) => (
            <Paper
              key={row._id}
              sx={{
                p: 2,
                minHeight: 120,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => navigateToEditRow(rowIndex)}
            >
              <Typography variant='h6' sx={{ mb: 1 }}>
                {row.title || `Row ${rowIndex + 1}`}
              </Typography>

              <Typography variant='body2' color='text.secondary'>
                Fields: {row.fields?.length || 0}
              </Typography>
            </Paper>
          ))}

          {/* Add Row Button */}
          <Paper
            sx={{
              p: 2,
              minHeight: 120,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '2px dashed',
              borderColor: 'divider',
              backgroundColor: 'transparent',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover'
              }
            }}
            onClick={handleAddRow}
          >
            <Typography variant='h6' color='text.secondary'>
              {DND_CARD_BUILDER_LABELS.ADD_ROW}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default EditRowsView
