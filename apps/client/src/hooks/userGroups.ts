import { useQuery } from '@tanstack/react-query'
import { TUserGroup } from '@pro3/types'
import axios from 'axios'

const USER_GROUPS_QUERY_KEY = ['userGroups'] as const
axios.defaults.baseURL = 'http://localhost:3000'

export const useUserGroups = () => {
  return useQuery({
    queryKey: USER_GROUPS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await axios.get<TUserGroup[]>('/api/userGroups')
      return data
    }
  })
}
