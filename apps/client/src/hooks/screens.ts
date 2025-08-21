import { Screen, ScreenRelations } from '@pro3/types'
import { CreateScreenDTO, UpdateScreenDTO } from '@pro3/schemas'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000'

export const useScreens = () =>
  useQuery({
    queryKey: ['screens'],
    queryFn: async () => {
      const { data } = await axios.get<Screen[]>('/api/screens')

      return data
    }
  })

export const useScreenById = (id?: string | null) =>
  useQuery<ScreenRelations>({
    queryKey: ['screens', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/screens/AllRelations/${id}`)
      return data
    },
    enabled: !!id
  })

export const useCreateScreen = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (screen: CreateScreenDTO) => {
      const { data } = await axios.post('/api/screens', screen)
      return data
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['screens'] })
    }
  })
}

export const useUpdateScreen = (id?: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (screen: UpdateScreenDTO) => {
      const { data } = await axios.patch(`/api/screens/${id}`, screen)
      return data
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['screens'] })
    }
  })
}

export const useDeleteScreen = (id?: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/screens/${id}`)
      return data
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['screens'] })
    }
  })
}
