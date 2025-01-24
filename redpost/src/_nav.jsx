import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBarChart,
  cilClipboard,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
   
  },

  {
    component: CNavGroup,
    name: 'Input Red Post',
    to: '/base',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'input',
        to: '/input',
      },
     
      {
        component: CNavItem,
        name: 'Data Morning',
        to: '/datamorn',
      },
  
     
    ],
  },
 
  
 
 
]

export default _nav
