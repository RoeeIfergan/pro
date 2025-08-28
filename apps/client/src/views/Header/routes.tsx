// import PendingActionsIcon from '@mui/icons-material/PendingActions'

// import { translate } from 'utils/translate'

import DynamicFormView from '@pro3/client/src/views/DynamicFormView'
import TableView from '@pro3/client/src/views/TableView'
import { initialData as cardLoader } from '../DynamicFormView/loader'
import { initialData as tableLoader } from '@pro3/client/src/views/TableView/loader'

import DynamicFormIcon from '@mui/icons-material/DynamicForm'
import TableChartIcon from '@mui/icons-material/TableChart'

import { RouteObject } from 'react-router'
import DNDCard from '../DNDCard'

type routeInfo = {
  label: string
  icon: JSX.Element
  showInHeader?: boolean
}

export const routes: (routeInfo & RouteObject)[] = [
  {
    index: true,
    label: 'DynamicForm',
    path: '/DynamicForm',
    icon: <DynamicFormIcon />,
    Component: DynamicFormView,
    loader: cardLoader
  },
  {
    label: 'DNDCard',
    path: '/DNDCard',
    icon: <DynamicFormIcon />,
    Component: DNDCard,
    loader: cardLoader
  },

  {
    label: 'table',
    path: '/table',
    icon: <TableChartIcon />,
    Component: TableView,
    loader: tableLoader
  }
]
