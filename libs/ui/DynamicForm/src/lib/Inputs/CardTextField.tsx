import { TextField } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { IField } from '../types'

interface ICardTextField extends IField {
  type: 'number' | 'text'
}

const CardTextField = ({ label, fieldName, type }: ICardTextField) => {
  const { register } = useFormContext()

  return <TextField label={label} type={type} variant='outlined' {...register(fieldName)} />
}

export default CardTextField
