import { Box, styled } from '@mui/material'
import { createBrowserRouter, RouterProvider } from 'react-router'

import Header from '@client/views/Header'
import { routes } from '@client/views/Header/routes'

const RootBox = styled(Box)(
  ({ theme }) => `
    display: flex;
    height: 100%;
    background-color: ${theme.palette.primary.main};
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
