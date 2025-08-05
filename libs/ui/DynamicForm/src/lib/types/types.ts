export type IOption = { value: string; label: string }

export enum FieldComponentType {
  inputText = 'input-text',
  inputNumber = 'input-number',
  inputEmail = 'input-email',
  inputPassword = 'input-password',
  inputUrl = 'input-url',
  inputCheckbox = 'input-checkbox',
  inputSwitch = 'input-switch',
  inputRadio = 'input-radio',
  inputDate = 'input-date',
  inputDateRange = 'input-date-range',

  textarea = 'textarea',
  select = 'select',
  buttonsGroup = 'buttons-group'
}

export type ILayoutBaseField = {
  path: string
  label: string
}

export type IInputLayoutField = ILayoutBaseField & {
  component:
    | FieldComponentType.inputText
    | FieldComponentType.inputNumber
    | FieldComponentType.inputEmail
    | FieldComponentType.inputPassword
    | FieldComponentType.inputUrl
    | FieldComponentType.textarea
  placeholder: string
}

export type ISelectLayoutFieldOptions = {
  values?: Array<IOption>
  asyncValues?: () => Promise<Array<IOption>>
}

export type ISelectLayoutField = ILayoutBaseField & {
  component: FieldComponentType.select | FieldComponentType.buttonsGroup
  options?: ISelectLayoutFieldOptions
  multiple?: boolean
}

export type IInputDateRangeLayoutField = ILayoutBaseField & {
  component: FieldComponentType.inputDateRange
  startDateLabel: string
  endDateLabel: string
  startDatePlaceholder: string
  endDatePlaceholder: string

  startDatePath: string
  endDatePath: string
}

export type IRestLayoutFields = ILayoutBaseField & {
  component:
    | FieldComponentType.inputCheckbox
    | FieldComponentType.inputSwitch
    | FieldComponentType.inputRadio
    | FieldComponentType.inputDate
}

export type ILayoutField =
  | IInputLayoutField
  | ISelectLayoutField
  | IRestLayoutFields
  | IInputDateRangeLayoutField

export enum ILayoutComponentType {
  box = 'box',
  collapse = 'collapse',
  display = 'display',
  section = 'section'
}

export interface ILayoutColumn {
  width?: number // Column width (1-12)
  rows: IFieldRow[] // Columns contain rows (enables nesting)
  gap?: number | string
}

export interface IFieldRow {
  // Either fields or columns (mutually exclusive for clarity)
  fields?: ILayoutField[]
  columns?: ILayoutColumn[]

  // When using fields:
  fieldsPerRow?: number // How many fields per row (default: 1)

  // Common properties for both fields and columns:
  gap?: number | string
  condition?: (values: any) => boolean // Conditional rendering
}

export interface ILayoutSection {
  title: string
  component: ILayoutComponentType
  rows: IFieldRow[] // Mandatory row-based layout
  collapsible?: boolean
  condition?: (values: any) => boolean
  description?: string
  defaultExpanded?: boolean
}

export interface ICardSchemaMeta {
  layout: ILayoutSection[]
}
