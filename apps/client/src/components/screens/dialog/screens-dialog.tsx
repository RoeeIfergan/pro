import React, { useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Stack,
  TextField
} from '@mui/material'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useCreateScreen, useScreenById, useUpdateScreen } from '../../../hooks/screens'
import { CreateScreenDTO, ScreensSchema } from '@pro3/database'

interface ScreensDialogProps {
  screenId?: number
  onClose: () => void
}

export const NEW_SCREEN_ID = 0

export default function ScreensDialog(props: ScreensDialogProps) {
  const isNew = props.screenId === NEW_SCREEN_ID

  const { data: screen } = useScreenById(props.screenId)
  const { mutateAsync: createScreen } = useCreateScreen()
  const { mutateAsync: updateScreen } = useUpdateScreen(props.screenId)

  const form = useForm<CreateScreenDTO>({
    resolver: zodResolver(ScreensSchema),
    defaultValues: {
      name: ''
      // fieldConfigs: [],
      // demandType: DemandType.Stills
    }
  })

  useEffect(() => {
    if (screen) {
      const defaultValues: CreateScreenDto = {
        name: screen.name,
        demandType: screen.demandType,
        fieldConfigs: screen.fieldConfigs
      }

      form.reset(defaultValues)
    }
  }, [screen, form])

  const onSubmit: SubmitHandler<CreateScreenDto> = async (data) => {
    isNew ? await createScreen(data) : await updateScreen(data)

    form.reset()
    props.onClose()
  }

  return (
    <Dialog open onClose={props.onClose} PaperProps={{ sx: { minWidth: 400 } }}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogTitle>{isNew ? 'Add' : 'Update'} Screen</DialogTitle>
        <DialogContent>
          <Stack gap={2} alignItems='stretch'>
            {/* <FormControl>
              <FormLabel>Demand Type</FormLabel>
              <Select<OrderEntity>
                {...form.register('demandType')}
                value={form.watch('demandType')}
              >
                {Object.values(DemandType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
            <FormControl>
              <FormLabel>Name</FormLabel>
              <TextField {...form.register('name')} />
            </FormControl>
            <FormControl>
              <FormLabel>Fields</FormLabel>
              {/* <ScreenFieldConfigsList
                onChange={(value) => form.setValue('fieldConfigs', value)}
                value={form.watch('fieldConfigs')}
              /> */}
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Cancel</Button>
          <Button
            variant='contained'
            color='secondary'
            type='submit'
            disabled={!form.formState.isValid}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
