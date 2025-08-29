import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { TFullUser, TUser } from '@pro3/types'

const USERS_QUERY_KEY = ['users'] as const

axios.defaults.baseURL = 'http://localhost:3000'

export const useUsers = () => {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await axios.get<TUser[]>('/api/users')
      return data
    }
  })
}

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, userId],
    queryFn: async () => {
      const { data } = await axios.get<TFullUser>(`/api/users/${userId}`)
      return data
    },
    enabled: !!userId
  })
}

export const useUserOrders = (userId: string) => {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, 'orders', userId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${userId}/orders`)
      return data
    },
    enabled: !!userId
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: Partial<TUser> }) => {
      const { data: updatedUser } = await axios.patch<TUser>(`/api/users/${userId}`, data)
      return updatedUser
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
    }
  })
}

export const useUpdateUserGroups = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, groupIds }: { userId: string; groupIds: string[] }) => {
      const { data: updatedUser } = await axios.patch<TUser>(`/api/users/${userId}`, {
        userGroupIds: groupIds
      })
      return updatedUser
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...USERS_QUERY_KEY, variables.userId] })
    }
  })
}
