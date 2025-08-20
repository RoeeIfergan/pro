import * as React from 'react'
import { Outlet, useNavigate } from 'react-router'
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { routes } from './routes'

const drawerWidth = 240

const isOpenedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}))

interface AppBarProps extends MuiAppBarProps {
  isOpen?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'isOpen'
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  variants: [
    {
      props: ({ isOpen }) => isOpen,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen
        })
      }
    }
  ]
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'isOpen'
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...isOpenedMixin(theme),
        '& .MuiDrawer-paper': isOpenedMixin(theme)
      }
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme)
      }
    }
  ]
}))

const Header = () => {
  const theme = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)
  const navigate = useNavigate()

  const onClickDrawer = () => setIsOpen((prev) => !prev)

  const onRouteClick = (path: string | undefined) => {
    if (!path) return
    navigate(path)
  }

  return (
    <Box id='header-container' sx={{ width: '100%', display: 'flex', overflow: 'hidden' }}>
      <AppBar position='fixed' isOpen={isOpen}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='isOpen drawer'
            onClick={onClickDrawer}
            edge='start'
            sx={[
              {
                marginRight: 5
              },
              isOpen && { display: 'none' }
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap component='div'>
            פרו{' '}
            <span role='img' aria-label='header title'>
              😁
            </span>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant='permanent' open={isOpen}>
        <DrawerHeader>
          <IconButton onClick={onClickDrawer}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {routes.map(({ label, path, icon }, index) => (
            <ListItem
              key={`${label}-${index}`}
              disablePadding
              sx={{ display: 'block' }}
              onClick={() => onRouteClick(path)}
            >
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5
                  },
                  isOpen
                    ? {
                        justifyContent: 'initial'
                      }
                    : {
                        justifyContent: 'center'
                      }
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center'
                    },
                    isOpen
                      ? {
                          mr: 3
                        }
                      : {
                          mr: 'auto'
                        }
                  ]}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  sx={[
                    isOpen
                      ? {
                          opacity: 1
                        }
                      : {
                          opacity: 0
                        }
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component='main'
        id='main'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          width: isOpen
            ? `calc(100% - ${drawerWidth}px)`
            : {
                xs: `calc(100% - ${theme.spacing(7)} - 1px)`,
                sm: `calc(100% - ${theme.spacing(8)} - 1px)`
              },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: isOpen
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen
          })
        }}
      >
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  )
}

export default Header
