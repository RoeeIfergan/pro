import { z } from 'zod'
import { IconType, LazyLoaderType, WidthKey } from '../../types'
import {
  ICardSchemaMeta,
  FieldComponentType,
  LogicalOperator,
  ConditionOperator
} from '../../types'
import { ICollection } from '../collections'
import { IOption } from '../../types'

export const baseCardSchema = ({
  loadDepartments
}: {
  loadDepartments: () => Promise<IOption[]>
}) => {
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

    .superRefine(async (data, ctx) => {
      if (data.hasExperience && (!data.experienceYears || data.experienceYears <= 0)) {
        ctx.addIssue({
          code: 'custom',
          message: 'שנות ניסיון חייבות להיות חיוביות',
          path: ['experienceYears']
        })
      }

      if (data.role === 'teacher') {
        if (!data?.teachingDetails) {
          ctx.addIssue({
            code: 'custom',
            message: 'פרטי הוראה חייבים להיות מוגדרים',
            path: ['teachingDetails']
          })
        }

        const departments = await loadDepartments()
        const departmentEnum = z.enum(departments.map((d) => d.value) as [string, ...string[]])

        if (!departmentEnum.safeParse(data?.teachingDetails?.department).success) {
          ctx.addIssue({
            code: 'custom',
            message: 'מחלקה חייבת להיות מוגדרת ברשימה',
            path: ['teachingDetails', 'department']
          })
        }
      }
    })
}

export type IBaseCardSchema = z.infer<ReturnType<typeof baseCardSchema>>

export const uiSchema: ICardSchemaMeta<IBaseCardSchema> = {
  layout: [
    {
      title: 'מידע כללי',
      fields: [
        {
          width: WidthKey.W12,
          path: 'role',
          label: 'תפקיד',
          component: FieldComponentType.buttonsGroup,
          options: {
            values: [
              { value: 'student', label: 'תלמיד' },
              { value: 'teacher', label: 'מורה', badge: { text: 'חדש', color: 'success' } },
              { value: 'admin', label: 'מנהל', badge: { text: 'VIP', color: 'warning' } },
              { value: 'moderator', label: 'מנחה' }
            ]
          }
        }
      ]
    },

    {
      title: 'פרטי הוראה',
      hidden: {
        operator: LogicalOperator.AND,
        conditions: [
          {
            field: 'role',
            operator: ConditionOperator.NOT_EQUALS,
            value: 'teacher'
          }
        ]
      },
      fields: [
        {
          path: 'teachingDetails.department',
          label: 'מחלקה (טעינה דינמית)',
          component: FieldComponentType.select,
          options: {
            lazyValues: LazyLoaderType.LOAD_DEPARTMENTS
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
    },

    {
      title: 'מידע אישי בסיסי',
      defaultExpanded: true,
      fields: [
        {
          path: 'firstName',
          label: 'שם פרטי',
          component: FieldComponentType.inputText,
          placeholder: 'הכנס את השם הפרטי',
          width: WidthKey.W6,
          required: true
        },
        {
          path: 'lastName',
          label: 'שם משפחה',
          component: FieldComponentType.inputText,
          placeholder: 'הכנס את שם המשפחה',
          width: WidthKey.W6,
          required: true
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
            operator: LogicalOperator.AND,
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
    },

    {
      title: 'פרטי כתובת',
      collapsible: true,
      defaultExpanded: false,
      fields: [
        {
          path: 'address.street',
          label: 'כתובת רחוב',
          component: FieldComponentType.inputText,
          placeholder: 'הכנס את כתובת הרחוב שלך'
        },
        {
          path: 'avatarUrl',
          label: 'קישור לתמונת פרופיל',
          component: FieldComponentType.inputUrl,
          placeholder: 'הכנס קישור לתמונת הפרופיל שלך'
        }
      ],
      fieldsPerRow: 2,
      gap: 2
    },
    {
      fields: [
        {
          path: 'birthDate',
          label: 'תאריך לידה',
          component: FieldComponentType.inputDate
        }
      ]
    },
    {
      fields: [
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
      gap: 3
    },
    {
      fields: [
        {
          path: 'country',
          label: 'מדינה',
          component: FieldComponentType.select,
          required: false,
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
        }
      ]
    },
    {
      title: 'מידע על התלמיד',
      collapsible: true,
      hidden: {
        operator: LogicalOperator.AND,
        conditions: [
          {
            field: 'role',
            operator: ConditionOperator.NOT_EQUALS,
            value: 'student'
          }
        ]
      },
      fields: [
        {
          path: 'schoolInfo.grade',
          label: 'רמת כיתה',
          component: FieldComponentType.inputText,
          placeholder: 'הכנס את רמת הכיתה שלך'
        },
        {
          path: 'schoolInfo.favoriteSubject',
          label: 'מקצוע מועדף',
          component: FieldComponentType.inputText,
          placeholder: 'הכנס את המקצוע המועדף שלך'
        }
      ],
      fieldsPerRow: 2,
      gap: 2
    },

    {
      title: 'הרשאות מנהל',
      collapsible: true,
      hidden: {
        operator: LogicalOperator.AND,
        conditions: [
          {
            field: 'role',
            operator: ConditionOperator.NOT_EQUALS,
            value: 'admin'
          }
        ]
      },
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
    },
    {
      title: 'העדפות משתמש',
      collapsible: true,
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
    },
    {
      title: 'מידע נוסף',
      collapsible: true,
      fields: [
        {
          path: 'bio',
          label: 'ביוגרפיה',
          component: FieldComponentType.textarea,
          placeholder: 'הכנס את הביוגרפיה שלך'
        }
      ]
    },
    {
      title: 'דוגמאות לתנאים (Conditional Fields)',
      collapsible: true,
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
      hidden: {
        operator: LogicalOperator.AND,
        conditions: [
          {
            field: 'hasExperience',
            operator: ConditionOperator.IS_FALSE
          }
        ]
      }
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
      hidden: {
        operator: LogicalOperator.OR,
        conditions: [
          {
            field: 'hasExperience',
            operator: ConditionOperator.IS_FALSE
          },
          {
            field: 'experienceYears',
            operator: ConditionOperator.IS_EMPTY
          },
          {
            field: 'experienceYears',
            operator: ConditionOperator.LESS_OR_EQUAL,
            value: 0
          }
        ]
      }
    },
    {
      title: 'דוגמאות לבחירה מרובה (Multi-Select)',
      collapsible: true,
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
      title: 'טווח תאריכים (Date Range)',
      collapsible: true,
      fields: [
        {
          path: 'projectDateRange',
          label: 'תאריכי פרויקט',
          component: FieldComponentType.inputDateRange,
          startDateLabel: 'תאריך התחלה',
          endDateLabel: 'תאריך סיום',
          startDatePlaceholder: 'הכנס את תאריך ההתחלה',
          endDatePlaceholder: 'הכנס את תאריך הסיום',
          startDatePath: 'projectDateRange.startDate',
          endDatePath: 'projectDateRange.endDate'
        }
      ]
    },
    {
      fields: [
        {
          path: 'vacationDates',
          label: 'תאריכי חופשה (אסור בעבר)',
          component: FieldComponentType.inputDateRange,
          startDateLabel: 'תאריך התחלה',
          endDateLabel: 'תאריך סיום',
          startDatePlaceholder: 'הכנס את תאריך ההתחלה',
          endDatePlaceholder: 'הכנס את תאריך הסיום',
          startDatePath: 'vacationDates.startDate',
          endDatePath: 'vacationDates.endDate'
        }
      ]
    },
    {
      title: 'דוגמה: בקרת מיקום קבוצות עם groupOrder',
      collapsible: true,
      fields: [
        // קבוצה ימנית (groupOrder גבוה יותר)
        {
          path: 'email',
          label: 'אימייל - קבוצה ימנית (groupOrder: 20)',
          component: FieldComponentType.inputEmail,
          placeholder: 'אני אופיע בצד ימין',
          width: WidthKey.W6,
          groupKey: 'rightGroup',
          groupOrder: 20
        },
        {
          path: 'country',
          label: 'מדינה - קבוצה ימנית (groupOrder: 20)',
          component: FieldComponentType.select,
          width: WidthKey.W6,
          groupKey: 'rightGroup',
          groupOrder: 20,
          options: {
            values: [
              { value: 'us', label: 'ארצות הברית' },
              { value: 'uk', label: 'בריטניה' },
              { value: 'ca', label: 'קנדה' },
              { value: 'de', label: 'גרמניה' },
              { value: 'fr', label: 'צרפת' }
            ]
          }
        },

        // קבוצה שמאלית (groupOrder נמוך יותר)
        {
          path: 'firstName',
          label: 'שם פרטי - קבוצה שמאלית (groupOrder: 10)',
          component: FieldComponentType.inputText,
          placeholder: 'אני אופיע בצד שמאל',
          width: WidthKey.W6,
          groupKey: 'leftGroup',
          groupOrder: 10,
          required: true
        },
        {
          path: 'lastName',
          label: 'שם משפחה - קבוצה שמאלית (groupOrder: 10)',
          component: FieldComponentType.inputText,
          placeholder: 'אני גם אופיע בצד שמאל',
          width: WidthKey.W6,
          groupKey: 'leftGroup',
          groupOrder: 10,
          required: true
        }
      ]
    },
    {
      title: 'דוגמה: שדות יחידים וקבוצות מעורבים',
      collapsible: true,
      fields: [
        // שדה יחיד ראשון (groupOrder: 5)
        {
          path: 'address.street',
          label: 'כותרת ראשית (groupOrder: 5 - יופיע ראשון)',
          component: FieldComponentType.inputText,
          placeholder: 'אני שדה יחיד ראשון',
          groupOrder: 5,
          width: WidthKey.W12
        },

        // קבוצת שדות (groupOrder: 15)
        {
          path: 'firstName',
          label: 'שם פרטי - קבוצה (groupOrder: 15)',
          component: FieldComponentType.inputText,
          placeholder: 'קבוצת שדות באמצע',
          groupKey: 'nameGroup',
          groupOrder: 15,
          width: WidthKey.W6,
          required: true
        },
        {
          path: 'lastName',
          label: 'שם משפחה - קבוצה (groupOrder: 15)',
          component: FieldComponentType.inputText,
          placeholder: 'גם בקבוצת שדות באמצע',
          groupKey: 'nameGroup',
          groupOrder: 15,
          width: WidthKey.W6,
          required: true
        },

        // שדה יחיד אחרון (groupOrder: 25)
        {
          path: 'email',
          label: 'סיכום (groupOrder: 25 - יופיע אחרון)',
          component: FieldComponentType.inputEmail,
          placeholder: 'אני שדה יחיד אחרון',
          groupOrder: 25,
          width: WidthKey.W12
        }
      ],
      gap: 2
    },
    {
      title: 'דוגמה: שני שדות מול שדה יחיד',
      collapsible: true,
      fields: [
        {
          path: 'address.city',
          label: 'עיר - עמודה רחבה שדה תחתון',
          component: FieldComponentType.inputText,
          placeholder: 'הכנס את שם העיר שלך',
          required: true,
          width: WidthKey.W8,
          groupKey: 'leftColumn',
          groupOrder: 20
        },
        {
          path: 'address.street',
          label: 'כתובת רחוב - עמודה רחבה שדה עליון',
          component: FieldComponentType.inputText,
          placeholder: 'הכנס את כתובת הרחוב שלך',
          width: WidthKey.W8,
          groupKey: 'leftColumn',
          groupOrder: 20
        },

        {
          // Single field for right column (width 4) taking full height
          path: 'country',
          label: 'מדינה - עמודה צרה (גובה מלא)',
          component: FieldComponentType.select,
          width: WidthKey.W4,
          groupKey: 'rightColumn',
          groupOrder: 10,
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
        }
      ]
    },
    {
      title: 'כפתורי בוטונים - מצבי תצוגה מעורבים',
      collapsible: true,
      fields: [
        {
          width: WidthKey.W6,
          path: 'mixedButtonsSelection',
          label: 'בחר אפשרות (כל כפתור עם מצב תצוגה משלו)',
          component: FieldComponentType.buttonsGroup,
          options: {
            values: [
              {
                value: 'home',
                label: 'בית',
                icon: IconType.HOME,
                isIconOnly: true
              },
              {
                value: 'settings',
                label: 'הגדרות',
                icon: IconType.SETTINGS
              },
              {
                value: 'profile',
                label: 'פרופיל אישי'
              },
              {
                value: 'save',
                label: 'שמור',
                icon: IconType.SAVE,
                isIconOnly: true
              },
              {
                value: 'delete',
                label: 'מחק',
                icon: IconType.DELETE
              }
            ]
          }
        },
        {
          path: 'iconOnlyGroup',
          label: 'קבוצת אייקונים בלבד',
          component: FieldComponentType.buttonsGroup,
          width: WidthKey.W6,
          groupKey: 'rightColumn',
          options: {
            values: [
              {
                value: 'add',
                label: 'הוסף',
                icon: IconType.ADD,
                isIconOnly: true,
                badge: { text: '+', color: 'secondary' }
              },
              {
                value: 'edit',
                label: 'ערוך',
                icon: IconType.EDIT,
                isIconOnly: true,
                badge: { text: '2', color: 'primary' }
              }
            ]
          }
        }
      ]
    },
    {
      fields: [
        {
          path: 'iconOnlyGroup',
          label: 'קבוצת אייקונים בלבד',
          component: FieldComponentType.buttonsGroup,
          options: {
            values: [
              {
                value: 'add',
                label: 'הוסף',
                icon: IconType.ADD,
                isIconOnly: true,
                badge: { text: '+', color: 'secondary' }
              },
              {
                value: 'edit',
                label: 'ערוך',
                icon: IconType.EDIT,
                isIconOnly: true,
                badge: { text: '2', color: 'primary' }
              },
              {
                value: 'check',
                label: 'אשר',
                icon: IconType.CHECK,
                isIconOnly: true,
                badge: { text: '✓' }
              }
            ]
          }
        }
      ]
    },
    {
      fields: [
        {
          path: 'textAndIconGroup',
          label: 'קבוצת טקסט ואייקונים',
          component: FieldComponentType.buttonsGroup,
          options: {
            values: [
              {
                value: 'email',
                label: 'אימייל',
                icon: IconType.EMAIL,
                badge: { text: '5', color: 'primary' }
              },
              {
                value: 'phone',
                label: 'טלפון',
                icon: IconType.PHONE,
                badge: { text: '1', color: 'success' }
              },
              {
                value: 'location',
                label: 'מיקום',
                icon: IconType.LOCATION,
                badge: { text: '2', color: 'info' }
              }
            ]
          }
        }
      ]
    },
    {
      title: 'הגבלות קלט (Input Limitations)',
      collapsible: true,
      fields: [
        {
          path: 'age',
          label: 'גיל (מינימום 18, מקסימום 100)',
          component: FieldComponentType.inputNumber,
          placeholder: 'הכנס את גילך',
          min: 18,
          max: 100
        },
        {
          path: 'firstName',
          label: 'שם פרטי (מושבת)',
          component: FieldComponentType.inputText,
          placeholder: 'שדה זה מושבת',
          disabled: {
            operator: LogicalOperator.OR,
            conditions: [
              {
                field: 'firstName',
                operator: ConditionOperator.IS_EMPTY
              },
              {
                field: 'firstName',
                operator: ConditionOperator.IS_NOT_EMPTY
              }
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
          path: 'bio',
          label: 'ביוגרפיה (מינימום 10 תווים, מקסימום 200)',
          component: FieldComponentType.textarea,
          placeholder: 'כתוב על עצמך (בין 10-200 תווים)',
          min: 10,
          max: 200
        }
      ]
    },
    {
      fields: [
        {
          path: 'firstName',
          label: 'שם קצר (מקסימום 5 תווים)',
          component: FieldComponentType.inputText,
          placeholder: 'עד 5 תווים בלבד',
          max: 5
        },
        {
          path: 'email',
          label: 'אימייל (מינימום 5 תווים)',
          component: FieldComponentType.inputEmail,
          placeholder: 'לפחות 5 תווים',
          min: 5
        }
      ],
      fieldsPerRow: 2,
      gap: 2
    }
  ]
}

export const baseCard = async ({
  loadDepartments
}: {
  loadDepartments: () => Promise<IOption[]>
}): Promise<ICollection<IBaseCardSchema>> => ({
  name: 'Base Card',
  schema: baseCardSchema({ loadDepartments }),
  defaultValues: await baseCardSchema({ loadDepartments }).parseAsync({}),
  uiSchema
})
