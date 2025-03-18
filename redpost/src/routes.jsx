import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const DefisitCompare = React.lazy(() => import('./views/dashboard/DefisitCompare'))
const Input = React.lazy(() => import('./views/input/Input'))
const DataMorning = React.lazy(() => import('./views/input/DataMorn'))
const FollowUp = React.lazy(() => import('./views/input/FollowSoh'))
const InputDefisit = React.lazy(() => import('./views/input/InputDefisit'))



const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/defisit-compare', name: 'Defisit Compare', element: DefisitCompare },
  { path: '/input', name: 'Input', element: Input },
  { path: '/datamorn', name: 'DataMorning', element: DataMorning },
  { path: '/follow-soh', name: 'Follow Up', element: FollowUp },
  { path: '/input-defisit', name: 'Input Defisit', element: InputDefisit },
]

export default routes
