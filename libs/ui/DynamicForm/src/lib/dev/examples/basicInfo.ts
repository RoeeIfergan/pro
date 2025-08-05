import z from 'zod'
import { FieldComponentType, ILayoutComponentType } from '../../types/types'

export const basicInfo = {
  schema: z.object({
    // Basic Info
    firstName: z.string().min(1, 'שם פרטי הוא שדה חובה').default(''),
    lastName: z.string().min(1, 'שם משפחה הוא שדה חובה').default(''),
    email: z.email('כתובת אימייל שגויה').min(1, 'כתובת אימייל הוא שדה חובה').default(''),
    age: z
      .number()
      .min(0, 'גיל חייב להיות חיובי')
      .max(120, 'גיל חייב להיות בין 0 ל-120')
      .default(0),
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
      ),
    country: z.enum(['us', 'uk', 'ca', 'de', 'fr', 'jp', 'au']).nullable().default(null),
    role: z.enum(['student', 'teacher', 'admin', 'moderator']).nullable().default(null),
    subscribed: z.boolean().nullable().default(false),
    darkModeEnabled: z.boolean().nullable().default(false)
  }),

  uiSchema: {
    layout: [
      {
        title: 'מידע כללי',
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
          },
          {
            fields: [
              {
                path: 'firstName',
                label: 'שם פרטי',
                component: FieldComponentType.inputText,
                placeholder: 'הכנס את שמך הפרטי'
              },
              {
                path: 'lastName',
                label: 'שם משפחה',
                component: FieldComponentType.inputText,
                placeholder: 'הכנס את שם המשפחה שלך'
              }
            ],
            fieldsPerRow: 2,
            gap: 2
          },
          {
            fields: [
              {
                path: 'email',
                label: 'כתובת אימייל',
                component: FieldComponentType.inputEmail,
                placeholder: 'הכנס את כתובת האימייל שלך'
              }
            ]
          },
          {
            fields: [
              {
                path: 'age',
                label: 'גיל',
                component: FieldComponentType.inputNumber,
                placeholder: 'הכנס את גילך'
              },
              {
                path: 'birthDate',
                label: 'תאריך לידה',
                component: FieldComponentType.inputDate
              }
            ],
            fieldsPerRow: 2,
            gap: 2
          },
          {
            fields: [
              {
                path: 'country',
                label: 'מדינה',
                component: FieldComponentType.select,
                options: {
                  values: [
                    { value: 'us', label: 'ארצות הברית' },
                    { value: 'uk', label: 'בריטניה' },
                    { value: 'ca', label: 'קנדה' },
                    { value: 'de', label: 'גרמניה' },
                    { value: 'fr', label: 'צרפת' },
                    { value: 'jp', label: 'יפן' },
                    { value: 'au', label: 'אוסטרליה' }
                  ]
                }
              }
            ]
          },
          {
            fields: [
              {
                path: 'subscribed',
                label: 'הרשמה לניוזלטר',
                component: FieldComponentType.inputCheckbox
              },
              {
                path: 'darkModeEnabled',
                label: 'מצב כהה פעיל',
                component: FieldComponentType.inputSwitch
              }
            ],
            fieldsPerRow: 2,
            gap: 2
          },
          {
            fields: [
              {
                path: 'newsletterTopics',
                label: 'נושאי ניוזלטר (בחירה מרובה)',
                component: FieldComponentType.select,
                multiple: true,
                options: {
                  values: [
                    { value: 'tech', label: 'טכנולוגיה' },
                    { value: 'design', label: 'עיצוב' },
                    { value: 'business', label: 'עסקים' },
                    { value: 'science', label: 'מדע' },
                    { value: 'education', label: 'חינוך' }
                  ]
                }
              }
            ],
            fieldsPerRow: 1,
            condition: (values: any) => values.subscribed === true
          }
        ]
      }
    ]
  }
}
