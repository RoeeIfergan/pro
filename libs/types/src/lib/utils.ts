export const orderTypes = ['standard', 'express', 'overnight'] as const

export type OrderType = (typeof orderTypes)[number]
