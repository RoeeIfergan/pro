import z from 'zod'
import {
  FieldComponentType,
  ICardSchemaMeta,
  IconType,
  IOption,
  LazyLoaderType,
  WidthKey,
  ConditionOperator
} from '../../types'
import { ICollection } from '../collections'

enum Disney {
  DISNEY = 'disney',
  PIXAR = 'pixar',
  MARVEL = 'marvel',
  STARWARS = 'starwars',
  NINTENDO = 'nintendo'
}

export const dimaCardSchema = ({ loadPirates }: { loadPirates: () => Promise<IOption[]> }) => {
  return z.object({
    name: z.string().min(1, 'יש להזין שם').default(''),

    disney: z.enum(Object.values(Disney)).default(Disney.DISNEY),

    // Black or White boolean field
    blackOrWhite: z.boolean().default(false),

    priority: z
      .object({
        customer: z.number().min(1, 'עדיפות לקוח חייבת להיות מוגדרת').default(0),
        employee: z.number().default(0),
        manager: z.number().default(0)
      })
      .default({
        customer: 0,
        employee: 0,
        manager: 0
      }),

    pirate: z
      .object({
        spiritId: z.string().min(1, 'יש להזין פיראט מהרשימה').default('')
      })
      .default({
        spiritId: ''
      })
      .superRefine(async (data, ctx) => {
        const pirates = await loadPirates()
        const pirateEnum = z.enum(pirates.map((d) => d.value) as [string, ...string[]])

        if (data?.spiritId && !pirateEnum.safeParse(data?.spiritId).success) {
          ctx.addIssue({
            code: 'custom',
            message: 'יש להזין פיראט מהרשימה',
            path: ['pirate', 'spiritId']
          })
        }
      }),

    transportation: z.enum(['car', 'bicycle', 'legs']).default('legs'),
    // Car-only fields
    time: z.number().default(60),
    speed: z.number().default(80),
    through: z.string().default('highway'),

    // Date range field
    dateRange: z
      .object({
        startDate: z.date().nullable().default(null),
        endDate: z.date().nullable().default(null)
      })
      .default({ startDate: null, endDate: null })
      .superRefine((val, ctx) => {
        if (val.startDate && val.endDate && val.endDate < val.startDate) {
          ctx.addIssue({
            code: 'custom',
            message: 'תאריך הסיום חייב להיות אחרי תאריך ההתחלה',
            path: ['endDate']
          })
        }
      }),

    // Advanced settings
    subscribed: z.boolean().default(false),
    newsletterTopics: z
      .array(z.enum(['tech', 'design', 'business', 'science', 'education']))
      .default([]),
    darkModeEnabled: z.boolean().default(false)
  })
}

export type IDimaCardSchema = z.infer<ReturnType<typeof dimaCardSchema>>

export const uiSchema: ICardSchemaMeta<IDimaCardSchema> = {
  rows: [
    {
      fields: [
        {
          label: 'דיסני',
          path: 'disney',
          component: FieldComponentType.buttonsGroup,
          options: {
            values: [
              { value: 'disney', label: 'דיסני', badge: { text: 'חדש', color: 'info' } },
              { value: 'pixar', label: 'פיקסר' },
              { value: 'marvel', label: 'מרבל' },
              {
                value: 'starwars',
                label: 'סטארוורס',
                badge: { text: 'לא בשימוש', color: 'warning' }
              },
              { value: 'nintendo', label: 'ניטנדו' }
            ]
          },
          width: WidthKey.W12
        }
      ]
    },

    {
      fields: [
        {
          path: 'name',
          label: 'שם',
          component: FieldComponentType.inputText,
          placeholder: 'הכנס את השם',
          width: WidthKey.W9,
          required: true
        },

        {
          path: 'priority.customer',
          label: 'תעדוף',
          required: true,
          component: FieldComponentType.inputNumber,
          placeholder: '',
          min: 1,
          max: 100,
          width: WidthKey.W3
        }
      ]
    },
    {
      fields: [
        {
          path: 'pirate.spiritId',
          label: 'פיראט',
          component: FieldComponentType.select,
          placeholder: 'יש לבחור פיראט',
          options: {
            lazyValues: LazyLoaderType.LOAD_PIRATES
          },
          width: WidthKey.W12
        },
        {
          path: 'transportation',
          component: FieldComponentType.buttonsGroup,
          options: {
            values: [
              { value: 'legs', label: 'רגלים', icon: IconType.LEGS, isIconOnly: true },
              { value: 'bicycle', label: 'אופניים', icon: IconType.BICYCLE, isIconOnly: true },
              { value: 'car', label: 'מכונית', icon: IconType.CAR, isIconOnly: true }
            ]
          },
          width: WidthKey.W12
        }
      ]
    },
    {
      hidden: {
        conditions: [
          { field: 'transportation', operator: ConditionOperator.NOT_EQUALS, value: 'car' }
        ]
      },
      fields: [
        {
          path: 'time',
          label: 'זמן',
          component: FieldComponentType.inputNumber,
          placeholder: '',
          width: WidthKey.W4
        },
        {
          path: 'speed',
          label: 'מהירות',
          component: FieldComponentType.inputNumber,
          placeholder: '',
          width: WidthKey.W4
        },
        {
          path: 'through',
          label: 'דרך',
          component: FieldComponentType.inputText,
          placeholder: '',
          width: WidthKey.W4
        }
      ]
    },
    {
      fields: [
        {
          path: 'dateRange',
          component: FieldComponentType.inputDateRange,
          startDateLabel: 'תאריך התחלה',
          endDateLabel: 'תאריך סיום',
          startDatePlaceholder: 'בחר תאריך התחלה',
          endDatePlaceholder: 'בחר תאריך סיום',
          startDatePath: 'dateRange.startDate',
          endDatePath: 'dateRange.endDate',
          width: WidthKey.W12
        }
      ]
    },
    {
      fields: [
        {
          path: 'blackOrWhite',
          component: FieldComponentType.buttonsGroup,
          options: {
            values: [
              { value: false, label: 'שחור' },
              { value: true, label: 'לבן' }
            ]
          },
          width: WidthKey.W12
        }
      ]
    },
    {
      title: 'הגדרות מתקדמות',
      collapsible: true,
      defaultExpanded: false,
      fields: [
        {
          path: 'subscribed',
          label: 'מנוי לניוזלטר',
          component: FieldComponentType.inputCheckbox
        },
        {
          path: 'newsletterTopics',
          label: 'נושאי ניוזלטר (בחירה מרובה)',
          component: FieldComponentType.chipsSelect,
          multiple: true,
          options: {
            values: [
              { value: 'tech', label: 'טכנולוגיה' },
              { value: 'design', label: 'עיצוב' },
              { value: 'business', label: 'עסקים' },
              { value: 'science', label: 'מדע' },
              { value: 'education', label: 'חינוך' }
            ]
          },
          hidden: {
            conditions: [
              {
                field: 'subscribed',
                operator: ConditionOperator.IS_FALSE
              }
            ]
          }
        },

        {
          path: 'darkModeEnabled',
          label: 'מצב לילה',
          component: FieldComponentType.inputSwitch
        }
      ]
    }
  ]
}

export const dimaCard = async ({
  loadPirates
}: {
  loadPirates: () => Promise<IOption[]>
}): Promise<ICollection<IDimaCardSchema>> => {
  return {
    name: 'Dima Card',
    schema: dimaCardSchema({ loadPirates }),
    defaultValues: await dimaCardSchema({ loadPirates }).parseAsync({}),
    uiSchema,
    context: {
      user: {
        role: 'student',
        level: 'beginner'
      },
      preferences: {
        theme: 'dark'
      }
    }
  }
}
