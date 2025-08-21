// import PendingActionsIcon from '@mui/icons-material/PendingActions'

// import { translate } from 'utils/translate'

import DynamicFormView from '@pro3/client/src/views/DynamicFormView'
import TableView from '@pro3/client/src/views/TableView'
import WorkFlowView from '@pro3/client/src/views/WorkFlowView'
import { initialData as cardLoader } from '../DynamicFormView/loader'
import { initialData as tableLoader } from '@pro3/client/src/views/TableView/loader'
import { initialData as homePageLoader } from '@pro3/client/src/views/Homepage/loader'

import DynamicFormIcon from '@mui/icons-material/DynamicForm'
import TableChartIcon from '@mui/icons-material/TableChart'
import HomeIcon from '@mui/icons-material/Home'
import AccountTreeIcon from '@mui/icons-material/AccountTree'

import { RouteObject } from 'react-router'
import HomepageView from '../Homepage'

type routeInfo = {
  label: string
  icon: JSX.Element
  showInHeader?: boolean
}

export const routes: (routeInfo & RouteObject)[] = [
  {
    index: true,
    label: 'HomePage',
    path: '/',
    icon: <HomeIcon />,
    Component: HomepageView,
    loader: homePageLoader
  },
  {
    label: 'DynamicForm',
    path: '/DynamicForm',
    icon: <DynamicFormIcon />,
    Component: DynamicFormView,
    loader: cardLoader
  },
  {
    label: 'table',
    path: '/table',
    icon: <TableChartIcon />,
    Component: TableView,
    loader: tableLoader
  },
  {
    label: 'workflow',
    path: '/workflow',
    icon: <AccountTreeIcon />,
    Component: WorkFlowView
  }
]
