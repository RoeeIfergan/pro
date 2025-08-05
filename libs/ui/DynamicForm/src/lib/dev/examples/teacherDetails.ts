import { z } from 'zod'
import { FieldComponentType, ILayoutComponentType, IOption } from '../../types/types'

export const teacherDetails = {
  schema: z.object({
    role: z.enum(['student', 'teacher', 'admin', 'moderator']).nullable().default(null),
    teachingDetails: z
      .object({
        department: z.string().min(1, 'מחלקה חייבת להיות מוגדרת').default(''),
        yearsOfExperience: z
          .number('הקלד מספר')
          .min(0, 'שנות ניסיון חייבות להיות מוגדרת')
          .default(0)
      })
      .nullable()
      .default(null)
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
        title: 'פרטי הוראה',
        component: ILayoutComponentType.box,
        collapsible: true,
        condition: (v: any) => v.role === 'teacher',
        rows: [
          {
            fields: [
              {
                path: 'teachingDetails.department',
                label: 'מחלקה',
                component: FieldComponentType.select,
                options: {
                  values: [
                    { value: 'engineering', label: 'הנדסה' },
                    { value: 'marketing', label: 'שיווק' },
                    { value: 'sales', label: 'מכירות' },
                    { value: 'math', label: 'מתמטיקה' },
                    { value: 'science', label: 'מדעים' },
                    { value: 'literature', label: 'ספרות' },
                    { value: 'history', label: 'היסטוריה' },
                    { value: 'arts', label: 'אמנויות' }
                  ]
                }
              },
              {
                path: 'teachingDetails.yearsOfExperience',
                label: 'שנות ניסיון',
                component: FieldComponentType.inputNumber,
                placeholder: 'הכנס את מספר שנות הניסיון שלך'
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
