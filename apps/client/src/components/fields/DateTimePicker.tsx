import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import { useField } from 'formik'
import { DateTimePicker as MUIDateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

const DateTimePicker = ({ name, label = '', disablePast }) => {
  const [, meta, helpers] = useField(name)

  return (
    <MUIDateTimePicker
      name={name}
      label={label}
      ampm={false}
      closeOnSelect
      format='DD/MM/YYYY hh:mm'
      disablePast={disablePast}
      value={meta.value}
      onChange={(value) => helpers.setValue(value, true)}
      viewRenderers={{
        hours: renderTimeViewClock,
        minutes: renderTimeViewClock,
        seconds: renderTimeViewClock
      }}
    />
  )
}

export default DateTimePicker
