import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const USER_ORDERS_QUERY_KEY = ['userOrders'] as const

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
