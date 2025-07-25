// import PendingActionsIcon from '@mui/icons-material/PendingActions'

// import { translate } from 'utils/translate'

import CardView from '@pro2/client/src/views/CardView/CardView'
import TableView from '@pro2/client/src/views/TableView'
import { initialData as cardLoader } from '@pro2/client/src/views/CardView/loader'
import { initialData as tableLoader } from '@pro2/client/src/views/TableView/loader'

import DynamicFormIcon from '@mui/icons-material/DynamicForm'
import TableChartIcon from '@mui/icons-material/TableChart'

import { RouteObject } from 'react-router'

type routeInfo = {
  label: string
  icon: JSX.Element
  showInHeader?: boolean
}

export const routes: (routeInfo & RouteObject)[] = [
  {
    label: 'card',
    path: '/card',
    icon: <DynamicFormIcon />,
    Component: CardView,
    loader: cardLoader,
    showInHeader: false
  },
  {
    label: 'table',
    path: '/table',
    icon: <TableChartIcon />,
    Component: TableView,
    loader: tableLoader
  }
]
