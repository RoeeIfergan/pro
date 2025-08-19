import { CreateScreenDTO, ScreenDTO, UpdateScreenDTO } from '@pro3/database'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export const useScreens = (query: ScreenDTO) =>
  useQuery({
    queryKey: ['screens', query],
    queryFn: async () => {
      const { data } = await axios.get<Screen[]>('/api/screens', {
        params: query
      })

      return data
    }
  })

export const useScreenById = (id?: number) =>
  useQuery<Screen>({
    queryKey: ['screens', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/screens/${id}`)
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
