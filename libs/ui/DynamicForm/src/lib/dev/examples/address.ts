import { z } from 'zod'
import { FieldComponentType, ILayoutComponentType } from '../../types/types'

export const address = {
  schema: z
    .object({
      street: z.string().nullable().default(''),
      city: z.string().nullable().default(''),
      zip: z.string().nullable().default('')
    })
    .nullable()
    .default(null),

  uiSchema: {
    layout: [
      {
        title: 'פרטי כתובת',
        component: ILayoutComponentType.box,
        collapsible: true,
        rows: [
          {
            fields: [
              {
                path: 'address.street',
                label: 'כתובת רחוב',
                component: FieldComponentType.inputText,
                placeholder: 'הכנס את כתובת הרחוב שלך'
              },
              {
                path: 'avatarUrl',
                label: 'קישור לתמונת פרופיל',
                component: FieldComponentType.inputUrl,
                placeholder: 'הכנס קישור לתמונת הפרופיל שלך'
              }
            ],
            fieldsPerRow: 2,
            gap: 2
          },
          {
            fields: [
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
            gap: 3
          }
        ]
      }
    ]
  }
}
