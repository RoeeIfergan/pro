import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const STEP_ORDERS_QUERY_KEY = ['stepOrders'] as const

export const useStepOrders = (stepId: string) => {
  return useQuery({
    queryKey: [...STEP_ORDERS_QUERY_KEY, stepId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/steps/${stepId}/orders`)
      return data
    },
    enabled: !!stepId
  })
}
