import {
  IconType,
  ConditionOperator,
  LogicalOperator,
  WidthKey,
  GapKey,
  FieldComponentType,
  LazyLoaderType
} from './enums'
import { z } from 'zod'

export type IOptionBadge = {
  text: string
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
}

// Date range validation types
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = Sunday, 6 = Saturday

export type DateRangeValidationConfig = {
  // Past date restrictions
  minDaysFromToday?: number // 0 = today, 1 = tomorrow, etc. Default: 0
  // Day of week restrictions (array of allowed days)
  allowedDaysOfWeek?: DayOfWeek[]
}

export type DateRangeValidations = {
  startDate?: DateRangeValidationConfig
  endDate?: DateRangeValidationConfig
}

export type IOption = {
  value: string | number | boolean
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

export type SingleConditionField<Schema = DefaultSchema> = {
  field: Paths<Schema>
  isContext?: false
  operator: ConditionOperator
  value?: ConditionValue
}

export type SingleConditionContext = {
  field: string
  isContext: true
  operator: ConditionOperator
  value?: ConditionValue
}

export type SingleCondition<Schema = DefaultSchema> =
  | SingleConditionField<Schema>
  | SingleConditionContext

export type ConditionGroup<Schema = DefaultSchema> = {
  operator?: LogicalOperator
  conditions: (SingleCondition<Schema> | ConditionGroup<Schema>)[]
}

export type ILayoutBaseField<Schema = DefaultSchema> = {
  _id?: string
  path: Paths<Schema>
  label?: string
  hidden?: ConditionGroup<Schema>
  disabled?: ConditionGroup<Schema>
  width?: WidthKey
  required?: boolean
  groupKey?: string
  groupOrder?: number
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
  min?: number | string // Minimum value (for numbers) or minimum length (for text)
  max?: number | string // Maximum value (for numbers) or maximum length (for text)
}

export type ISelectLayoutFieldOptions = {
  values?: Array<IOption>
  lazyValues?: LazyLoaderType
  mapBoolean?: { true: string; false: string }
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

  // Date range specific validations
  dateRangeValidations?: DateRangeValidations
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
  _id?: string
  fields: ILayoutField<Schema>[]
  gap?: GapKey
  hidden?: ConditionGroup<Schema>
  disabled?: ConditionGroup<Schema>
  title?: string // Optional title for the row
  collapsible?: boolean // Makes the row collapsible with expand/collapse functionality
  defaultExpanded?: boolean // Default expanded state when collapsible is true
}

export interface ICardSchemaMeta<Schema = DefaultSchema> {
  rows: IFieldRow<Schema>[]
  gap?: GapKey
}

export type FieldComponentValue = React.ComponentType<{ field: ILayoutField; disabled?: boolean }>

export type FieldComponentMapper = {
  [key in FieldComponentType]: FieldComponentValue
}

export type UnknownRecord = Record<string, unknown>

export type ICollection<T extends Record<string, unknown> = Record<string, unknown>> = {
  name: string
  schema: z.ZodType<T>
  defaultValues: T
  uiSchema: ICardSchemaMeta<T>
  context: Record<string, unknown>
}

export interface EditingState {
  editingField: {
    rowIndex: number
    fieldIndex: number
  } | null
  editingRow: {
    rowIndex: number
  } | null
  hoveredItem: {
    _id: string
  } | null
}

export type CardContextType = {
  collection: ICollection
  editingState?: EditingState
}
