import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export const USER_ORDERS_QUERY_KEY = ['userOrders'] as const

export const useApproveOrders = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ids }: { userId?: string; ids: string[] }) => {
      const { data } = await axios.post(`/api/orders/approvals`, { ids })
      return data
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: [...USER_ORDERS_QUERY_KEY, 'orders', userId] })
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
      queryClient.invalidateQueries({ queryKey: [...USER_ORDERS_QUERY_KEY, 'orders', userId] })
    }
  })
}
