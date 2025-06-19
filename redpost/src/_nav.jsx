import React, { useEffect } from 'react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import {
  cilGraph,
  cilFindInPage,
  cilAccountLogout,
  cilUser,
  cilBookmark,
  cilStorage,
  cilColumns
} from '@coreui/icons'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import useVerify from './hooks/useVerify2'
import useAuthDataService from './services/AuthDataServices'
import { useNavigate } from 'react-router-dom'
import { components } from 'react-select'

const useNav = () => {
  const { logout } = useAuthDataService();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const { roleName, isWarehouse } = useVerify()

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

  // NAV HOME
  const baseNav = [
    {
      component: CNavTitle,
      name: 'Dashboard',
    },
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: 'Main Input',
    },
    {
      component:CNavGroup,
      name: 'Red-Post',
      icon:<CIcon icon={cilStorage} customClassName="nav-icon"/>,
      items:
      [
        {
          component: CNavItem,
          name: 'Input By Material',
          to: '/input',
        },
        {
          component: CNavItem,
          name: 'Analyze SOH',
          to: '/follow-soh',
        },
      ]
    },
      {
      component:CNavGroup,
      name: 'Defisit',
      icon:<CIcon icon={cilFindInPage} customClassName="nav-icon"/>,
      items:
      [
        {
          component: CNavItem,
          name: 'Input Defisit',
          to: '/input-defisit',
        },
        {
          component: CNavItem,
          name: 'SOH X Defisit',
          to: '/defisit-compare',
        },
      ]
    },
    {
      component: CNavTitle,
      name: 'Upload SoH',
    },
    {
      component: CNavItem,
      name: 'Data SoH',
      to: '/datamorn',
      icon: <CIcon icon={icon.cilColumns} customClassName="nav-icon" />,
    },
  ];

  // Menambah menu MASTER DATA jika kondisi role dan isWarehouse terpenuhi
  if (
    (roleName === 'super admin') || 
    roleName === 'warehouse staff'
  ) {
    baseNav.push(
      {
        component: CNavTitle,
        name: 'MASTER DATA',
      },
      {
        component: CNavItem,
        name: 'PIC',
        to: '/master-pic',
        icon: <CIcon icon={icon.cilUser} customClassName="nav-icon" />,
      }
    );
  }

  // Menu USER dan Logout
  baseNav.push(
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
    }
  );

  return baseNav; // Kembalikan array baseNav agar bisa digunakan di sidebar
};

export default useNav;
