import { z } from 'zod'
import {
  FieldComponentType,
  ICardSchemaMeta,
  ConditionOperator,
  LogicalOperator
} from '../../types/types'
import { ICollection } from '../collections'

const schema = z.object({
  skills: z
    .array(
      z.enum(['react', 'typescript', 'nodejs', 'python', 'docker', 'aws', 'kubernetes', 'graphql'])
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
    .default([]),
  preferences: z
    .array(z.enum(['morning', 'evening', 'weekend', 'weekday', 'flexible']))
    .default([]),
  techStack: z
    .array(z.enum(['frontend', 'backend', 'mobile', 'devops', 'fullstack', 'ai_ml']))
    .default([])
})

const uiSchema: ICardSchemaMeta<z.infer<typeof schema>> = {
  layout: [
    {
      title: 'דוגמאות לבחירה מרובה (Multi-Select)',
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
      hidden: {
        operator: LogicalOperator.AND,
        conditions: [
          {
            field: 'skills',
            operator: ConditionOperator.NOT_CONTAINS,
            value: 'react'
          }
        ]
      },
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
          component: FieldComponentType.chipsSelect,
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
          component: FieldComponentType.buttonsGroup,
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
        },
        {
          path: 'preferences',
          label: 'העדפות זמן',
          component: FieldComponentType.select,
          multiple: true,
          options: {
            values: [
              { value: 'morning', label: 'בוקר' },
              { value: 'evening', label: 'ערב' },
              { value: 'weekend', label: 'סוף שבוע' },
              { value: 'weekday', label: 'ימי חול' },
              { value: 'flexible', label: 'גמיש' }
            ]
          }
        }
      ],
      fieldsPerRow: 2,
      gap: 2
    },
    {
      hidden: {
        operator: LogicalOperator.AND,
        conditions: [
          {
            field: 'skills',
            operator: ConditionOperator.IS_EMPTY
          }
        ]
      },
      fields: [
        {
          path: 'techStack',
          label: 'תחום התמחות (מוצג רק אם יש כישורים)',
          component: FieldComponentType.select,
          multiple: true,
          hidden: {
            operator: LogicalOperator.AND,
            conditions: [
              {
                field: 'skills',
                operator: ConditionOperator.IS_EMPTY
              }
            ]
          },
          options: {
            values: [
              { value: 'frontend', label: 'פרונטאנד' },
              { value: 'backend', label: 'בקאנד' },
              { value: 'mobile', label: 'מובייל' },
              { value: 'devops', label: 'DevOps' },
              { value: 'fullstack', label: 'פולסטק' },
              { value: 'ai_ml', label: 'בינה מלאכותית ולמידת מכונה' }
            ]
          }
        }
      ]
    }
  ]
}

export const multiSelectFields: ICollection<z.infer<typeof schema>> = {
  name: 'Multi-Select Fields',
  schema,
  defaultValues: schema.parse({}),
  uiSchema
}
