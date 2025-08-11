import { FieldComponentType, ILayoutField } from '../../types/types'
import LayoutTextField from './components/LayoutTextField'
import LayoutSelect from './components/LayoutSelect'
import ButtonsGroup from './components/LayoutButtonsGroup'
import LayoutCheckbox from './components/LayoutCheckbox'
import LayoutSwitch from './components/LayoutSwitch'
import LayoutDateRangePicker from './components/LayoutDateRangePicker'
import LayoutDatePicker from './components/LayoutDatePicker'
import LayoutChipsSelect from './components/LayoutChipsSelect'

export const Field = ({ field, disabled = false }: { field: ILayoutField; disabled?: boolean }) => {
  // Field groups don't have components - they should be handled at the layout level
  if ('fields' in field) {
    return null // Field groups are handled by FieldsLayout
  }

  switch (field.component) {
    case FieldComponentType.inputText:
    case FieldComponentType.inputNumber:
    case FieldComponentType.inputEmail:
    case FieldComponentType.inputPassword:
    case FieldComponentType.inputUrl:
    case FieldComponentType.textarea:
      return <LayoutTextField field={field} disabled={disabled} />

    case FieldComponentType.inputDate:
      return <LayoutDatePicker field={field} />

    case FieldComponentType.inputDateRange:
      return <LayoutDateRangePicker field={field} />

    case FieldComponentType.select:
      return <LayoutSelect field={field} />
    case FieldComponentType.chipsSelect:
      return <LayoutChipsSelect field={field} />
    case FieldComponentType.inputCheckbox:
      return <LayoutCheckbox field={field} />
    case FieldComponentType.inputSwitch:
      return <LayoutSwitch field={field} />
    case FieldComponentType.buttonsGroup:
      return <ButtonsGroup field={field} />
    default:
      return null
  }
}
