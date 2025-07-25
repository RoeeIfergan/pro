import { createContext, PropsWithChildren, ReactNode, useContext, useEffect, useState } from 'react'
import Axios from 'axios'
import { createMongoAbility, AbilityBuilder, MongoAbility } from '@casl/ability'
import { unpackRules } from '@casl/ability/extra'

import jwt from 'jsonwebtoken'

type AuthorizationContextValue = {
  ability?: MongoAbility
}

type AuthorizationProviderProps = PropsWithChildren & {
  user: object
}

const defaultAuthorizationContextValue = {}

const AuthorizationContext = createContext<AuthorizationContextValue>({})

const RenderChildrenIfContextHasValue = ({ children }: PropsWithChildren): ReactNode => {
  const { ability } = useAuthorizationContext()

  if (!ability) return null

  return children
}

export const useAuthorizationContext = (): AuthorizationContextValue => {
  const contextValue = useContext(AuthorizationContext)

  if (contextValue === undefined) {
    throw new Error('useAuthorizationContext can not be called outside of AuthorizationProvider!')
  }

  return contextValue
}

const AuthorizationProvider = ({ user, children }: AuthorizationProviderProps): ReactNode => {
  const [contextValue, setContextValue] = useState<AuthorizationContextValue>(
    defaultAuthorizationContextValue
  )

  useEffect(() => {
    const run = async () => {
      const { data } = await Axios({
        method: 'GET',
        url: `http://localhost:${import.meta.env.VITE_SERVER_PORT}/auth`,
        params: { userId: 'Roee' }
      })

      const decodedToken = jwt.decode(data.token)

      const builder = new AbilityBuilder(createMongoAbility)
      const { rules } = decodedToken

      const unPackedRules = unpackRules(rules)
      const ability = builder.build()

      ability.update(unPackedRules)
      // authorizer.getPermission()
      // const permissions = getUserPermmissions(user)
      // authorizer.setPermission(permissions)

      setContextValue({ ability })
    }
    run()
  }, [user])

  return (
    <AuthorizationContext.Provider value={contextValue}>
      <RenderChildrenIfContextHasValue>{children}</RenderChildrenIfContextHasValue>
    </AuthorizationContext.Provider>
  )
}
export default AuthorizationProvider
