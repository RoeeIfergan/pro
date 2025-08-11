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

export enum LazyLoaderType {
  LOAD_DEPARTMENTS = 'loadDepartments',
  LOAD_PIRATES = 'loadPirates'
}
