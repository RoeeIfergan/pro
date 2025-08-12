import {
  IconType,
  ConditionOperator,
  LogicalOperator,
  WidthKey,
  FieldComponentType,
  LazyLoaderType
} from './enums'

export type IOptionBadge = {
  text: string
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
}

export type IOption = {
  value: string
  label: string
  icon?: IconType // Icon enum key for JSON serialization
  isIconOnly?: boolean // Display only icon with label as tooltip (requires icon)
  badge?: IOptionBadge // Optional text badge for the button
}

export type DefaultSchema = Record<string, unknown>

// Type-safe paths with explicit support for common nested structures
// This provides better intellisense while allowing flexibility for nested paths
export type Paths<T> = T extends DefaultSchema
  ? keyof T extends string
    ? keyof T | `${keyof T}.${string}`
    : string
  : string

export type ConditionValue = string | number | boolean | null

export type SingleCondition<Schema = DefaultSchema> = {
  field: Paths<Schema>
  operator: ConditionOperator
  value?: ConditionValue // Optional for operators like is_empty, is_true, etc.
}

export type ConditionGroup<Schema = DefaultSchema> = {
  operator: LogicalOperator
  conditions: (SingleCondition<Schema> | ConditionGroup<Schema>)[]
}

// JsonCondition is always a group now - no direct single conditions
export type JsonCondition<Schema = DefaultSchema> = ConditionGroup<Schema>

export type ILayoutBaseField<Schema = DefaultSchema> = {
  path: Paths<Schema>
  label?: string
  hidden?: JsonCondition<Schema> // JSON-only conditions for hiding field
  disabled?: JsonCondition<Schema> // JSON-only conditions for disabling field
  width?: WidthKey // Column width (1-12) - enables field-based columns
  required?: boolean // Whether the field is required
  groupKey?: string // Optional key to group fields together in the same column/container
  groupOrder?: number // Optional order for sorting groups (lower numbers appear more to the left)
}

export type IInputLayoutField<Schema = DefaultSchema> = ILayoutBaseField<Schema> & {
  component:
    | FieldComponentType.inputText
    | FieldComponentType.inputNumber
    | FieldComponentType.inputEmail
    | FieldComponentType.inputPassword
    | FieldComponentType.inputUrl
    | FieldComponentType.textarea
  placeholder: string
  textAlign?: 'left' | 'center' | 'right'
  min?: number | string // Minimum value (for numbers) or minimum length (for text)
  max?: number | string // Maximum value (for numbers) or maximum length (for text)
}

export type ISelectLayoutFieldOptions = {
  values?: Array<IOption>
  lazyValues?: LazyLoaderType
}

export type ISelectLayoutField<Schema = DefaultSchema> = ILayoutBaseField<Schema> & {
  component:
    | FieldComponentType.select
    | FieldComponentType.buttonsGroup
    | FieldComponentType.chipsSelect
  options: ISelectLayoutFieldOptions
  multiple?: boolean
  placeholder?: string
}

export type IInputDateRangeLayoutField<Schema = DefaultSchema> = ILayoutBaseField<Schema> & {
  component: FieldComponentType.inputDateRange

  startDateLabel: string
  endDateLabel: string
  startDatePlaceholder: string
  endDatePlaceholder: string
  startDatePath: Paths<Schema>
  endDatePath: Paths<Schema>
}

export type IRestLayoutFields<Schema = DefaultSchema> = ILayoutBaseField<Schema> & {
  component:
    | FieldComponentType.inputCheckbox
    | FieldComponentType.inputSwitch
    | FieldComponentType.inputRadio
    | FieldComponentType.inputDate
}

export type ILayoutField<Schema = DefaultSchema> =
  | IInputLayoutField<Schema>
  | IRestLayoutFields<Schema>
  | ISelectLayoutField<Schema>
  | IInputDateRangeLayoutField<Schema>

export interface IFieldRow<Schema = DefaultSchema> {
  fields?: ILayoutField<Schema>[]
  fieldsPerRow?: number // Deprecated: Use field.width instead for more flexibility
  gap?: number | string
  hidden?: JsonCondition<Schema> // JSON-only conditions for hiding row
  disabled?: JsonCondition<Schema> // JSON-only conditions for disabling row
  title?: string // Optional title for the row
  collapsible?: boolean // Makes the row collapsible with expand/collapse functionality
  defaultExpanded?: boolean // Default expanded state when collapsible is true
}

export interface ICardSchemaMeta<Schema = DefaultSchema> {
  layout: IFieldRow<Schema>[]
}

export type FieldComponentValue = React.ComponentType<{ field: ILayoutField; disabled?: boolean }>

export type FieldComponentMapper = {
  [key in FieldComponentType]: FieldComponentValue
}
