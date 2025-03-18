import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { Button } from 'primereact/button'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { FilterMatchMode } from 'primereact/api'
import 'primereact/resources/themes/nano/theme.css'
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.min.css'
//import '@coreui/react/dist/css/coreui.min.css'

import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CRow,
  CTableHead,
  CTable,
  CTableDataCell,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CSpinner,
  CFormLabel,
  CModalBody,
  CImage,
  CButton,
  CModalFooter,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import useStockDataService from '../../services/StockDataService'
const MySwal = withReactContent(swal)
const DataStock = () => {
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'))
  const [loadingImport, setLoadingImport] = useState(false)
  const [modalUpload, setModalUpload] = useState(false)
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })
  const { getStockData, uploadStockData } = useStockDataService()
  const [currentPage, setCurrentPage] = useState(1)
  const [changeSearch, setChangeSearch] = useState('')
  const [totalItem, setTotalItem] = useState(0)
  const [stockData, setStockData] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const itemsPerPage = 15 // Limit to 5 items per page
  const [uploadData, setUploadData] = useState({
    importDate: new Date().toLocaleDateString('en-CA'),
    file: null,
  })

  useEffect(() => {
    fetchStockData(currentPage,changeSearch)
  }, [currentPage,changeSearch])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  const [visiblePages, setVisiblePages] = useState([])

  useEffect(() => {
    const maxVisiblePages = 6 // Max number of pages to show
    const halfVisible = Math.floor(maxVisiblePages / 2)

    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, currentPage + halfVisible)

    // Adjust if there are not enough pages before or after
    if (currentPage - startPage < halfVisible) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    if (endPage - currentPage < halfVisible) {
      endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    }

    const pages = []
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    setVisiblePages(pages)
  }, [currentPage, totalPages])

  const stockDataItems = stockData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )
  const fetchStockData = async (page,search) => {
    try {
      const response = await getStockData(page,search)
      console.log('Response data:', response.data) // Debugging untuk memeriksa data

      // Ensure response.data.data is an array before setting it
      const data = Array.isArray(response.data.data) ? response.data.data : []
      setTotalPages(response.data.totalPages)
      setCurrentPage(response.data.currentPage)
      setFilteredData(data); // Awalnya data yang difilter adalah semua data
      setTotalItem(response.data.totalItems)
      setStockData(data)
    } catch (error) {
      console.error('Failed to fetch stock data:', error)
      setStockData([]) // Set an empty array on error
      setFilteredData([]);
      setCurrentPage(0)

      setTotalItem(0)
    }
  }

  console.log('currentPage', currentPage)
  console.log('TotalPage', totalPages)
  console.log('TotalItem', totalItem)
  console.log('Data', stockData)


 

  const handleUpload = async () => {
    if (!uploadData.file) {
      MySwal.fire('Error', 'Please select a file to upload.', 'error')
      return
    }
  
    setLoadingImport(true)
  
    // Buat FormData kosong
    const formData = new FormData()
    formData.append('file', uploadData.file) // Tambahkan file
    formData.append('importDate', uploadData.importDate) // Tambahkan tanggal impor
  
    try {
      await uploadStockData(formData) // Panggil API untuk upload data
      MySwal.fire('Success', 'File uploaded successfully.', 'success')
      setModalUpload(false)
      fetchStockData() // Refresh data setelah upload berhasil
    } catch (error) {
      console.error('Failed to upload file:', error)
    } finally {
      setLoadingImport(false) // Hentikan animasi loading
    }
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

  const onGlobalFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setGlobalFilterValue(value);

    // Filter data berdasarkan input pencarian
    const filtered = stockData.filter((item) =>
      item.materialNo.toLowerCase().includes(value) ||
      item.description.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };
  
  const renderHeader = () => {
    return (
      <div>
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={changeSearch}
            onChange={handleChangeSearch}
            placeholder="Keyword Search"
            style={{ width: '100%', borderRadius: '5px' }}
          />
        </IconField>
      </div>
    );
  };
  const handleChangeSearch = (e) => {
    setChangeSearch(e.target.value)
  }
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }
  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>Master Data Stock Day Shift</CCardHeader>
          <CCardBody>
            <>
              <CRow className="mb-2">
                <CCol xs={12} sm={12} md={8} lg={8} xl={8}>
                  <div className="d-flex flex-wrap justify-content-start">
                    <Button
                      type="button"
                      label="Upload"
                      icon="pi pi-file-import"
                      severity="primary"
                      className="rounded-5 me-2 mb-2"
                      onClick={showModalUpload}
                      data-pr-tooltip="XLS"
                    />
                  </div>
                </CCol>
                <CCol xs={12} sm={12} md={4} lg={4} xl={4}>
                  <div className="d-flex flex-wrap justify-content-end">{renderHeader()}</div>
                </CCol>
              </CRow>
          
              <CTable
                bordered
                responsive
                className="text-center text-nowrap"
                //globalFilter={filters.global.value}
                scrollable
                paginator
                rows={15}
                rowsPerPageOptions={[10, 25, 50]}
                style={{
                  fontSize: '12px', // Mengurangi ukuran font
                }}
              >
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col" style={{ width: '15%' }}>
                      Material No
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ width: '3  5%' }}>
                      Description
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ width: '15%' }}>
                      Rack CD
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ width: '10%' }}>
                      SOH
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ width: '10%' }}>
                      UoM
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ width: '10%' }}>
                      Last Upload
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredData.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{item.materialNo}</CTableDataCell>
                      <CTableDataCell>{item.description}</CTableDataCell>
                      <CTableDataCell>{item.addresRack}</CTableDataCell>
                      <CTableDataCell>{item.soh}</CTableDataCell>
                      <CTableDataCell>{item.uom}</CTableDataCell>
                      <CTableDataCell>
                      {new Date(new Date(item.createdAt).getTime() + 7 * 60 * 60 * 1000)
                      .toISOString()
                      .replace('T', ' ')
                      .slice(0, 16)}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              {/* Pagination Section */}
              <CRow className="mt-4">
                <CCol className="d-flex justify-content-center sticky-pagination">
                  <CPagination aria-label="Page navigation example">
                    <CPaginationItem
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </CPaginationItem>

                    {visiblePages.map((page) => (
                      <CPaginationItem
                        key={page}
                        active={currentPage === page}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </CPaginationItem>
                    ))}

                    <CPaginationItem
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </CPaginationItem>
                  </CPagination>
                </CCol>
              </CRow>
            </>
          </CCardBody>
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
            <CButton color="primary" onClick={handleUpload} disabled={loadingImport}>
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

export default DataStock
