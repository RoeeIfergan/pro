import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const STEP_USER_GROUPS_QUERY_KEY = ['stepUserGroups'] as const

export const useStepUserGroups = (stepId: string) => {
  return useQuery({
    queryKey: [...STEP_USER_GROUPS_QUERY_KEY, stepId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/steps/${stepId}/userGroups`)
      return data
    },
    enabled: !!stepId
  })
}
