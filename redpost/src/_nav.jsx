import React from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import {
  cilBarChart,
  cilClipboard,
  cilAccountLogout,
  cilPhone,
  cilBalanceScale,
  cilColumns
} from '@coreui/icons'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import useAuthDataService from './services/AuthDataServices'
import { useNavigate } from 'react-router-dom'


const useNav = () => {
  const { logout } = useAuthDataService();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const handleLogout = async () => {
    try {
      const result = await MySwal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to log out?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, log out',
        confirmButtonColor: 'rgb(246, 66, 66)',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      });
      if (result.isConfirmed) {
        await logout();
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const _nav = [
    {
      component: CNavTitle,
      name: 'Dashboard',
    },
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
    },
    
    {
      component: CNavTitle,
      name: 'Red-Post',
    },
    {
      component: CNavGroup,
      name: 'Input Red Post',
      to: '/base',
      icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Input By Material',
          to: '/input',
        },
        {
          component: CNavItem,
          name: 'Follow Up-SoH',
          to: '/follow-soh',
          
        },
       
      ],
    },
    {
      component: CNavTitle,
      name: 'Defisit',
    },
    {
      component: CNavItem,
      name: 'Input Defisit',
      to: '/input-defisit',
      icon: <CIcon icon={icon.cilBookmark} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'SOH X Defisit',
      to: '/defisit-compare',
      icon: <CIcon icon={cilBalanceScale} customClassName="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: 'Upload SoH',
    },
    {
      component: CNavItem,
      name: 'Data SoH',
      to: '/datamorn',
      icon: <CIcon icon={icon.cilColumns} customClassName="nav-icon" />
    },
   
    {
      component: CNavTitle,
      name: 'USER',
    },
    {
      component: CNavItem,
      name: 'Logout',
      to: '/logout',
      icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
      onClick: (e) => {
        e.preventDefault();
        handleLogout();
      },
    },
  ];

  return _nav; // ✅ Kembalikan array _nav agar bisa digunakan di sidebar
};

export default useNav;
