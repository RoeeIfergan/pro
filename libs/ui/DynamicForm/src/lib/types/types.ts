export type IOption = {
  value: string
  label: string
  icon?: IconType // Icon enum key for JSON serialization
  isIconOnly?: boolean // Display only icon with label as tooltip (requires icon)
}

// Type-safe paths with explicit support for common nested structures
// This provides better intellisense while allowing flexibility for nested paths
export type Paths<T> =
  T extends Record<string, any>
    ? keyof T extends string
      ? keyof T | `${keyof T}.${string}`
      : string
    : string

// JSON-based condition system for serializable UI schemas
export enum ConditionOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_OR_EQUAL = 'greater_or_equal',
  LESS_OR_EQUAL = 'less_or_equal',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty',
  IS_TRUE = 'is_true',
  IS_FALSE = 'is_false'
}

export enum LogicalOperator {
  AND = 'and',
  OR = 'or'
}

// Width enum for column widths (1-12 grid system)
export enum WidthKey {
  W1 = 1,
  W2 = 2,
  W3 = 3,
  W4 = 4,
  W5 = 5,
  W6 = 6,
  W7 = 7,
  W8 = 8,
  W9 = 9,
  W10 = 10,
  W11 = 11,
  W12 = 12
}

// Icon enum for JSON serialization
export enum IconType {
  HOME = 'home',
  SETTINGS = 'settings',
  PERSON = 'person',
  EMAIL = 'email',
  PHONE = 'phone',
  LOCATION = 'location',
  CALENDAR = 'calendar',
  SEARCH = 'search',
  ADD = 'add',
  EDIT = 'edit',
  DELETE = 'delete',
  SAVE = 'save',
  CANCEL = 'cancel',
  CHECK = 'check',
  CLOSE = 'close',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success'
}

export type ConditionValue = string | number | boolean | null

export type SingleCondition<Schema = Record<string, any>> = {
  field: Paths<Schema>
  operator: ConditionOperator
  value?: ConditionValue // Optional for operators like is_empty, is_true, etc.
}

export type ConditionGroup<Schema = Record<string, any>> = {
  operator: LogicalOperator
  conditions: (SingleCondition<Schema> | ConditionGroup<Schema>)[]
}

// JsonCondition is always a group now - no direct single conditions
export type JsonCondition<Schema = Record<string, any>> = ConditionGroup<Schema>

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
  buttonsGroup = 'buttons-group',
  chipsSelect = 'chips-select'
}

export type ILayoutBaseField<Schema = Record<string, any>> = {
  path: Paths<Schema>
  label: string
  hidden?: JsonCondition<Schema> // JSON-only conditions for hiding field
  disabled?: JsonCondition<Schema> // JSON-only conditions for disabling field
  width?: WidthKey // Column width (1-12) - enables field-based columns
  required?: boolean // Whether the field is required
}

export type IInputLayoutField<Schema = Record<string, any>> = ILayoutBaseField<Schema> & {
  component:
    | FieldComponentType.inputText
    | FieldComponentType.inputNumber
    | FieldComponentType.inputEmail
    | FieldComponentType.inputPassword
    | FieldComponentType.inputUrl
    | FieldComponentType.textarea
  placeholder: string
  min?: number | string // Minimum value (for numbers) or minimum length (for text)
  max?: number | string // Maximum value (for numbers) or maximum length (for text)
}

export type ISelectLayoutFieldOptions = {
  values?: Array<IOption>
  asyncValues?: () => Promise<Array<IOption>>
}

export type ISelectLayoutField<Schema = Record<string, any>> = ILayoutBaseField<Schema> & {
  component:
    | FieldComponentType.select
    | FieldComponentType.buttonsGroup
    | FieldComponentType.chipsSelect
  options: ISelectLayoutFieldOptions
  multiple?: boolean
}

export type IInputDateRangeLayoutField<Schema = Record<string, any>> = ILayoutBaseField<Schema> & {
  component: FieldComponentType.inputDateRange

  startDateLabel: string
  endDateLabel: string
  startDatePlaceholder: string
  endDatePlaceholder: string
  startDatePath: Paths<Schema>
  endDatePath: Paths<Schema>
}

export type IRestLayoutFields<Schema = Record<string, any>> = ILayoutBaseField<Schema> & {
  component:
    | FieldComponentType.inputCheckbox
    | FieldComponentType.inputSwitch
    | FieldComponentType.inputRadio
    | FieldComponentType.inputDate
}

// Field group for creating columns with nested fields
export type IFieldGroup<Schema = Record<string, any>> = {
  width?: WidthKey // Column width (1-12)
  fields: ILayoutField<Schema>[]
  gap?: number | string
  hidden?: JsonCondition<Schema> // JSON-only conditions for hiding group
  disabled?: JsonCondition<Schema> // JSON-only conditions for disabling group
}

export type ILayoutField<Schema = Record<string, any>> =
  | IRestLayoutFields<Schema>
  | ISelectLayoutField<Schema>
  | IInputDateRangeLayoutField<Schema>
  | IInputLayoutField<Schema>
  | IFieldGroup<Schema>

export interface IFieldRow<Schema = Record<string, any>> {
  fields?: ILayoutField<Schema>[]
  fieldsPerRow?: number // Deprecated: Use field.width instead for more flexibility
  gap?: number | string
  hidden?: JsonCondition<Schema> // JSON-only conditions for hiding row
  disabled?: JsonCondition<Schema> // JSON-only conditions for disabling row
  title?: string // Optional title for the row
  collapsible?: boolean // Makes the row collapsible with expand/collapse functionality
  defaultExpanded?: boolean // Default expanded state when collapsible is true
}

export interface ICardSchemaMeta<Schema = Record<string, any>> {
  layout: IFieldRow<Schema>[]
}
