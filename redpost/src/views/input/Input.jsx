import React, { useState, useEffect, useRef, Suspense } from 'react'
import { FilterMatchMode } from 'primereact/api'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CRow,
  CTableRow,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTableCaption,
  CFormInput,
  CButton,
  CFormLabel,
  CForm,
  CTable,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalHeader,
  CModalBody,
  CCollapse,
  CModalTitle,
  CModalFooter,
  CSpinner,
} from '@coreui/react'
import Swal from 'sweetalert2'
import { Button } from 'primereact/button'
import withReactContent from 'sweetalert2-react-content'
import Select from 'react-select'
import { CIcon } from '@coreui/icons-react'
import { cilPencil, cilQrCode, cilTrash, cilArrowTop, cilArrowBottom } from '@coreui/icons'
import { Scanner } from '@yudiel/react-qr-scanner'
import Pagination from '../../components/Pagination.jsx'
import Flatpickr from 'react-flatpickr'
import 'primereact/resources/themes/nano/theme.css'
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.min.css'
import useInputService from '../../services/InputDataService'

const MySwal = withReactContent(Swal)

const InputInventory = () => {
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'))
  const [loadingImport, setLoadingImport] = useState(false)
  const [isFormVisible, setIsFormVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isClearable, setIsClearable] = useState(true)
  const [items, setItems] = useState([]) // State untuk menyimpan item yang ditambahkan
  const [modalUpload, setModalUpload] = useState(false)
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const itemsPerPage = 10
  const {getInput,getInputById,postInput,updateInput,deleteInputById,getMaterial } = useInputService()
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false)
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [selectedMaterialNo, setSelectedMaterialNo] = useState(null)
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },

    plant: {
      value: null,
      matchMode: FilterMatchMode.EQUALS,
    },

    storage: {
      value: null,
      matchMode: FilterMatchMode.EQUALS,
    },

    type: {
      value: null,
      matchMode: FilterMatchMode.EQUALS,
    },
  })
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getInput(); // Fetch data on mount
        setItems(response.data); // Assuming the response contains data
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [getInput]);

  const handleAdd = async () => {
    // Menyiapkan data yang akan dikirim ke API
    const data = {
      date: InputDate, // Tanggal
      pic: PicId, // PIC yang dipilih
      shift: selectedShift, // Shift yang dipilih
      materialNo: MaterialNo, // Material No yang dipilih
      description: Description, // Description yang dipilih
      cardNo: CardNo, // Card No yang dipilih
      qtyRec: QtyReq, // Quantity yang dimasukkan
      soh: soh, // SOH (Stock On Hand)
    };
  
    // Memulai loading saat proses request
    setIsLoading(true);
  
    try {
      const response = await postInput(data); // Mengirim data ke API
      if (response) {
        // Menambahkan item baru ke state items
        setItems((prevItems) => [...prevItems, response.data]); // Misalnya response.data adalah data yang berhasil disimpan
  
        // Reset form setelah submit berhasil
        setDate(new Date().toLocaleDateString('en-CA'));
        setSelectedPic(null);
        setSelectedShift(null);
        setSelectedMaterialNo(null);
        setSelectedDescription(null);
        setSelectedCardNo(null);
        setQtyRec(0);
        setSoh(0);
      }
    } catch (error) {
      console.error("Error adding data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  //materials untu MaterialNo
  const getMaterials = async (plantIdParams, type) => {
    try {
      const response = await getMaterial(plantIdParams, '', type)

      // Urutkan data berdasarkan addressRackName secara ascending
      const sortedData = response.data.sort((a, b) => {
        const rackA = a.Address_Rack?.addressRackName?.toLowerCase() || '' // Lowercase untuk konsistensi
        const rackB = b.Address_Rack?.addressRackName?.toLowerCase() || ''
        return rackA.localeCompare(rackB)
      })
      setFilteredInventory([]) // Kosongkan filteredInventory
      setInventory(sortedData) // Simpan data yang sudah diurutkan
      setCurrentPage(1) // Reset halaman ke 1
    } catch (error) {
      console.error(error)
    }
  }
  const handleDelete = async (id) => {
    try {
      await deleteInputById(id); // Delete the entry by id
      const updatedData = await getInput(); // Refresh data after deletion
      setItems(updatedData.data); // Update state with the new data
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  //Sortby Table
  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })

    setSortConfig({ key, direction })
    setData(sortedData)
  }

  //tombol Search
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
    const value = e.target.value
    setFilters({
      ...filters,
      global: { value },
    })
    setGlobalFilterValue(value)
  }
  const showModalUpload = () => {
    setModalUpload(true)
  }

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate[0])
    setUploadData((prevData) => ({
      ...prevData,
      importDate: selectedDate[0],
    }))
  }
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setUploadData((prevData) => ({
      ...prevData,
      file: file,
    }))
  }

  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      // Map data dari tabel menjadi format yang sesuai
      const mappedData = data.map((item, index) => ({
        No: index + 1,
        Date: item.date,
        PIC: item.pic,
        Shift: item.shift,
        'Material No': item.materialNo,
        Description: item.description,
        Address: item.address,
        'MRP Type': item.mrpType,
        'Card No': item.cardNo,
        'Qty ROP': item.qtyROP,
        'Qty Rec': item.qtyRec,
        SOH: item.soh,
      }))

      // Buat worksheet dari data yang telah dimapping
      const worksheet = xlsx.utils.json_to_sheet(mappedData)

      // Buat workbook baru dan tambahkan worksheet
      const workbook = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Table Data')

      // Konversi workbook menjadi buffer array
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      })

      // Fungsi untuk menyimpan file Excel
      saveAsExcelFile(excelBuffer, 'Data Red Post')
    })
  }

  // Fungsi untuk menyimpan file Excel
  const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then((FileSaver) => {
      const today = new Date()
      const formattedDate = today.toISOString().split('T')[0] // Format: YYYY-MM-DD
      const fileWithDate = `${fileName} ${formattedDate}.xlsx` // Tambahkan tanggal ke nama file

      const data = new Blob([buffer], { type: 'application/octet-stream' })
      FileSaver.saveAs(data, fileWithDate)
    })
  }

  const handleMaterialNoChange = (selectedMaterial) => {
    if (selectedMaterial) {
      // Temukan item dari inventory berdasarkan materialNo yang dipilih
      const selectedItem = inventory.find((item) => item.id === selectedMaterial.value)

      if (selectedItem) {
        // Set nilai description, address, dan uom berdasarkan item yang ditemukan
        setSelectedMaterialNo(selectedMaterial) // Atur material yang dipilih
        setSelectedDescription({ value: selectedItem.id, label: selectedItem.Material.description })
        setSelectedAddress({
          value: selectedItem.id,
          label: selectedItem.Address_Rack.addressRackName,
        })
        setConversionUom(selectedItem.Material.Packaging?.packaging)
        setConversionRate(selectedItem.Material.Packaging?.unitPackaging)
        setBaseUom(selectedItem.Material.uom)
        quantityInputRef.current?.focus()
      }
    } else {
      // Reset semua state jika tidak ada material yang dipilih
      setSelectedMaterialNo(null)
      setSelectedDescription(null)
      setSelectedAddress(null)
    }
  }


  return (
    <CRow>
      <CCol>
        {isFormVisible && (
          <CCard>
            <CCardHeader>Form Input</CCardHeader>
            <CForm>
              <CCardBody>
                <CRow className="mt-1">
                  <CCol xs={12} sm={6} md={5} xl={4}>
                    <CFormLabel htmlFor="materialNo" style={{ fontSize: '12px' }}>
                      Material No
                    </CFormLabel>
                    <CInputGroup className="flex-nowrap" style={{ width: '100%' }}>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      isLoading={isLoading}
                      isClearable={isClearable}
                      options={(filteredInventory.length > 0 ? filteredInventory : inventory).map(
                        (i) => ({
                          value: i.id,
                          label: i.Material.materialNo,
                        }),
                      )}
                      id="materialNo"
                      onChange={handleMaterialNoChange}
                      value={selectedMaterialNo}
                      styles={{ container: (provided) => ({ ...provided, width: '100%' }) }}
                    />
                   
                  </CInputGroup>
                  </CCol>

                  <CCol xs={12} sm={6} md={6} xl={4}>
                    <CFormLabel htmlFor="description" style={{ fontSize: '12px' }}>
                      Description
                    </CFormLabel>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      isLoading={isLoading}
                      id="description"
                      isDisabled={true}
                    />
                  </CCol>
                  <CCol xs={12} sm={6} md={6} xl={4}>
                    <CFormLabel htmlFor="cardNo" style={{ fontSize: '12px' }}>
                      Card No
                    </CFormLabel>
                    <CInputGroup className="flex-nowrap" style={{ width: '100%' }}>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        isClearable={isClearable}
                        id="cardNo"
                        styles={{ container: (provided) => ({ ...provided, width: '100%' }) }}
                      />
                    </CInputGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs={12} sm={6} md={3} xl={3} className="mt-3">
                    <CFormLabel htmlFor="pic" style={{ fontSize: '12px' }}>
                      PIC
                    </CFormLabel>
                    <CInputGroup className="flex-nowrap" style={{ width: '100%' }}>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        isClearable={isClearable}
                        id="pic"
                        styles={{ container: (provided) => ({ ...provided, width: '100%' }) }}
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol xs={12} sm={6} md={3} xl={3} className="mt-3">
                    <CFormLabel htmlFor="qty" style={{ fontSize: '12px' }}>
                      Qty Recip
                    </CFormLabel>
                    <CFormInput
                      type="number"
                      placeholder="Input.."
                      text="Must be number."
                      aria-describedby="quantity"
                      required
                      inputMode="numeric"
                      autoComplete="off"
                    />
                  </CCol>

                  <CCol
                    xs={12}
                    sm={6}
                    md={3}
                    xl={3}
                    className="d-flex justify-content-start align-items-center mt-4"
                  >
                   <CButton color="primary" onClick={handleAdd}>Add</CButton>
                  </CCol>
                </CRow>
                {/* Collapse content */}

                <CRow className="mt-3">
                  {/* Modal untuk QR Scanner */}
                  <CModal
                    visible={isQrScannerOpen}
                    onClose={() => {
                      setIsQrScannerOpen(false)
                      setBoundingBoxes([])
                    }}
                  >
                    <CModalHeader closeButton>Scan QR Code</CModalHeader>
                    <CModalBody style={{ position: 'relative' }}>
                      <Scanner
                        constraints={{ video: { facingMode: 'environment' } }}
                        style={{ width: '100%' }}
                        allowMultiple={true} // mendukung banyak QR Code
                        scanDelay={3000}
                      />
                      {/* Menampilkan teks hasil scan QR Code di posisi barcode */}
                    </CModalBody>
                  </CModal>
                </CRow>
              </CCardBody>
            </CForm>
          </CCard>
        )}
        <CCard className="mt-3">
          <CCardHeader>Tabel Red Post</CCardHeader>
          <CForm>
            <CCardBody>
              <CRow>
                <CCol xs={12} sm={8} md={8}>
                  <div className="d-flex flex-wrap justify-content-start">
                    <Button
                      type="button"
                      label={isFormVisible ? 'Hide' : 'Show'}
                      icon={isFormVisible ? 'pi pi-minus' : 'pi pi-plus'}
                      severity="primary"
                      className="rounded-3 me-2 mb-2"
                      onClick={() => setIsFormVisible((prev) => !prev)}
                    />
                    <Button
                      type="button"
                      label="Upload"
                      icon="pi pi-file-import"
                      severity="primary"
                      className="rounded-3 me-2 mb-2"
                      onClick={showModalUpload}
                      data-pr-tooltip="XLS"
                    />
                    <Button
                      type="button"
                      label="Excel"
                      icon="pi pi-file-excel"
                      severity="success"
                      className="rounded-3 me-2 mb-2"
                      onClick={exportExcel}
                      data-pr-tooltip="XLS"
                    />
                  </div>
                </CCol>
                <CCol xs={12} sm={12} md={4} lg={4} xl={4}>
                  <div className="d-flex flex-wrap justify-content-end">{renderHeader()}</div>
                </CCol>
              </CRow>
              <CRow className="mt-4">
                <div
                  style={{
                    overflowX: 'auto', // Membuat tabel bisa digeser horizontal
                  }}
                >
                  <CTable
                    bordered
                    striped
                    responsive
                    className="text-center"
                    style={{
                      fontSize: '12px', // Mengurangi ukuran font
                    }}
                  >
                    <CTableHead color="dark">
                      <CTableRow>
                        <CTableHeaderCell
                          scope="col"
                          onClick={() => handleSort('date')}
                          style={{ position: 'sticky', left: 0, zIndex: 1 }}
                        >
                          Date{' '}
                          {sortConfig.key === 'date' && (
                            <CIcon
                              icon={sortConfig.direction === 'asc' ? cilArrowTop : cilArrowBottom}
                            />
                          )}
                        </CTableHeaderCell>
                        <CTableHeaderCell
                          scope="col"
                          onClick={() => handleSort('date')}
                          style={{
                            position: 'sticky',
                           
                            zIndex: 1,
                            background: '#343a40', // Warna background agar sticky terlihat
                            width: '100px', // Lebar kolom Date
                          }}
                        >
                          PIC{' '}
                          {sortConfig.key === 'pic' && (
                            <CIcon
                              icon={sortConfig.direction === 'asc' ? cilArrowTop : cilArrowBottom}
                            />
                          )}
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" onClick={() => handleSort('shift')}>
                          Shift{' '}
                          {sortConfig.key === 'shift' && (
                            <CIcon
                              icon={sortConfig.direction === 'asc' ? cilArrowTop : cilArrowBottom}
                            />
                          )}
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" onClick={() => handleSort('materialNo')}>
                          Material No{' '}
                          {sortConfig.key === 'materialNo' && (
                            <CIcon
                              icon={sortConfig.direction === 'asc' ? cilArrowTop : cilArrowBottom}
                            />
                          )}
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" onClick={() => handleSort('description')}>
                          Description{' '}
                          {sortConfig.key === 'description' && (
                            <CIcon
                              icon={sortConfig.direction === 'asc' ? cilArrowTop : cilArrowBottom}
                            />
                          )}
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">Address</CTableHeaderCell>
                        <CTableHeaderCell scope="col" onClick={() => handleSort('mrpType')}>
                          MRP Type{' '}
                          {sortConfig.key === 'mrpType' && (
                            <CIcon
                              icon={sortConfig.direction === 'asc' ? cilArrowTop : cilArrowBottom}
                            />
                          )}
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" onClick={() => handleSort('qtyROP')}>
                          Card No
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" onClick={() => handleSort('qtyROP')}>
                          Qty ROP
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" onClick={() => handleSort('qtyRec')}>
                          Qty Rec{' '}
                          {sortConfig.key === 'qtyRec' && (
                            <CIcon
                              icon={sortConfig.direction === 'asc' ? cilArrowTop : cilArrowBottom}
                            />
                          )}
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" onClick={() => handleSort('soh')}>
                          SOH{' '}
                          {sortConfig.key === 'soh' && (
                            <CIcon
                              icon={sortConfig.direction === 'asc' ? cilArrowTop : cilArrowBottom}
                            />
                          )}
                        </CTableHeaderCell>
                        <CTableHeaderCell
                          scope="col"
                          style={{ position: 'sticky', right: 0, zIndex: 1 }}
                        >
                          Action
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {items.map((item) => (
                        <CTableRow key={item.id}>
                          <CTableDataCell
                            style={{
                              position: 'sticky',
                              left: 0,
                              background: '#fff', // Warna background untuk data
                              width: '100px', // Lebar kolom Date
                            }}
                          >
                            {item.date}
                          </CTableDataCell>
                          <CTableDataCell style={{ position: 'sticky', left: 70 }}>
                            {item.pic}
                          </CTableDataCell>
                          <CTableDataCell>{item.shift}</CTableDataCell>
                          <CTableDataCell>{item.materialNo}</CTableDataCell>
                          <CTableDataCell>{item.description}</CTableDataCell>
                          <CTableDataCell>{item.address}</CTableDataCell>
                          <CTableDataCell>{item.mrpType}</CTableDataCell>
                          <CTableDataCell>{item.cardNo}</CTableDataCell>
                          <CTableDataCell>{item.qtyROP}</CTableDataCell>
                          <CTableDataCell>{item.qtyRec}</CTableDataCell>
                          <CTableDataCell>{item.soh}</CTableDataCell>
                          <CTableDataCell style={{ position: 'sticky', right: 0 }}>
                            <CIcon
                              className="me-3"
                              icon={cilPencil}
                              size="md"
                              style={{ fontSize: '20px', cursor: 'pointer', color: 'black' }}
                            />
                            <CIcon
                              icon={cilTrash}
                              size="md"
                              style={{ fontSize: '20px', cursor: 'pointer', color: 'red' }}
                              onClick={() => handleDelete(item.id)}
                            />
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>

                <div className="d-flex justify-content-center">
                  <Pagination
                    totalPages={items.length > 0 ? Math.ceil(items.length / itemsPerPage) : 1} // Menentukan total halaman
                  />
                </div>
              </CRow>
            </CCardBody>
          </CForm>
        </CCard>
      </CCol>
      <CModal visible={modalUpload} onClose={() => setModalUpload(false)}>
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Upload Master Material</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormLabel>Date</CFormLabel>
            <Flatpickr
              value={date}
              options={{
                dateFormat: 'Y-m-d',
                maxDate: new Date(),
                allowInput: true,
              }}
              onChange={handleDateChange}
              className="form-control"
              placeholder="Select a date"
            />
          </div>
          <div className="mb-3">
            <CFormInput
              onChange={handleFileChange} // Handle perubahan file
              type="file"
              label="Excel File"
              accept=".xlsx" // Hanya menerima file Excel
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <Suspense
            fallback={
              <div className="pt-3 text-center">
                <CSpinner color="primary" variant="grow" />
              </div>
            }
          >
            <CButton color="primary" onClick={() => handleImport()}>
              {loadingImport ? (
                <>
                  <CSpinner component="span" size="sm" variant="grow" className="me-2" />
                  Importing...
                </>
              ) : (
                'Import'
              )}
            </CButton>
          </Suspense>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default InputInventory
