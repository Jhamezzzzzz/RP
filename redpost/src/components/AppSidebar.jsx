import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import logo from 'src/assets/images/TWIIS-NEW.png'
import sygnet from 'src/assets/images/RedIcon.png'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
    className="border-end"
    position="fixed"
    unfoldable={unfoldable}
    visible={sidebarShow}
    onVisibleChange={(visible) => {
      dispatch({ type: 'set', sidebarShow: visible });
    }}
    style={{
      backgroundColor: '#E9EFEC ', // Warna abu-abu
      color: '#F5F5F7',            // Warna teks
    }}
  >
  
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
        <img src={logo} alt="Logo" className="sidebar-brand-full" height={50} />
        <img src={sygnet} alt="Sygnet" className="sidebar-brand-narrow" height={30} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
