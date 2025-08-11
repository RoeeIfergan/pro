import { IconType, FieldComponentType, LazyLoaderType } from '../types/enums'
import { IOption, FieldComponentMapper } from '../types/types'
import {
  Check,
  Warning,
  Info,
  Close,
  Add,
  CalendarToday,
  Save,
  Delete,
  Edit,
  Search,
  CheckCircle,
  LocationOn,
  Phone,
  Email,
  Home,
  Person,
  Settings,
  Cancel,
  Error
} from '@mui/icons-material'
import React from 'react'

// Component imports
import LayoutTextField from '../components/Field/components/LayoutTextField'
import LayoutSelect from '../components/Field/components/LayoutSelect'
import LayoutButtonsGroup from '../components/Field/components/LayoutButtonsGroup'
import LayoutCheckbox from '../components/Field/components/LayoutCheckbox'
import LayoutSwitch from '../components/Field/components/LayoutSwitch'
import LayoutDateRangePicker from '../components/Field/components/LayoutDateRangePicker'
import LayoutDatePicker from '../components/Field/components/LayoutDatePicker'
import LayoutChipsSelect from '../components/Field/components/LayoutChipsSelect'
import { QueryClient } from '@tanstack/react-query'

// Icon mapper for converting IconType enum to React components
export const iconMap: Record<IconType, React.ComponentType> = {
  [IconType.HOME]: Home,
  [IconType.SETTINGS]: Settings,
  [IconType.PERSON]: Person,
  [IconType.EMAIL]: Email,
  [IconType.PHONE]: Phone,
  [IconType.LOCATION]: LocationOn,
  [IconType.CALENDAR]: CalendarToday,
  [IconType.SEARCH]: Search,
  [IconType.ADD]: Add,
  [IconType.EDIT]: Edit,
  [IconType.DELETE]: Delete,
  [IconType.SAVE]: Save,
  [IconType.CANCEL]: Cancel,
  [IconType.CHECK]: Check,
  [IconType.CLOSE]: Close,
  [IconType.INFO]: Info,
  [IconType.WARNING]: Warning,
  [IconType.ERROR]: Error,
  [IconType.SUCCESS]: CheckCircle
}

export const componentMap: FieldComponentMapper = {
  [FieldComponentType.inputText]: LayoutTextField,
  [FieldComponentType.inputNumber]: LayoutTextField,
  [FieldComponentType.inputEmail]: LayoutTextField,
  [FieldComponentType.inputPassword]: LayoutTextField,
  [FieldComponentType.inputUrl]: LayoutTextField,
  [FieldComponentType.textarea]: LayoutTextField,
  [FieldComponentType.inputDate]: LayoutDatePicker,
  [FieldComponentType.inputDateRange]: LayoutDateRangePicker,
  [FieldComponentType.select]: LayoutSelect,
  [FieldComponentType.chipsSelect]: LayoutChipsSelect,
  [FieldComponentType.inputCheckbox]: LayoutCheckbox,
  [FieldComponentType.inputSwitch]: LayoutSwitch,
  [FieldComponentType.buttonsGroup]: LayoutButtonsGroup,
  [FieldComponentType.inputRadio]: LayoutButtonsGroup
}

// Type for lazy loader functions
type LazyLoaderFunction = (queryClient: QueryClient) => Promise<IOption[]>

export const loadDepartments = (queryClient: QueryClient) => {
  console.log('getLoadDepartments', queryClient)

  return queryClient.fetchQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      console.log('LOAD_DEPARTMENTS')

      await new Promise((resolve) => setTimeout(resolve, 3000))

      console.log('LOAD_DEPARTMENTS_DONE')

      return [
        { value: 'engineering', label: 'הנדסה' },
        { value: 'marketing', label: 'שיווק' },
        { value: 'sales', label: 'מכירות' }
      ]
    },
    staleTime: Infinity
  })
}

// Lazy loader mapper for converting LazyLoaderType enum to async functions
export const lazyLoaderMap: Record<LazyLoaderType, LazyLoaderFunction> = {
  [LazyLoaderType.LOAD_DEPARTMENTS]: loadDepartments
}
