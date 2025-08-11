import { z } from 'zod'
import { FieldComponentType, WidthKey } from '../../types'
import { ICollection } from '../collections'

const schema = z.object({
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
})

export const layoutExamples = (): ICollection<z.infer<typeof schema>> => ({
  name: 'Layout Examples',
  defaultValues: schema.parse({}),
  schema,
  uiSchema: {
    layout: [
      {
        title: 'בדיקת עמודות פשוטה',
        collapsible: true,
        fields: [
          {
            path: 'firstName',
            label: 'שדה בעמודה רחבה (8/12)',
            component: FieldComponentType.inputText,
            placeholder: 'זה צריך להיות רחב',
            width: WidthKey.W8
          },
          {
            path: 'email',
            label: 'שדה בעמודה צרה (4/12)',
            component: FieldComponentType.inputEmail,
            placeholder: 'זה צריך להיות צר',
            width: WidthKey.W4
          }
        ]
      },
      {
        title: 'דוגמה: שני שדות מול שדה יחיד',
        collapsible: true,
        fields: [
          {
            path: 'country',
            label: 'מדינה - עמודה צרה (גובה מלא)',
            component: FieldComponentType.select,
            width: WidthKey.W4,
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
          },
          {
            path: 'address.street',
            label: 'כתובת רחוב - קבוצה שמאל (groupOrder: 20)',
            component: FieldComponentType.inputText,
            placeholder: 'אני בקבוצה שמאל',
            width: WidthKey.W6,
            groupKey: 'leftColumn',
            groupOrder: 20 // This group will appear on the LEFT
          },
          {
            path: 'address.city',
            label: 'עיר - קבוצה שמאל (groupOrder: 20)',
            component: FieldComponentType.inputText,
            placeholder: 'אני גם בקבוצה שמאל',
            required: true,
            width: WidthKey.W6,
            groupKey: 'leftColumn',
            groupOrder: 20 // Same group order
          },
          {
            path: 'email',
            label: 'אימייל - קבוצה ימין (groupOrder: 30)',
            component: FieldComponentType.inputEmail,
            placeholder: 'אני בקבוצה ימין',
            width: WidthKey.W6,
            groupKey: 'rightColumn',
            groupOrder: 30 // This group will appear on the RIGHT
          },
          {
            path: 'lastName',
            label: 'שם משפחה - קבוצה ימין (groupOrder: 30)',
            component: FieldComponentType.inputText,
            placeholder: 'אני גם בקבוצה ימין',
            width: WidthKey.W6,
            groupKey: 'rightColumn',
            groupOrder: 30 // Same group order
          }
        ]
      },
      {
        title: 'פריסה רגילה - שדות בשורות',
        collapsible: true,
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
})
