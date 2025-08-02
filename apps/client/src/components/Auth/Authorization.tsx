import { createContext, PropsWithChildren, ReactNode, useContext, useEffect, useState } from 'react'
import Axios from 'axios'
import { createMongoAbility, MongoAbility, Ability, RawRuleOf } from '@casl/ability'
import { PackRule, unpackRules } from '@casl/ability/extra'

import jwt, { JwtPayload } from 'jsonwebtoken'

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

type Actions = 'create' | 'read' | 'update' | 'delete'
type Subjects = 'Article' | 'Comment' | 'User'

type AppAbility = Ability<[Actions, Subjects]>
type Rule = RawRuleOf<AppAbility>
type PackedRule = PackRule<Rule>

interface TokenPayload extends JwtPayload {
  rules: PackedRule[] // Correct type for unpackRules()
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

      const decodedToken = jwt.decode(data.token) as TokenPayload | null

      if (!decodedToken) return

      // const rules = decodedToken.rules

      // const builder = new AbilityBuilder<AppAbility>(createMongoAbility)

      const rules = unpackRules<Rule>(decodedToken.rules)
      const ability = createMongoAbility<AppAbility>(rules)

      // const unPackedRules = unpackRules(rules)
      // const ability = builder.build()

      // ability.update(unPackedRules)
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
