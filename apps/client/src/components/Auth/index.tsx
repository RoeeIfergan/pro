import { useState, PropsWithChildren, useEffect } from 'react'
import AuthorizationProvider from './Authorization'
// export { useAuthorizationContext } from 'components/Auth/Authorization';

const defaultUser = {
  isViewerOnly: false,
  organziation: '',
  organizationType: 'other'
}

const Authentication = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState(defaultUser)

  useEffect(() => {
    setTimeout(() => {
      setUser({
        isViewerOnly: false,
        organziation: 'hativa_100',
        organizationType: 'hativa'
      })
    }, 1000)
  }, [])
  return <AuthorizationProvider user={user}>{children}</AuthorizationProvider>
}

export default Authentication
