import { DateRangeValidationConfig, DayOfWeek } from '../types'

/**
 * Utility functions for date-range validation
 */

/**
 * Gets the minimum allowed date based on validation config
 */
export const getMinDate = (
  config?: DateRangeValidationConfig,
  referenceDate?: Date
): Date | undefined => {
  if (!config?.minDaysFromToday && config?.minDaysFromToday !== 0) {
    return undefined
  }

  const baseDate = referenceDate || new Date()
  const minDate = new Date(baseDate)
  minDate.setDate(minDate.getDate() + config.minDaysFromToday)

  // Reset time to start of day for consistent comparison
  minDate.setHours(0, 0, 0, 0)

  return minDate
}

/**
 * Checks if a date is allowed based on day-of-week restrictions
 */
export const isDateAllowedByDayOfWeek = (date: Date, allowedDays?: DayOfWeek[]): boolean => {
  if (!allowedDays || allowedDays.length === 0) {
    return true
  }

  const dayOfWeek = date.getDay() as DayOfWeek
  return allowedDays.includes(dayOfWeek)
}

/**
 * Checks if a date should be disabled based on validation config
 */
export const shouldDisableDate = (
  date: Date,
  config?: DateRangeValidationConfig,
  referenceDate?: Date
): boolean => {
  // Check minimum date restriction
  const minDate = getMinDate(config, referenceDate)
  if (minDate && date < minDate) {
    return true
  }

  // Check day-of-week restrictions
  if (!isDateAllowedByDayOfWeek(date, config?.allowedDaysOfWeek)) {
    return true
  }

  return false
}

/**
 * Gets a human-readable label for day-of-week restrictions
 */
export const getDayOfWeekLabel = (days: DayOfWeek[]): string => {
  const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

  if (days.length === 0) {
    return 'כל הימים'
  }

  if (days.length === 7) {
    return 'כל הימים'
  }

  return days.map((day) => dayNames[day]).join(', ')
}

/**
 * Gets a human-readable validation message
 */
export const getValidationMessage = (
  config?: DateRangeValidationConfig,
  fieldName?: string
): string => {
  const messages: string[] = []

  if (config?.minDaysFromToday !== undefined) {
    if (config.minDaysFromToday === 0) {
      messages.push('לא ניתן לבחור תאריכים עבר')
    } else if (config.minDaysFromToday === 1) {
      messages.push('ניתן לבחור החל ממחר')
    } else {
      messages.push(`ניתן לבחור החל מ-${config.minDaysFromToday} ימים מהיום`)
    }
  }

  if (
    config?.allowedDaysOfWeek &&
    config.allowedDaysOfWeek.length > 0 &&
    config.allowedDaysOfWeek.length < 7
  ) {
    messages.push(`ימים מותרים: ${getDayOfWeekLabel(config.allowedDaysOfWeek)}`)
  }

  if (messages.length === 0) {
    return ''
  }

  const prefix = fieldName ? `${fieldName}: ` : ''
  return prefix + messages.join(', ')
}
