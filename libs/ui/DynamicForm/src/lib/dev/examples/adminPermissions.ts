import { z } from 'zod'
import { FieldComponentType, ILayoutComponentType } from '../../types/types'

export const adminPermissions = {
  schema: z.object({
    role: z.enum(['student', 'teacher', 'admin', 'moderator']).nullable().default(null),
    adminPermissions: z
      .object({
        canEditUsers: z.boolean().default(false),
        canDeleteData: z.boolean().default(false)
      })
      .nullable()
      .default(null)
      .refine(
        (data) => {
          if (data) {
            return data.canEditUsers !== null && data.canDeleteData !== null
          }
          return true
        },
        {
          message: 'הרשאות מנהל חייבות להיות מוגדרות',
          path: ['adminPermissions']
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
        title: 'הרשאות מנהל',
        component: ILayoutComponentType.box,
        collapsible: true,
        condition: (v: any) => v.role === 'admin',
        rows: [
          {
            fields: [
              {
                path: 'adminPermissions.canEditUsers',
                label: 'יכול לערוך משתמשים',
                component: FieldComponentType.inputCheckbox
              },
              {
                path: 'adminPermissions.canDeleteData',
                label: 'יכול למחוק מידע',
                component: FieldComponentType.inputCheckbox
              }
            ],
            gap: 2
          }
        ]
      }
    ]
  }
}
