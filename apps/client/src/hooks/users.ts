import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GetUserSchemaDTO } from '@pro3/schemas'
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
      const { data } = await axios.get<GetUserSchemaDTO>(`/api/users/${userId}`)
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
