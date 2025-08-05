import { z } from 'zod'
import { FieldComponentType, ILayoutComponentType } from '../../types/types'

export const studentInfo = {
  schema: z.object({
    role: z.enum(['student', 'teacher', 'admin', 'moderator']).nullable().default(null),
    schoolInfo: z
      .object({
        grade: z.string().min(1, 'כיתה חייבת להיות מוגדרת').default(''),
        favoriteSubject: z.string().min(1, 'מקצוע מועדף חייב להיות מוגדר').default('')
      })
      .nullable()
      .default(null)
      .refine(
        (data) => {
          if (data) {
            return data.grade && data.favoriteSubject
          }
          return true
        },
        {
          message: 'כיתה ומקצוע מועדף הם שדות חובה עבור תלמידים',
          path: ['schoolInfo']
        }
      )
  }),

  uiSchema: {
    layout: [
      {
        title: 'בחירת תפקיד',
        component: ILayoutComponentType.box,
        collapsible: false,
        rows: [
          {
            fields: [
              {
                path: 'role',
                label: 'תפקיד',
                component: FieldComponentType.buttonsGroup,
                options: {
                  values: [
                    { value: 'student', label: 'תלמיד' },
                    { value: 'teacher', label: 'מורה' },
                    { value: 'admin', label: 'מנהל' },
                    { value: 'moderator', label: 'מנחה' }
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        title: 'מידע על התלמיד',
        component: ILayoutComponentType.box,
        collapsible: true,
        condition: (v: any) => v.role === 'student',
        rows: [
          {
            fields: [
              {
                path: 'schoolInfo.grade',
                label: 'רמת כיתה',
                component: FieldComponentType.inputText,
                placeholder: 'הכנס את רמת הכיתה שלך (למשל: י״א, י״ב)'
              },
              {
                path: 'schoolInfo.favoriteSubject',
                label: 'מקצוע מועדף',
                component: FieldComponentType.inputText,
                placeholder: 'הכנס את המקצוע המועדף שלך'
              }
            ],
            fieldsPerRow: 2,
            gap: 2
          }
        ]
      }
    ]
  }
}
