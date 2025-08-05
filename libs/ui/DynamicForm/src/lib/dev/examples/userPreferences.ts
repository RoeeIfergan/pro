import { z } from 'zod'
import { FieldComponentType, ILayoutComponentType } from '../../types/types'

export const userPreferences = {
  schema: z.object({
    subscribed: z.boolean().nullable().default(false),
    darkModeEnabled: z.boolean().nullable().default(false),
    preferences: z
      .object({
        theme: z.enum(['light', 'dark', 'auto'], 'נושא חייב להיות מוגדר'),
        language: z.string().default('')
      })
      .optional(),
    newsletterTopics: z
      .array(z.enum(['tech', 'design', 'business', 'science', 'education']))
      .default([]),
    bio: z.string().default(''),
    avatarUrl: z.url('קישור לתמונת פרופיל שגוי').default('')
  }),

  uiSchema: {
    layout: [
      {
        title: 'העדפות בסיסיות',
        component: ILayoutComponentType.box,
        collapsible: false,
        rows: [
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
          }
        ]
      },
      {
        title: 'נושאי ניוזלטר',
        component: ILayoutComponentType.box,
        collapsible: true,
        condition: (values: any) => values.subscribed === true,
        rows: [
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
            fieldsPerRow: 1
          }
        ]
      },
      {
        title: 'העדפות מתקדמות',
        component: ILayoutComponentType.box,
        collapsible: true,
        rows: [
          {
            fields: [
              {
                path: 'preferences.theme',
                label: 'נושא מועדף',
                component: FieldComponentType.select,
                options: {
                  values: [
                    { value: 'light', label: 'נושא בהיר' },
                    { value: 'dark', label: 'נושא כהה' },
                    { value: 'auto', label: 'אוטומטי (מערכת)' }
                  ]
                }
              },
              {
                path: 'preferences.language',
                label: 'שפה',
                component: FieldComponentType.inputText,
                placeholder: 'הכנס את השפה שלך'
              }
            ],
            fieldsPerRow: 2,
            gap: 2
          }
        ]
      },
      {
        title: 'מידע נוסף',
        component: ILayoutComponentType.box,
        collapsible: true,
        rows: [
          {
            fields: [
              {
                path: 'avatarUrl',
                label: 'קישור לתמונת פרופיל',
                component: FieldComponentType.inputUrl,
                placeholder: 'הכנס קישור לתמונת הפרופיל שלך'
              }
            ]
          },
          {
            fields: [
              {
                path: 'bio',
                label: 'ביוגרפיה',
                component: FieldComponentType.textarea,
                placeholder: 'הכנס את הביוגרפיה שלך'
              }
            ]
          }
        ]
      }
    ]
  }
}
