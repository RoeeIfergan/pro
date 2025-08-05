import { cardSchema } from './testSchema'
import { uiSchema } from './uiSchema'
import { address } from './examples/address'
import { basicInfo } from './examples/basicInfo'
import { studentInfo } from './examples/studentInfo'
import { teacherDetails } from './examples/teacherDetails'
import { adminPermissions } from './examples/adminPermissions'
import { dateRanges } from './examples/dateRanges'
import { userPreferences } from './examples/userPreferences'
import { professionalExperience } from './examples/professionalExperience'
import { multiSelectFields } from './examples/multiSelectFields'
import { layoutExamples } from './examples/layoutExamples'
import { QueryClient } from '@tanstack/react-query'

export const getCollections = (queryClient: QueryClient) => {
  return [
    {
      name: 'Complete Schema (Main)',
      schema: cardSchema({ queryClient }),
      uiSchema: uiSchema
    },
    {
      name: 'Basic Info',
      schema: basicInfo.schema,
      uiSchema: basicInfo.uiSchema
    },
    {
      name: 'Address Fields',
      schema: address.schema,
      uiSchema: address.uiSchema
    },
    {
      name: 'Student Information',
      schema: studentInfo.schema,
      uiSchema: studentInfo.uiSchema
    },
    {
      name: 'Teacher Details',
      schema: teacherDetails.schema,
      uiSchema: teacherDetails.uiSchema
    },
    {
      name: 'Admin Permissions',
      schema: adminPermissions.schema,
      uiSchema: adminPermissions.uiSchema
    },
    {
      name: 'Date Ranges',
      schema: dateRanges.schema,
      uiSchema: dateRanges.uiSchema
    },
    {
      name: 'User Preferences',
      schema: userPreferences.schema,
      uiSchema: userPreferences.uiSchema
    },
    {
      name: 'Professional Experience',
      schema: professionalExperience.schema,
      uiSchema: professionalExperience.uiSchema
    },
    {
      name: 'Multi-Select Fields',
      schema: multiSelectFields.schema,
      uiSchema: multiSelectFields.uiSchema
    },
    {
      name: 'Layout Examples',
      schema: layoutExamples.schema,
      uiSchema: layoutExamples.uiSchema
    }
  ]
}
