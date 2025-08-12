import z from 'zod'
import {
  FieldComponentType,
  ICardSchemaMeta,
  IconType,
  IOption,
  LazyLoaderType,
  WidthKey
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
        console.log('💪💪 data???', data)
        const pirates = await loadPirates()
        const pirateEnum = z.enum(pirates.map((d) => d.value) as [string, ...string[]])
        console.log('💪💪 pirateEnum???', pirateEnum)
        if (!pirateEnum.safeParse(data?.spiritId).success) {
          //   ctx.addIssue({
          //     code: 'custom',
          //     message: 'יש להזין פיראט מהרשימה',
          //     path: ['pirate', 'spiritId']
          //   })
        }
      }),

    transportation: z.enum(['car', 'bicycle', 'legs']).default('car')
  })
}

export type IDimaCardSchema = z.infer<ReturnType<typeof dimaCardSchema>>

export const uiSchema: ICardSchemaMeta<IDimaCardSchema> = {
  layout: [
    {
      fields: [
        {
          path: 'disney',
          label: 'דיסני',
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
              { value: 'car', label: 'מכונית', icon: IconType.CAR, isIconOnly: true },
              { value: 'bicycle', label: 'אופניים', icon: IconType.BICYCLE, isIconOnly: true },
              { value: 'legs', label: 'רגלים', icon: IconType.LEGS, isIconOnly: true }
            ]
          },
          width: WidthKey.W12,
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
    uiSchema
  }
}
