interface Ibase {
  componentType: string
}

export interface IField extends Ibase {
  fieldName: string
  label: string
}

export interface IContainer extends Ibase {
  children: TcardJSONNode[]
}

export interface ItextField extends IField {
  componentType: 'textField' | 'numberInput'
}

export type TselectOption = { value: string | number; label: string | number }

export interface ISelect extends IField {
  componentType: 'select'
  options: TselectOption[]
}

export interface IBox extends IContainer {
  componentType: 'box'
}

export interface ICollapse extends IContainer {
  componentType: 'collapse'
  defaultOpened: boolean
}

export interface IDisplay extends IContainer {
  componentType: 'display'
  ifField: string
  equals: string
}

type fieldTypes = ItextField | ISelect | IDisplay
type containerTypes = IBox | ICollapse
export type TcardJSONNode = fieldTypes | containerTypes
