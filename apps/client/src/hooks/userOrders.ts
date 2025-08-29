import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { STEP_ORDERS_QUERY_KEY } from './stepOrders'

export const USER_ORDERS_QUERY_KEY = ['userOrders'] as const

export const useUserOrders = (userId: string) => {
  return useQuery({
    queryKey: [...USER_ORDERS_QUERY_KEY, userId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${userId}/orders`)
      return data
    },
    enabled: !!userId
  })
}

export const useApproveOrders = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ids }: { userId?: string; ids: string[] }) => {
      const { data } = await axios.post(`/api/orders/approvals`, { ids })
      return data
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: [...USER_ORDERS_QUERY_KEY, userId] })
      queryClient.invalidateQueries({ queryKey: STEP_ORDERS_QUERY_KEY })
    }
  })
}

export const useRejectOrders = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ids }: { userId?: string; ids: string[] }) => {
      const { data } = await axios.post(`/api/orders/rejections`, { ids })
      return data
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: [...USER_ORDERS_QUERY_KEY, userId] })
      queryClient.invalidateQueries({ queryKey: STEP_ORDERS_QUERY_KEY })
    }
  })
}
