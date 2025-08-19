import { Stack, Box } from '@mui/material'

export default function Screens() {
  // const [screenId, setScreenId] = useState<number>()

  // const { mutateAsync: deleteScreen } = useDeleteScreen(screenId)

  return (
    <Stack direction='column' width='100%' gap={2}>
      <Stack direction='row'>
        <Box flex={1} />
        {/* <Button variant='contained' color='secondary' onClick={() => setScreenId(NEW_SCREEN_ID)}>
          Create Screen
        </Button> */}
      </Stack>
      {/* <ScreensTable onEdit={(id) => setScreenId(id)} onDelete={(id) => deleteScreen()} /> */}
      {/* {screenId != null && (
        <ScreensDialog screenId={screenId} onClose={() => setScreenId(undefined)} />
      )} */}
    </Stack>
  )
}
