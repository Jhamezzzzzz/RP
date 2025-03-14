import React, { Suspense, useState, useEffect, createContext, useContext } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { CSpinner, useColorModes, CToaster, CToast, CToastHeader, CToastBody } from '@coreui/react'
import Watermark from './components/Watermark'
import './scss/style.scss'

import './scss/examples.scss'
import 'primereact/resources/themes/nano/theme.css'
// import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.min.css'



// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
// const Register = React.lazy(() => import('./views/pages/register/Register'))
// const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
// const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// Create a context for toast
const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

const App = () => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    // const color = {
    //   success: 'success',
    //   info: 'info',
    //   warning: 'warning',
    //   error: 'danger',
    //   failed: 'danger',
    // }[type] || 'info'
    const color = {
      success: '#29d93e',
      info: '#6799FF',
      warning: '#FFBB00',
      error: '#e85454',
      failed: '#e85454',
    }[type] || '#e85454'

    setToasts((prevToasts) => [
      ...prevToasts,
      { message, type, color, id: Date.now() },
    ])
  }

  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  useEffect(() => {
    setColorMode('light')
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ToastContext.Provider value={addToast}>
      <HashRouter>
        <CToaster style={{ position: "fixed", right: "10px", top: "10px"}}>
          {toasts.map(({ id, message, type, color }) => (
            <CToast
              key={id}
              autohide={true}
              color={type}
              delay={5000}
              visible={true}
            >
              <CToastHeader closeButton>
                <svg
                  className="rounded me-2"
                  width="20"
                  height="20"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid slice"
                  focusable="false"
                  role="img"
                >
                  <rect
                    width="100%"
                    height="100%"
                    fill={color}
                  />
                </svg>
                <strong className="me-auto">{type === 'danger' ? 'ERROR' : type.toUpperCase()}</strong>
              </CToastHeader>
              <CToastBody style={{ backgroundColor: 'white' }}>
                {message}
              </CToastBody>
            </CToast>
          ))}
        </CToaster>
        <Watermark/>
        <Suspense>
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            {/* <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} /> */}
            <Route path="*" name="dashboard" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </ToastContext.Provider>
  )
}

export default App
