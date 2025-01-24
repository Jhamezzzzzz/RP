import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Input = React.lazy(() => import('./views/input/Input'))
const DataMorning = React.lazy(() => import('./views/input/DataMorn'))



const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/input', name: 'Input', element: Input },
  { path: '/datamorn', name: 'DataMorning', element: DataMorning },
  
]

export default routes
