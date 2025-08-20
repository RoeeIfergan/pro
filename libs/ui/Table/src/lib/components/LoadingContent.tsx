import { CircularProgress, Typography } from '@mui/material'

export function LoadingContent() {
  return (
    <>
      <CircularProgress size={24} />
      <Typography variant='body2' sx={{ mt: 1 }}>
        Loading more...
      </Typography>
    </>
  )
}
