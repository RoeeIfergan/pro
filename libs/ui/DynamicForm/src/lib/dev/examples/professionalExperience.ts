import { z } from 'zod'
import { FieldComponentType, ILayoutComponentType } from '../../types/types'

export const professionalExperience = {
  schema: z
    .object({
      hasExperience: z.boolean().nullable().default(false),
      experienceYears: z
        .number()
        .min(0, 'שנות ניסיון חייבות להיות חיוביות')
        .nullable()
        .default(null),
      seniorityLevel: z.enum(['junior', 'mid', 'senior']).nullable().default(null),
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
        .default([])
    })
    .transform((data) => {
      if (!data.hasExperience) {
        return {
          ...data,
          experienceYears: null,
          seniorityLevel: null
        }
      }
      return data
    })
    .transform((data) => {
      if (data.hasExperience && (!data.experienceYears || data.experienceYears <= 0)) {
        return {
          ...data,
          seniorityLevel: null
        }
      }
      return data
    }),

  uiSchema: {
    layout: [
      {
        title: 'ניסיון מקצועי',
        component: ILayoutComponentType.box,
        collapsible: false,
        rows: [
          {
            fields: [
              {
                path: 'hasExperience',
                label: 'יש לי ניסיון מקצועי',
                component: FieldComponentType.inputCheckbox
              }
            ]
          },
          {
            fields: [
              {
                path: 'experienceYears',
                label: 'שנות ניסיון',
                component: FieldComponentType.inputNumber,
                placeholder: 'הכנס מספר שנות הניסיון'
              }
            ],
            condition: (values: any) => values.hasExperience === true
          },
          {
            fields: [
              {
                path: 'seniorityLevel',
                label: 'רמת בכירות',
                component: FieldComponentType.select,
                options: {
                  values: [
                    { value: 'junior', label: 'ג׳וניור (0-2 שנות ניסיון)' },
                    { value: 'mid', label: 'בינוני (3-5 שנות ניסיון)' },
                    { value: 'senior', label: 'בכיר (6+ שנות ניסיון)' }
                  ]
                }
              }
            ],
            condition: (values: any) => values.hasExperience === true && values.experienceYears > 0
          }
        ]
      },
      {
        title: 'כישורים מקצועיים',
        component: ILayoutComponentType.box,
        collapsible: true,
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
          }
        ]
      }
    ]
  }
}
