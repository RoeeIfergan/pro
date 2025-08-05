import { z } from 'zod'
import { FieldComponentType, ILayoutComponentType } from '../../types/types'

export const multiSelectFields = {
  schema: z.object({
    skills: z
      .array(
        z.enum([
          'react',
          'typescript',
          'nodejs',
          'python',
          'docker',
          'aws',
          'kubernetes',
          'graphql'
        ])
      )
      .default([]),
    languages: z
      .array(z.enum(['hebrew', 'english', 'arabic', 'french', 'spanish', 'german']))
      .default([]),
    hobbies: z
      .array(z.enum(['reading', 'music', 'sports', 'cooking', 'traveling', 'photography']))
      .default([]),
    newsletterTopics: z
      .array(z.enum(['tech', 'design', 'business', 'science', 'education']))
      .default([])
  }),

  uiSchema: {
    layout: [
      {
        title: 'דוגמאות לבחירה מרובה (Multi-Select)',
        component: ILayoutComponentType.box,
        collapsible: false,
        rows: [
          {
            fields: [
              {
                path: 'skills',
                label: 'כישורים מקצועיים',
                component: FieldComponentType.select,
                multiple: true,
                options: {
                  values: [
                    { value: 'react', label: 'React' },
                    { value: 'typescript', label: 'TypeScript' },
                    { value: 'nodejs', label: 'Node.js' },
                    { value: 'python', label: 'Python' },
                    { value: 'docker', label: 'Docker' },
                    { value: 'aws', label: 'AWS' },
                    { value: 'kubernetes', label: 'Kubernetes' },
                    { value: 'graphql', label: 'GraphQL' }
                  ]
                }
              }
            ]
          },
          {
            fields: [
              {
                path: 'languages',
                label: 'שפות שליטה',
                component: FieldComponentType.select,
                multiple: true,
                options: {
                  values: [
                    { value: 'hebrew', label: 'עברית' },
                    { value: 'english', label: 'אנגלית' },
                    { value: 'arabic', label: 'ערבית' },
                    { value: 'french', label: 'צרפתית' },
                    { value: 'spanish', label: 'ספרדית' },
                    { value: 'german', label: 'גרמנית' }
                  ]
                }
              },
              {
                path: 'hobbies',
                label: 'תחביבים',
                component: FieldComponentType.select,
                multiple: true,
                options: {
                  values: [
                    { value: 'reading', label: 'קריאה' },
                    { value: 'music', label: 'מוזיקה' },
                    { value: 'sports', label: 'ספורט' },
                    { value: 'cooking', label: 'בישול' },
                    { value: 'traveling', label: 'טיולים' },
                    { value: 'photography', label: 'צילום' }
                  ]
                }
              }
            ],
            fieldsPerRow: 2,
            gap: 2
          },
          {
            fields: [
              {
                path: 'newsletterTopics',
                label: 'נושאי ניוזלטר',
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
            ]
          }
        ]
      }
    ]
  }
}
