import { pick as _pick } from 'lodash'

export const getOptionsConvertion =
  <C extends Record<string, unknown>>(columns: C) =>
  <T extends Array<keyof typeof columns>>(options: T): Pick<typeof columns, T[number]> => {
    return _pick(columns, options)
  }

export const convertOptions = <
  S extends { _: { columns: Record<string, unknown> } },
  C extends S['_']['columns'],
  K extends readonly (keyof C)[]
>(
  schema: S,
  options: K
): Pick<C, K[number]> => {
  const columns = Object.fromEntries(
    Object.entries(schema).filter(([, v]) => v && typeof v === 'object' && 'name' in v)
  )
  return _pick(columns, options) as Pick<C, K[number]>
}
