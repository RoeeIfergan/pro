import { Box, styled } from '@mui/material'
import { createBrowserRouter, RouterProvider } from 'react-router'

import Header from '@pro3/client/src/views/Header'
import { routes } from '../views/Header/routes'

const RootBox = styled(Box)(
  ({ theme }) => `
    display: flex;
    width: 100%;
    height: 100%;
    background-color: ${theme.palette.background.paper};
  `
)

const router = createBrowserRouter([
  {
    path: '/',
    Component: Header,
    // loader: homeInitialData,
    children: routes.map((route) => ({
      path: route.path,
      Component: route.Component,
      loader: route.loader
    }))
  }
])

const Router = () => {
  return (
    <RootBox>
      <RouterProvider router={router} />
    </RootBox>
  )
}
export default Router
