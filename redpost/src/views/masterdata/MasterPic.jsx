import React, { useState, useEffect, useMemo, Suspense, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { FilterMatchMode } from 'primereact/api'
import { MultiSelect } from 'primereact/multiselect'
import 'primereact/resources/themes/nano/theme.css'
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.min.css'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormLabel,
  CSpinner,
  CImage,
  CFormSelect,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilImagePlus, cilXCircle } from '@coreui/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import useMasterDataService from '../../services/MasterDataService'
import swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { format, parseISO } from 'date-fns'
import 'flatpickr/dist/flatpickr.min.css'
import config from '../../utils/Config.js'
import { IMaskMixin } from 'react-imask'
import '../../scss/_tabels.scss'
import { useToast } from "../../App";

const MySwal = withReactContent(swal)

const User = () => {
  const [users, setUsers] = useState([])
  const [modalAdd, setModalAdd] = useState(false)
  const [modalEdit, setModalEdit] = useState(false)
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [plantOptions, setPlantOptions] = useState([])
  const [shiftOptions, setShiftOptions] = useState([])
  const [picOptions, setPicOptions] = useState([])
  const [groupOptions, setGroupOptions] = useState([])
  const [lineOptions, setLineOptions] = useState([])
  const [sectionOptions, setSectionOptions] = useState([])
  const [departmentOptions, setDepartmentOptions] = useState([])
  const [divisionOptions, setDivisionOptions] = useState([])
  const [warehouseOptions, setWarehouseOptions] = useState([])
  const [shouldFetch, setShouldFetch] = useState(false)
  const [currentUser, setCurrentUser] = useState({
    id: '',
    PicName: '',
    ShiftId: '',
  })
  const [loading, setLoading] = useState(true)

  const [roleValid, setRoleValid] = useState([])
  const [dataPic, setDataPic] = useState([])
  const [dataShift, setDataShift] = useState([])
  const [shiftId, setShiftId] = useState('');
  const addToast = useToast();
  const [selectedRow, setSelectedRow] = useState(null); // ⬅️ buat nyimpan row yang diklik
  const [addPic, SetAddPic] = useState('');
  const [editPic, SetEditPic] = useState('');

  const {
    getMasterPic,
    getMasterShift,
    deleteMasterPicById,
    updateMasterPic,
    postMasterPic,
  } = useMasterDataService()

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  

 

  const LoadingComponent = () => (
    <div className="text-center">
      <CSpinner color="primary" />
      <p>Loading user data...</p>
    </div>
  )
  useEffect(() => {
    fecthMasterPic(),
    fecthMasterShift()
  }, [])
  
  const fecthMasterPic = async () => {
    try {
      const response = await getMasterPic();
      const dataWithShiftName = response.data.map(item => ({
        ...item,
        ShiftName: getShiftNameById(item.ShiftId),  // kamu sudah punya function ini
      }));
      setDataPic(dataWithShiftName);
    } catch (error) {
      console.error('Error fetching master pic:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fecthMasterShift = async () => {
    try {
      const response = await getMasterShift()
      setDataShift(response.data)
    } catch (error) {
      console.error('Error fetching master pic:', error)
    } finally {
      setLoading(false)  // Baru setelah fecth selesai, set loading false
    }
  }
  
  const renderHeader = () => {
    return (
      <div>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
            style={{ width: '100%', borderRadius: '5px' }}
          />
        </IconField>
      </div>
    )
  }

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
  
    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  

  const handleAddUser = () => {
    setIsEdit(false)
    setCurrentUser({
      id: '',
      PicName: '',
      ShiftId: '',
     
    })
    setModalAdd(true)
  }
  const actionBodyTemplate = (rowData) => (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button
        label="Edit"
        icon="pi pi-pencil"
        className="p-button-success"
        onClick={() => handleEditUser(rowData)}
      />
      <Button
        label="Delete"
        icon="pi pi-trash"
        className="p-button-danger"
        onClick={() => handleDeleteUser(rowData.id)}
      />
    </div>
  )

  const handleEditUser = (user) => {
    setIsEdit(true);
    SetEditPic(user.PicName);      // SET di input PIC Name
    setShiftId(user.ShiftId);      // SET di input Shift
    setCurrentUser({
      id: user.id,
      PicName: user.PicName,
      ShiftId: user.ShiftId,
    });
    setModalEdit(true);
  }
  

  const handleDeleteUser = (userId) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'This user cannot be recovered!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDelete(userId)
      }
    })
  }
  const confirmDelete = async (id) => {
    try {
      await deleteMasterPicById(id)
      await fecthMasterPic();
      MySwal.fire('Deleted!', 'User deleted successfully.', 'success')
      setShouldFetch(true)
    } catch (error) {
      console.error('Error menghapus user:', error)
    }
  }
  const formatDate = (dateString) => {
  if (!dateString) return '-';

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // bulan dari 0
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hour}:${minute}`;
};

  const getShiftNameById = (shiftId) => {
    const shift = dataShift.find((item) => item.id === shiftId);
    return shift ? shift.ShiftName : '-';
  }

  const handleSubmitAdd = async () => {
    const postData = {
   
      PicName: addPic,
      ShiftId: shiftId,
    };
  
    try {
      await postMasterPic( postData); // asumsi: updateInput = service axios
    
      setModalAdd(false);
      await fecthMasterPic();
      addToast("Success update", "success", "info");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleSubmitEdit = async () => {
    const updateData = {
      PicName: editPic,
      ShiftId: shiftId,
    };
  
    try {
      await updateMasterPic(currentUser.id, updateData); // asumsi: updateInput = service axios
      await fecthMasterPic();
      setModalEdit(false);
      addToast("Success update", "success", "info");
    } catch (error) {
      console.error("Update failed", error);
    }
  };
  
  



  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
        <CCardHeader style={{ fontWeight: 'bold', fontStyle: 'italic' }}>
          Master Data PIC
        </CCardHeader>
          <CCardBody>
            {/* {loading ? (
              <LoadingComponent />
            ) : ( */}
              <>
                <CRow className="mb-2">
                  <CCol xs={12} sm={12} md={8} lg={8} xl={8}>
                    <div className="d-flex flex-wrap justify-content-start">
                      <Button
                        type="button"
                        label="Add"
                        icon="pi pi-plus"
                        severity="primary"
                        className="rounded-5 me-2 mb-2"
                        onClick={handleAddUser}
                        data-pr-tooltip="XLS"
                      />
                      {/* <Button
                        type="button"
                        label="Excel"
                        icon="pi pi-file-excel"
                        severity="success"
                        className="rounded-5 me-2 mb-2"
                        // onClick={exportExcel}
                        data-pr-tooltip="XLS"
                      /> */}
                    </div>
                  </CCol>
                  <CCol xs={12} sm={12} md={4} lg={4} xl={4}>
                    <div className="d-flex flex-wrap justify-content-end">{renderHeader()}</div>
                  </CCol>
                </CRow>
                <DataTable
                  value={dataPic}
                  paginator
                  rows={10}
                  filters={filters}   
                  rowsPerPageOptions={[10, 25, 50]}
                  tableStyle={{ minWidth: '30rem' }}
                  className="custom-table dashboard"
                  globalFilterFields={['PicName', 'ShiftName']}  // ganti ShiftId -> ShiftName
                  scrollable
                //   globalFilter={filters.global.value} // Aplikasikan filter global di sini
                  onMouseDownCapture={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <Column
                    header="No"
                    body={(data, options) => options.rowIndex + 1}
                    frozen
                    alignFrozen="left"
                 
                  />

                  <Column
                    field="PicName"
                    header="PIC Name"
                    style={{ width: '25%' }}
                    frozen
                    alignFrozen="left"
                  />
                 <Column
                    header="Shift"
                    body={(rowData) => getShiftNameById(rowData.ShiftId)}
                    style={{ width: '25%' }}
                    sortable
                    />
                  <Column
                    header="Created At"
                    body={(rowData) => formatDate(rowData.createdAt)}
                    style={{ width: '25%' }}
                    sortable
                    />
                    <Column
                    header="Updated At"
                    body={(rowData) => formatDate(rowData.updatedAt)}
                    style={{ width: '25%' }}
                    sortable
                    />
                  <Column header="Action" body={actionBodyTemplate} frozen alignFrozen="right" />
                </DataTable>
              </>
            {/* )} */}
          </CCardBody>
        </CCard>
      </CCol>

      <CModal backdrop="static" size="md" visible={modalAdd} onClose={() => setModalAdd(false)}>
        <CModalHeader onClose={() => setModalAdd(false)}>
          <CModalTitle>Add Master Data PIC</CModalTitle>
        </CModalHeader>
        <CModalBody>
         <CCol xs={12} sm={12} md={12} xl={12}  className="mt-1">      
        <CFormLabel style={{ fontSize: '13px' }}>
        PIC Name <span style={{ color: 'red' }}>*</span>
        </CFormLabel>
        <CFormInput
          value={addPic}
          onChange={(e) => SetAddPic(e.target.value)}
        />
          
        </CCol>
        <CCol xs={12} sm={12} md={12} xl={12}  className="mt-1">      
        <CFormLabel style={{ fontSize: '13px' }}>
        Shift <span style={{ color: 'red' }}>*</span>
        </CFormLabel>
        <CFormSelect
            value={shiftId}
            onChange={(e) => setShiftId(e.target.value)}
        >
            <option value="">-- Select Shift --</option>
            {dataShift.map((shift) => (
            <option key={shift.id} value={shift.id}>
                {shift.ShiftName}
            </option>
            ))}
        </CFormSelect>              
        </CCol>
        </CModalBody>
        <CModalFooter>
         
          <Suspense
            fallback={
              <div className="pt-3 text-center">
                <CSpinner color="primary" variant="grow" />
              </div>
            }
          >
             <CButton color="info" onClick={handleSubmitAdd}>
            {/* // onClick={handleSaveUser} */}
              {loading ? (
                <>
                  <CSpinner component="span" size="sm" variant="grow" className="me-2" />
                  Add
                </>
              ) : (
                <>Add</>
              )}
            </CButton>
          </Suspense>
        </CModalFooter>
      </CModal>
      {/* //////////////////////////////////Modal Edit////////////////////////////////////////// */}
      <CModal backdrop="static" size="md" visible={modalEdit} onClose={() => setModalEdit(false)}>
        <CModalHeader onClose={() => setModalEdit(false)}>
          <CModalTitle>Edit Master Data PIC</CModalTitle>
        </CModalHeader>
        <CModalBody>
         <CCol xs={12} sm={12} md={12} xl={12}  className="mt-1">      
        <CFormLabel style={{ fontSize: '13px' }}>
        PIC Name <span style={{ color: 'red' }}>*</span>
        </CFormLabel>
        <CFormInput
          value={editPic}
          onChange={(e) => SetEditPic(e.target.value)}
        />
          
        </CCol>
        <CCol xs={12} sm={12} md={12} xl={12}  className="mt-1">      
        <CFormLabel style={{ fontSize: '13px' }}>
        Shift <span style={{ color: 'red' }}>*</span>
        </CFormLabel>
        <CFormSelect
            value={shiftId}
            onChange={(e) => setShiftId(e.target.value)}
        >
            <option value="">-- Select Shift --</option>
            {dataShift.map((shift) => (
            <option key={shift.id} value={shift.id}>
                {shift.ShiftName}
            </option>
            ))}
        </CFormSelect>              
        </CCol>
        </CModalBody>
        <CModalFooter>
         
          <Suspense
            fallback={
              <div className="pt-3 text-center">
                <CSpinner color="primary" variant="grow" />
              </div>
            }
          >
             <CButton color="info" onClick={handleSubmitEdit}>
            {/* // onClick={handleSaveUser} */}
              {loading ? (
                <>
                  <CSpinner component="span" size="sm" variant="grow" className="me-2" />
                  Update
                </>
              ) : (
                <>Update</>
              )}
            </CButton>
          </Suspense>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default User
