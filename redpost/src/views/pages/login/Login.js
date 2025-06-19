import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cibCircleci } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import useAuthService from '../../../services/AuthService'
import logo from '../../../assets/brand/TWIIS-NEW.png'
import background from '../../../assets/brand/bgwh.png'

const MySwal = withReactContent(Swal)

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  const navigate = useNavigate()
  const { login } = useAuthService()

  useEffect(() => {
    if (msg) {
      MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: msg,
      })
      setMsg('')
    }
  }, [msg])

  const Auth = async (e) => {
    e.preventDefault()

    if (!username || !password) {
      setMsg('Username dan password harus diisi')
      return
    }

    if (password.length < 6) {
      setMsg('Password harus lebih dari 6 karakter')
      return
    }

    try {
      await login(username, password)
      navigate('/dashboard')
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg)
      } else {
        console.error('Error:', error.message)
      }
    }
  }

  return (
  <div
  className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center"
  style={{
    backgroundImage: `url(${background})`, // Menggunakan gambar impor
    backgroundSize: 'cover', // Agar gambar menyesuaikan dengan ukuran viewport
    backgroundPosition: 'center', // Posisi gambar di tengah
    backgroundRepeat: 'no-repeat', // Mencegah pengulangan gambar
    }}
  >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6} sm={6} xs={12}>
            <CCardGroup>
               <CCard className="text-white shadow-lg" style={{backgroundColor:'rgba(255,255,255,0.5)', backdropFilter:'blur(1px)'}}>
               <CCardBody>
                 <CRow> 
                    <label className="fw-bold display-6 justify-content-start align-items-start"
                    style={{color:'black',opacity:'0.4'}} >
                      Hello!
                    </label>
                  </CRow>
                  <CRow>
                    <label className="fw-bold display-6 justify-content-start align-items-start mb-5"
                      style={{color:'black',opacity:'0.3'}}  >
                      Welcome To
                    </label>
                  </CRow >
                   <div className="text-center w-100">
                  <img
                    src={logo}
                    alt="Logo"
                    className="img-fluid"
                    style={{
                      width: window.innerWidth >= 1080 ? '210px'
                            : window.innerWidth >= 800 ? '150px'
                            : '190px',
                      height: 'auto',
                    }}
                  />
                  </div>
                </CCardBody>
              </CCard>
              <CCard className="p-4 shadow-lg" style={{backgroundColor:'rgba(255,255,255,0.3)', backdropFilter:'blur(11px)'}} >
                 <CCardBody>
                  <CForm onSubmit={Auth}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol md={6} xs={6} sm={6}>
                        <CButton 
                         type="submit"    
                        className="login-button px-4">
                          Login
                        </CButton>

                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
