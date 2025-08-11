import {
  FieldComponentType,
  ICardSchemaMeta,
  ConditionOperator,
  LogicalOperator,
  IconType,
  WidthKey
} from '../types/types'
import { ICardSchema } from './testSchema'

export const uiSchema: ICardSchemaMeta<ICardSchema> = {
  layout: [
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
      title: 'פרטי קשר',
      fields: [
        {
          path: 'email',
          label: 'כתובת אימייל',
          component: FieldComponentType.inputEmail,
          placeholder: 'הכנס כתובת אימייל',
          width: WidthKey.W8,
          required: true
        },
        {
          path: 'age',
          label: 'גיל',
          component: FieldComponentType.inputNumber,
          placeholder: 'הכנס גיל',
          width: WidthKey.W4,
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
          component: FieldComponentType.inputSwitch
        },
        {
          path: 'darkModeEnabled',
          label: 'מצב לילה',
          component: FieldComponentType.inputCheckbox
        }
      ]
    },
    {
      hidden: {
        operator: LogicalOperator.AND,
        conditions: [
          {
            field: 'firstName',
            operator: ConditionOperator.EQUALS,
            value: 'test'
          }
        ]
      },
      fields: [
        {
          path: 'firstName',
          label: 'שדה בעמודה רחבה (8/12)',
          component: FieldComponentType.inputText,
          placeholder: 'זה צריך להיות רחב'
        }
      ]
    },
    {
      fields: [
        {
          path: 'firstName',
          label: 'שדה בעמודה רחבה (8/12)',
          component: FieldComponentType.inputText,
          placeholder: 'זה צריך להיות רחב',
          width: WidthKey.W8
        },
        {
          path: 'email',
          label: 'שדה בעמודה צרה (4/12)',
          component: FieldComponentType.inputEmail,
          placeholder: 'זה צריך להיות צר',
          width: WidthKey.W4
        }
      ]
    },
    {
      title: 'מידע כללי',
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
    },
    {
      fields: [
        {
          path: 'firstName',
          label: 'שם פרטי',
          component: FieldComponentType.inputText,
          placeholder: 'הכנס את שמך הפרטי'
        },
        {
          path: 'lastName',
          label: 'שם משפחה',
          component: FieldComponentType.inputText,
          placeholder: 'הכנס את שם המשפחה שלך'
        }
      ],
      fieldsPerRow: 2,
      gap: 2
    },
    {
      fields: [
        {
          path: 'email',
          label: 'כתובת אימייל',
          component: FieldComponentType.inputEmail,
          placeholder: 'הכנס את כתובת האימייל שלך'
        }
      ]
    },
    {
      fields: [
        {
          path: 'age',
          label: 'גיל',
          component: FieldComponentType.inputNumber,
          placeholder: 'הכנס את גילך'
        },
        {
          path: 'birthDate',
          label: 'תאריך לידה',
          component: FieldComponentType.inputDate
        }
      ],
      fieldsPerRow: 2,
      gap: 2
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
    },
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
      fieldsPerRow: 1,
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
      title: 'פרטי כתובת',
      collapsible: true,
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
      title: 'פרטי הוראה',
      collapsible: true,
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
          label: 'מחלקה',
          component: FieldComponentType.select,
          options: {
            values: [
              { value: 'engineering', label: 'הנדסה' },
              { value: 'marketing', label: 'שיווק' },
              { value: 'sales', label: 'מכירות' }
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
      title: 'דוגמה: שני שדות מול שדה יחיד',
      collapsible: true,
      fields: [
        {
          // Field group for left column (width 8) with two stacked fields
          width: WidthKey.W8,
          fields: [
            {
              path: 'address.street',
              label: 'כתובת רחוב - עמודה רחבה שדה עליון',
              component: FieldComponentType.inputText,
              placeholder: 'הכנס את כתובת הרחוב שלך'
            },
            {
              path: 'address.city',
              label: 'עיר - עמודה רחבה שדה תחתון',
              component: FieldComponentType.inputText,
              placeholder: 'הכנס את שם העיר שלך'
            }
          ]
        },
        {
          // Single field for right column (width 4) taking full height
          path: 'country',
          label: 'מדינה - עמודה צרה (גובה מלא)',
          component: FieldComponentType.select,
          width: WidthKey.W4,
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
          width: WidthKey.W6,
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
                    isIconOnly: true
                  },
                  {
                    value: 'edit',
                    label: 'ערוך',
                    icon: IconType.EDIT,
                    isIconOnly: true
                  }
                ]
              }
            }
          ]
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
                isIconOnly: true
              },
              {
                value: 'edit',
                label: 'ערוך',
                icon: IconType.EDIT,
                isIconOnly: true
              },
              {
                value: 'check',
                label: 'אשר',
                icon: IconType.CHECK,
                isIconOnly: true
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
                icon: IconType.EMAIL
              },
              {
                value: 'phone',
                label: 'טלפון',
                icon: IconType.PHONE
              },
              {
                value: 'location',
                label: 'מיקום',
                icon: IconType.LOCATION
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
