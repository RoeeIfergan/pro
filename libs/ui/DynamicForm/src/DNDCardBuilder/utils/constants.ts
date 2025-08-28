export const DND_CARD_BUILDER_LABELS = {
  // Settings
  SETTINGS_SECTION: 'הגדרות',

  // Dialog titles and buttons
  EDIT_FIELD_TITLE: 'עריכת שדה',
  EDIT_ROW_TITLE: 'עריכת שורה',
  EDIT_ROWS_TITLE: 'עריכת כרטיס',
  CANCEL: 'ביטול',
  SAVE: 'שמירה',

  // Field basic properties
  FIELD_NAME: 'שם השדה (תווית)',
  FIELD_NAME_PLACEHOLDER: 'הכנס תווית לשדה...',
  FIELD_PATH: 'נתיב השדה',
  COMPONENT_TYPE: 'סוג רכיב',

  // Section titles
  LAYOUT_BEHAVIOR_SECTION: 'מאפייני פריסה והתנהגות',
  INPUT_PROPERTIES_SECTION: 'מאפייני קלט',
  SELECT_PROPERTIES_SECTION: 'מאפייני בחירה',

  // Layout & Behavior properties
  FIELD_WIDTH: 'רוחב (1-12)',
  WIDTH_AUTO: 'אוטומטי',
  FIELD_GROUP_KEY: 'מפתח קבוצה',
  FIELD_GROUP_KEY_PLACEHOLDER: 'מפתח קיבוץ אופציונלי...',
  FIELD_GROUP_KEY_HELPER: 'שדות עם אותו מפתח קבוצה יוקבצו יחד',
  FIELD_GROUP_ORDER: 'סדר קבוצה',
  FIELD_GROUP_ORDER_PLACEHOLDER: '0',
  FIELD_GROUP_ORDER_HELPER: 'מספרים נמוכים יופיעו ראשונים (שמאל)',

  // Input properties
  PLACEHOLDER: 'טקסט כמקום מחזיק',
  PLACEHOLDER_INPUT_PLACEHOLDER: 'הכנס טקסט כמקום מחזיק...',
  PLACEHOLDER_HELPER: 'טקסט המוצג כאשר השדה ריק',
  MINIMUM_VALUE: 'ערך מינימלי',
  MAXIMUM_VALUE: 'ערך מקסימלי',
  MINIMUM_LENGTH: 'אורך מינימלי',
  MAXIMUM_LENGTH: 'אורך מקסימלי',
  MIN_VALUE_HELPER: 'ערך מינימלי מותר',
  MAX_VALUE_HELPER: 'ערך מקסימלי מותר',
  MIN_LENGTH_HELPER: 'אורך טקסט מינימלי',
  MAX_LENGTH_HELPER: 'אורך טקסט מקסימלי',

  // Select properties
  SELECT_PLACEHOLDER: 'בחר אפשרות...',
  SELECT_PLACEHOLDER_HELPER: 'טקסט המוצג כאשר לא נבחרה אפשרות',
  ALLOW_MULTIPLE: 'אפשר בחירה מרובה',

  // Validation messages
  MIN_MAX_VALIDATION_ERROR: 'הערך המינימלי לא יכול להיות גדול מהערך המקסימלי',

  // Width picker labels
  AUTO_WIDTH: 'רוחב אוטומטי',
  FIELD_WIDTH_DEFAULT: 'רוחב השדה',
  COLUMNS_WIDTH_FORMAT: (width: number) =>
    `${width}/12 עמודות (${Math.round((width / 12) * 100)}% רוחב)`,

  // Options Manager labels
  OPTIONS_COUNT: (count: number) => `אפשרויות (${count})`,
  ADD_OPTION: 'הוסף אפשרות',
  NO_OPTIONS_YET: 'אין אפשרויות עדיין',
  ADD_FIRST_OPTION: 'הוסף אפשרות ראשונה',
  OPTIONS_TIP: 'טיפ: לחץ על סמל ההרחבה בכל אפשרות לעריכת מאפיינים מתקדמים כמו אייקונים ותגיות.',
  MOVE_UP: '↑ העבר למעלה',
  MOVE_DOWN: '↓ העבר למטה',
  ADD_ANOTHER_OPTION: 'הוסף אפשרות נוספת',
  OPTIONS_SUMMARY: 'סיכום:',
  OPTION_SINGULAR: 'אפשרות',
  OPTIONS_PLURAL: 'אפשרויות',
  CONFIGURED: 'מוגדרות',
  WITH_ICONS: 'עם אייקונים',
  WITH_BADGES: 'עם תגיות',
  ICON_ONLY: 'אייקון בלבד',

  // Option Editor labels
  OPTION_VALUE: 'ערך',
  OPTION_LABEL: 'תווית',
  VALUE_TYPE: (type: string) => `סוג: ${type}`,
  OPTION_ICON: 'אייקון',
  ICON_NONE: 'ללא',
  ICON_ONLY_TOGGLE: 'אייקון בלבד',
  BADGE_OPTIONAL: 'תגית (אופציונלי)',
  BADGE_TEXT: 'טקסט תגית',
  BADGE_COLOR: 'צבע תגית',
  TYPE_STRING: 'טקסט',
  TYPE_NUMBER: 'מספר',
  TYPE_BOOLEAN: 'בוליאני',

  // Field component labels
  DRAG_TOOLTIP: 'גרור',
  EDIT_FIELD: 'ערוך שדה',
  DELETE_FIELD: 'מחק שדה',
  ADD_FIELD: 'הוספת שדה',
  ADD_ROW: 'הוספת שורה',

  // New field label
  NEW_FIELD_LABEL: 'שדה חדש',
  NEW_FIELD_PLACEHOLDER: 'הכנס טקסט כמקום מחזיק...',

  // New row label
  NEW_ROW_LABEL: 'שורה חדשה',

  // Breadcrumb labels
  BREADCRUMB_ROWS: 'כרטיס',
  BREADCRUMB_ROW: 'שורה',
  BREADCRUMB_FIELD: 'שדה',

  FIELD_HIDDEN: 'שדה מוסתר',
  FIELD_DISABLED: 'שדה מנוטרל',
  FIELD_REQUIRED: 'שדה חובה',

  // Row-specific labels
  ROW_HIDDEN: 'שורה מוסתרת',
  ROW_DISABLED: 'שורה מנוטרלת',
  ROW_TITLE: 'כותרת השורה',
  ROW_COLLAPSIBLE: 'שורה מתקפלת',
  ROW_DEFAULT_EXPANDED: 'פתוחה כברירת מחדל',
  ROW_GAP: 'רווח בין שדות'
}

// Layout defaults
export const DEFAULT_GAP = 3 // Default gap between fields (0 = no gap)
