
import { FieldComponentType, ILayoutField } from '../types/types'
import LayoutTextField from './Fields/LayoutTextField'
import LayoutSelect from './Fields/LayoutSelect'
import ButtonsGroup from './Fields/LayoutButtonsGroup'
import LayoutCheckbox from './Fields/LayoutCheckbox'
import LayoutSwitch from './Fields/LayoutSwitch'
import LayoutDateRangePicker from './Fields/LayoutDateRangePicker'
import LayoutDatePicker from './Fields/LayoutDatePicker'

export const Field: React.FC<{ field: ILayoutField }> = ({ field }) => {
  switch (field.component) {
    case FieldComponentType.inputText:
    case FieldComponentType.inputNumber:
    case FieldComponentType.inputEmail:
    case FieldComponentType.inputPassword:
    case FieldComponentType.inputUrl:
    case FieldComponentType.textarea:
      return (
          <LayoutTextField {...field} />
      )

    case FieldComponentType.inputDate:
      return (
          <LayoutDatePicker {...field} />
      )

    case FieldComponentType.inputDateRange:
      return (
          <LayoutDateRangePicker {...field} />
      )

    case FieldComponentType.select:
      return (
          <LayoutSelect {...field} />
      )
    case FieldComponentType.inputCheckbox:
      return (
          <LayoutCheckbox {...field} />
      )
    case FieldComponentType.inputSwitch:
      return (
          <LayoutSwitch {...field} />
      )
    case FieldComponentType.buttonsGroup:
      return (
          <ButtonsGroup {...field} />
      )
    default:
      return null
  }
}
