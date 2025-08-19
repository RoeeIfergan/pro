import { Box, Paper, Typography } from '@mui/material'

const Panel = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Paper
    elevation={1}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minHeight: '100vh',
      alignItems: 'center'
    }}
  >
    <Box
      p={2}
      sx={{
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        flexShrink: 0,
        alignItems: 'center'
      }}
    >
      <Typography variant='h6'>{title}</Typography>
    </Box>
    <Box p={2} sx={{ overflow: 'auto' }}>
      {children}
    </Box>
  </Paper>
)

export default Panel
