import { FieldComponentType, ICardSchemaMeta, ILayoutComponentType } from '../types/types'

export const uiSchema: ICardSchemaMeta = {
  layout: [
    {
      title: 'בדיקת עמודות פשוטה',
      component: ILayoutComponentType.box,
      collapsible: true,
      rows: [
        {
          columns: [
            {
              width: 8,
              rows: [
                {
                  fields: [
                    {
                      path: 'firstName',
                      label: 'שדה בעמודה רחבה (8/12)',
                      component: FieldComponentType.inputText,
                      placeholder: 'זה צריך להיות רחב'
                    }
                  ]
                }
              ]
            },
            {
              width: 4,
              rows: [
                {
                  fields: [
                    {
                      path: 'email',
                      label: 'שדה בעמודה צרה (4/12)',
                      component: FieldComponentType.inputEmail,
                      placeholder: 'זה צריך להיות צר'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'מידע כללי',
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
          condition: (values: any) => values.subscribed === true // 🎯 Show only when subscribed
        }
      ]
    },
    {
      title: 'פרטי כתובת',
      component: ILayoutComponentType.box,
      collapsible: true,
      rows: [
        {
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
        }
      ]
    },
    {
      title: 'מידע על התלמיד',
      component: ILayoutComponentType.box,
      collapsible: true,
      condition: (v: any) => v.role === 'student',
      rows: [
        {
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
        }
      ]
    },
    {
      title: 'פרטי הוראה',
      component: ILayoutComponentType.box,
      collapsible: true,
      condition: (v: any) => v.role === 'teacher',
      rows: [
        {
          fields: [
            {
              path: 'teachingDetails.department',
              label: 'מחלקה',
              component: FieldComponentType.select,
              options: {
                // asyncValues: loadDepartments // TODO: Fix loadDepartments reference
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
    },
    {
      title: 'העדפות משתמש',
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
              path: 'bio',
              label: 'ביוגרפיה',
              component: FieldComponentType.textarea,
              placeholder: 'הכנס את הביוגרפיה שלך'
            }
          ]
        }
      ]
    },
    {
      title: 'דוגמאות לתנאים (Conditional Fields)',
      component: ILayoutComponentType.box,
      collapsible: true,
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
          condition: (values: any) => values.hasExperience === true // Show only if has experience
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
      title: 'דוגמאות לבחירה מרובה (Multi-Select)',
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
        }
      ]
    },

    {
      title: 'טווח תאריכים (Date Range)',
      component: ILayoutComponentType.box,
      collapsible: true,
      rows: [
        {
          fields: [
            {
              path: 'projectDateRange',
              label: 'תאריכי פרויקט',
              component: FieldComponentType.inputDateRange,
              startDateLabel: 'תאריך התחלה',
              endDateLabel: 'תאריך סיום',
              startDatePlaceholder: 'הכנס את תאריך ההתחלה',
              endDatePlaceholder: 'הכנס את תאריך הסיום',
              startDatePath: 'startDate',
              endDatePath: 'endDate'
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
        }
      ]
    },

    {
      title: 'דוגמה: שני שדות מול שדה יחיד',
      component: ILayoutComponentType.box,
      collapsible: true,
      rows: [
        {
          columns: [
            {
              width: 8, // 66% מהרוחב
              rows: [
                {
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
                  ],
                  gap: 2
                }
              ]
            },
            {
              width: 4, // 33% מהרוחב
              rows: [
                {
                  fields: [
                    {
                      path: 'country',
                      label: 'מדינה - עמודה צרה (גובה מלא)',
                      component: FieldComponentType.select,
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
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
