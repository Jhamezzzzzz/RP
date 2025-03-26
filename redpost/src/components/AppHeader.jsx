import React, { useState,useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import LogoRp from '../assets/brand/Red-Post.png';
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
import AppHeaderDropdown from './header/AppHeaderDropdown'


const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const { name, roleName, imgProfile } = useVerify()
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const [dateState, setDateState] = useState(new Date())

  const t = new Date()
  const c = t.getHours() - 12
  useEffect(() => {
    setInterval(() => {
      setDateState(new Date())
    }, 1000)
  }, [])

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
           src={LogoRp}
           style={{ height: '2.2rem', width: '12rem' }}
           alt="Logo Red Post"
         />
        </CCol>
        <div className="nav-item py-0 d-flex align-items-center" style={{ textDecoration: 'none', display: '' }}>
          <div className="vr h-100 mx-2 text-body text-opacity-100"></div>
        </div>
        <div className='d-flex flex-md-row flex-column-reverse align-items-center'>
          <CHeaderNav className="ms-auto">
            <CNavItem>
              <CNavLink className="" style={{ textDecoration: 'none' }}>
                {dateState.toLocaleString('en-US', {
                  dateStyle: 'full',
                })}
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink className="" style={{ textDecoration: 'none' }}>
                {dateState.toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  second: '2-digit',
                  hourCycle: 'h24'
                })}
              </CNavLink>
            </CNavItem>
          </CHeaderNav>

          <div className='d-flex align-items-center'>
            {/* THEME MODE */}
            <CHeaderNav>
              <li className="nav-item py-1  py-0 d-flex align-items-center">
                <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
              </li>
              <CDropdown variant="nav-item" placement="bottom-end">
                <CDropdownToggle caret={false}>
                  {colorMode === 'dark' ? (
                    <CIcon icon={icon.cilMoon} size="lg" />
                  ) : colorMode === 'auto' ? (
                    <CIcon icon={icon.cilContrast} size="lg" />
                  ) : (
                    <CIcon icon={icon.cilSun} size="lg" />
                  )}
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem
                    active={colorMode === 'light'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('light')}
                  >
                    <CIcon className="me-2" icon={icon.cilSun} size="lg" /> Light
                  </CDropdownItem>
                  <CDropdownItem
                    active={colorMode === 'dark'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('dark')}
                  >
                    <CIcon className="me-2" icon={icon.cilMoon} size="lg" /> Dark
                  </CDropdownItem>
                  <CDropdownItem
                    active={colorMode === 'auto'}
                    className="d-flex align-items-center"
                    as="button"
                    type="button"
                    onClick={() => setColorMode('auto')}
                  >
                    <CIcon className="me-2" icon={icon.cilContrast} size="lg" /> Auto
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
              <li className="nav-item py-1  py-0 d-flex align-items-center ">
                <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
              </li>
            </CHeaderNav>
            <CHeaderNav>
              <CNavItem className="d-flex align-items-center">
              <AppHeaderDropdown colorMode={colorMode} imgProfile={imgProfile} />

                {/* <CHeaderNav> */}
            {/* </CHeaderNav> */}
                <CNavLink className="d-flex flex-column justify-content-center h-100" style={{ textDecoration: 'none' }}>
                  <span style={{ fontSize: '', marginTop: '0px'}}>{name === 'Danur SiPalingGhanzzz' ? 'Danur' : name}</span>
                  <span style={{ fontSize: '10px', marginTop: '0px' }}>{roleName.toUpperCase()}</span>
                </CNavLink>
              </CNavItem>
            </CHeaderNav>
          </div>
        </div>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
