import { z } from 'zod'
import { FieldComponentType, ILayoutComponentType } from '../../types/types'

export const dateRanges = {
  schema: z.object({
    projectDateRange: z
      .object({
        startDate: z.date().nullable().default(null),
        endDate: z.date().nullable().default(null)
      })
      .nullable()
      .default(null)
      .refine(
        (data) => {
          if (data?.startDate && data?.endDate) {
            return data.startDate <= data.endDate
          }
          return true
        },
        {
          message: 'תאריך הסיום חייב להיות אחרי תאריך ההתחלה',
          path: ['endDate']
        }
      ),
    vacationDates: z
      .object({
        startDate: z.date().nullable().default(null),
        endDate: z.date().nullable().default(null)
      })
      .nullable()
      .default(null)
      .refine(
        (data) => {
          if (data?.startDate && data?.endDate) {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            return data.startDate >= today
          }
          return true
        },
        {
          message: 'תאריך חופשה לא יכול להיות בעבר',
          path: ['startDate']
        }
      ),
    birthDate: z
      .date()
      .nullable()
      .default(null)
      .refine(
        (date) => {
          if (date) {
            const today = new Date()
            return date <= today || 'תאריך הלידה חייב להיות בעבר'
          }
          return true
        },
        {
          message: 'תאריך לידה לא יכול להיות בעתיד'
        }
      )
  }),

  uiSchema: {
    layout: [
      {
        title: 'דוגמאות תאריכים',
        component: ILayoutComponentType.box,
        collapsible: false,
        rows: [
          {
            fields: [
              {
                path: 'birthDate',
                label: 'תאריך לידה',
                component: FieldComponentType.inputDate
              }
            ]
          }
        ]
      },
      {
        title: 'טווח תאריכים (Date Range)',
        component: ILayoutComponentType.box,
        collapsible: true,
        rows: [
          {
            fields: [
              {
                path: 'projectDateRange',
                label: 'תאריכי פרויקט',
                component: FieldComponentType.inputDateRange,
                startDateLabel: 'תאריך התחלה',
                endDateLabel: 'תאריך סיום',
                startDatePlaceholder: 'הכנס את תאריך ההתחלה',
                endDatePlaceholder: 'הכנס את תאריך הסיום',
                startDatePath: 'startDate',
                endDatePath: 'endDate'
              }
            ]
          },
          {
            fields: [
              {
                path: 'vacationDates',
                label: 'תאריכי חופשה (אסור בעבר)',
                component: FieldComponentType.inputDateRange,
                startDateLabel: 'תאריך התחלה',
                endDateLabel: 'תאריך סיום',
                startDatePlaceholder: 'הכנס את תאריך ההתחלה',
                endDatePlaceholder: 'הכנס את תאריך הסיום',
                startDatePath: 'vacationDates.startDate',
                endDatePath: 'vacationDates.endDate'
              }
            ]
          }
        ]
      }
    ]
  }
}
