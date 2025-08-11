import { z } from 'zod'
import { QueryClient } from '@tanstack/react-query'

// export const useCardSchema = () => {
//   const queryClient = useQueryClient()

//   const loadDepartments = useCallback(async () => {
//     return queryClient.fetchQuery({
//       queryKey: ['departments'],
//       queryFn: () => {
//         console.log('load departments!')
//         return [
//           { value: 'engineering', label: 'הנדסה' },
//           { value: 'marketing', label: 'שיווק' },
//           { value: 'sales', label: 'מכירות' }
//         ]
//       }
//     })
//   }, [queryClient])

//   return cardSchema({ loadDepartments })
// }

export const cardSchema = ({ queryClient }: { queryClient: QueryClient }) => {
  // const loadDepartments = async () => {
  //   return queryClient.fetchQuery({
  //     queryKey: ['departments'],
  //     queryFn: () => {
  //       console.log('load departments!')
  //       return [
  //         { value: 'engineering', label: 'הנדסה' },
  //         { value: 'marketing', label: 'שיווק' },
  //         { value: 'sales', label: 'מכירות' }
  //       ]
  //     }
  //   })
  // }

  return z
    .object({
      // Basic Info
      firstName: z.string().min(1, 'שם פרטי הוא שדה חובה').default(''),
      lastName: z.string().min(1, 'שם משפחה הוא שדה חובה').default(''),
      email: z.email('כתובת אימייל שגויה').min(1, 'כתובת אימייל הוא שדה חובה').default(''),
      age: z
        .number()
        .min(0, 'גיל חייב להיות חיובי')
        .max(120, 'גיל חייב להיות בין 0 ל-120')
        .default(0),
      birthDate: z
        .date()
        .nullable()
        .default(null)
        .refine(
          (date) => {
            if (date) {
              const today = new Date()
              return date <= today || 'תאריך הלידה חייב להיות בעבר'
            }
            return true
          },
          {
            message: 'תאריך לידה לא יכול להיות בעתיד'
          }
        ),
      country: z.enum(['us', 'uk', 'ca', 'de', 'fr', 'jp', 'au']).nullable().default(null),
      role: z.enum(['student', 'teacher', 'admin', 'moderator']).nullable().default(null),
      subscribed: z.boolean().nullable().default(false),
      darkModeEnabled: z.boolean().nullable().default(false),

      // Address
      address: z
        .object({
          street: z.string().nullable().default(''),
          city: z.string().nullable().default(''),
          zip: z.string().nullable().default('')
        })
        .nullable()
        .default(null),

      // Student-specific
      schoolInfo: z
        .object({
          grade: z.string().min(1, 'כיתה חייבת להיות מוגדרת').default(''),
          favoriteSubject: z.string().min(1, 'מקצוע מועדף חייב להיות מוגדר').default('')
        })
        .nullable()
        .default(null)
        .refine(
          (data) => {
            if (data) {
              return data.grade && data.favoriteSubject
            }
            return true
          },
          {
            message: 'כיתה ומקצוע מועדף הם שדות חובה עבור תלמידים',
            path: ['schoolInfo']
          }
        ),

      // Teacher-specific
      teachingDetails: z
        .object({
          department: z.string().min(1, 'מחלקה חייבת להיות מוגדרת').default(''),
          yearsOfExperience: z
            .number('הקלד מספר')
            .min(0, 'שנות ניסיון חייבות להיות מוגדרת')
            .default(0)
        })
        .nullable()
        .default(null),

      // Admin-only
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
        ),

      // Preferences
      preferences: z
        .object({
          theme: z.enum(['light', 'dark', 'auto']).nullable().optional(),
          language: z.string().default('')
        })
        .optional(),

      // Date Range Examples
      projectDateRange: z
        .object({
          startDate: z.date().nullable().default(null),
          endDate: z.date().nullable().default(null)
        })
        .nullable()
        .default(null)
        .refine(
          (data) => {
            if (data?.startDate && data?.endDate) {
              return data.startDate <= data.endDate
            }
            return true
          },
          {
            message: 'תאריך הסיום חייב להיות אחרי תאריך ההתחלה',
            path: ['endDate']
          }
        ),
      vacationDates: z
        .object({
          startDate: z.date().nullable().default(null),
          endDate: z.date().nullable().default(null)
        })
        .nullable()
        .default(null)
        .refine(
          (data) => {
            if (data?.startDate && data?.endDate) {
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              return data.startDate >= today
            }
            return true
          },
          {
            message: 'תאריך חופשה לא יכול להיות בעבר',
            path: ['startDate']
          }
        ),

      // Extra
      bio: z.string().default(''),
      avatarUrl: z.url('קישור לתמונת פרופיל שגוי').default(''),
      newsletterTopics: z
        .array(z.enum(['tech', 'design', 'business', 'science', 'education']))
        .default([]),

      // Conditional fields examples
      hasExperience: z.boolean().nullable().default(false),
      experienceYears: z
        .number()
        .min(0, 'שנות ניסיון חייבות להיות חיוביות')
        .nullable()
        .default(null),

      seniorityLevel: z.enum(['junior', 'mid', 'senior']).nullable().default(null),

      // Multi-select examples
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

      // Button group examples with per-button display modes
      mixedButtonsSelection: z
        .enum(['home', 'settings', 'profile', 'save', 'delete'])
        .nullable()
        .default(null),
      iconOnlyGroup: z.enum(['add', 'edit', 'check']).nullable().default(null),
      textAndIconGroup: z.enum(['email', 'phone', 'location']).nullable().default(null)
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
    })

    .transform((data) => {
      if (data.role !== 'teacher') {
        return {
          ...data,
          teachingDetails: null
        }
      }
      return data
    })

    .superRefine((data, ctx) => {
      if (data.hasExperience && (!data.experienceYears || data.experienceYears <= 0)) {
        ctx.addIssue({
          code: 'custom',
          message: 'שנות ניסיון חייבות להיות חיוביות',
          path: ['experienceYears']
        })
      }

      // if (data.role === 'teacher') {
      //   if (!data?.teachingDetails) {
      //     ctx.addIssue({
      //       code: 'custom',
      //       message: 'פרטי הוראה חייבים להיות מוגדרים',
      //       path: ['teachingDetails']
      //     })
      //   }

      //   const departments = await loadDepartments()
      //   const departmentEnum = z.enum(departments.map((d) => d.value) as [string, ...string[]])

      //   if (!departmentEnum.safeParse(data?.teachingDetails?.department).success) {
      //     ctx.addIssue({
      //       code: 'custom',
      //       message: 'מחלקה חייבת להיות מוגדרת ברשימה',
      //       path: ['teachingDetails', 'department']
      //     })
      //   }
      // }
    })
}

export type ICardSchema = z.infer<ReturnType<typeof cardSchema>>
