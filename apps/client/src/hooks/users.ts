import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GetUserSchemaDTO, GetUserGroupSchemaDTO } from '@pro3/schemas'
import axios from 'axios'

const USERS_QUERY_KEY = ['users'] as const

axios.defaults.baseURL = 'http://localhost:3000'

export const useUsers = () => {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await axios.get<GetUserSchemaDTO[]>('/api/users')
      return data
    }
  })
}

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, userId],
    queryFn: async () => {
      const { data } = await axios.get<{
        user: GetUserSchemaDTO
        userGroups: GetUserGroupSchemaDTO[]
      }>(`/api/users/${userId}`)
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
    mutationFn: async ({ userId, data }: { userId: string; data: Partial<GetUserSchemaDTO> }) => {
      const { data: updatedUser } = await axios.patch<GetUserSchemaDTO>(
        `/api/users/${userId}`,
        data
      )
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
      const { data: updatedUser } = await axios.patch<GetUserSchemaDTO>(`/api/users/${userId}`, {
        userGroupIds: groupIds
      })
      return updatedUser
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...USERS_QUERY_KEY, variables.userId] })
    }
  })
}
