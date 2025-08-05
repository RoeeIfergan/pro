import { z } from 'zod'
import { FieldComponentType, ILayoutComponentType } from '../../types/types'

export const layoutExamples = {
  schema: z.object({
    firstName: z.string().min(1, 'שם פרטי הוא שדה חובה').default(''),
    lastName: z.string().min(1, 'שם משפחה הוא שדה חובה').default(''),
    email: z.email('כתובת אימייל שגויה').min(1, 'כתובת אימייל הוא שדה חובה').default(''),
    address: z
      .object({
        street: z.string().nullable().default(''),
        city: z.string().nullable().default(''),
        zip: z.string().nullable().default('')
      })
      .nullable()
      .default(null),
    country: z.enum(['us', 'uk', 'ca', 'de', 'fr', 'jp', 'au']).nullable().default(null)
  }),

  uiSchema: {
    layout: [
      {
        title: 'בדיקת עמודות פשוטה',
        component: ILayoutComponentType.box,
        collapsible: true,
        rows: [
          {
            columns: [
              {
                width: 8,
                rows: [
                  {
                    fields: [
                      {
                        path: 'firstName',
                        label: 'שדה בעמודה רחבה (8/12)',
                        component: FieldComponentType.inputText,
                        placeholder: 'זה צריך להיות רחב'
                      }
                    ]
                  }
                ]
              },
              {
                width: 4,
                rows: [
                  {
                    fields: [
                      {
                        path: 'email',
                        label: 'שדה בעמודה צרה (4/12)',
                        component: FieldComponentType.inputEmail,
                        placeholder: 'זה צריך להיות צר'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: 'דוגמה: שני שדות מול שדה יחיד',
        component: ILayoutComponentType.box,
        collapsible: true,
        rows: [
          {
            columns: [
              {
                width: 8, // 66% מהרוחב
                rows: [
                  {
                    fields: [
                      {
                        path: 'address.street',
                        label: 'כתובת רחוב - עמודה רחבה שדה עליון',
                        component: FieldComponentType.inputText,
                        placeholder: 'הכנס את כתובת הרחוב שלך'
                      },
                      {
                        path: 'address.city',
                        label: 'עיר - עמודה רחבה שדה תחתון',
                        component: FieldComponentType.inputText,
                        placeholder: 'הכנס את שם העיר שלך'
                      }
                    ],
                    gap: 2
                  }
                ]
              },
              {
                width: 4, // 33% מהרוחב
                rows: [
                  {
                    fields: [
                      {
                        path: 'country',
                        label: 'מדינה - עמודה צרה (גובה מלא)',
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
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: 'פריסה רגילה - שדות בשורות',
        component: ILayoutComponentType.box,
        collapsible: true,
        rows: [
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
                path: 'address.street',
                label: 'כתובת רחוב',
                component: FieldComponentType.inputText,
                placeholder: 'הכנס את כתובת הרחוב שלך'
              },
              {
                path: 'address.city',
                label: 'עיר',
                component: FieldComponentType.inputText,
                placeholder: 'הכנס את שם העיר שלך'
              },
              {
                path: 'address.zip',
                label: 'מיקוד',
                component: FieldComponentType.inputText,
                placeholder: 'הכנס את המיקוד שלך'
              }
            ],
            fieldsPerRow: 3,
            gap: 2
          }
        ]
      }
    ]
  }
}
