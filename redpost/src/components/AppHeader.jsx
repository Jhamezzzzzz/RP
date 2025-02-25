import React, { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import logo from '../assets/images/RedPostLogo.png';
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeaderNav,
  CHeader,
  CCol,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'
import useVerify from '../hooks/useVerify2'
import * as icon from "@coreui/icons";


const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const { name, roleName, imgProfile } = useVerify()
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const today = new Date()
  const formattedDate = today.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CCol className='d-flex justify-content-between align-items-center" fluid'>
          {/* Gambar di pojok kiri */}
          <img
           src={logo}
           style={{ height: '2.2rem', width: '5rem' }}
           alt="Logo Red Post"
         />
          {/* Tanggal hari ini di pojok kanan */}
          <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
            {formattedDate}
          </span>
        </CCol>
        <div className="nav-item py-0 d-flex align-items-center" style={{ textDecoration: 'none', display: '' }}>
          <div className="vr h-100 mx-2 text-body text-opacity-100"></div>
        </div>
        <CHeaderNav>
          <CNavItem className="d-flex align-items-center">
            <CNavLink style={{ textDecoration: 'none' }}>
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  border: '1px solid black',
                  height: '30px',
                  width: '30px',
                  borderRadius: '100%',
                }}
              >
                { imgProfile ? <CImage src={imgProfile}/> : <CIcon icon={icon.cilUser} />}
              </div>
            </CNavLink>
            <CNavLink className="d-flex flex-column justify-content-center h-100" style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: '', marginTop: '0px'}}>{name}</span>
              <span style={{ fontSize: '10px', marginTop: '0px' }}>{roleName?.toUpperCase()}</span>
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
