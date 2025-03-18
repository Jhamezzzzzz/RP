import React, { useState, useEffect, useRef,useCallback, Suspense,useMemo } from 'react'
import { FilterMatchMode } from 'primereact/api'
import '../../scss/_tabels.scss'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar';
import * as XLSX from "xlsx";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import Swal from 'sweetalert2';
import '../../scss/_tabels.scss'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CRow,
  CTooltip ,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTableCaption,
  CFormInput,
  CButton,
  CFormLabel,
  CForm,
  CFormCheck,
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
import useCompareDefService from '../../services/CompareDefService.jsx'
import usePicService from '../../services/PicService'
import useShiftService from '../../services/ShiftService'
import useStockDataService from '../../services/StockDataService'
import useVerify from '../../hooks/useVerify2.jsx'
import { AbortedDeferredError } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { FaPencilAlt,FaTrash,FaCheck,FaExclamationTriangle, FaCheckCircle} from "react-icons/fa"; // ? Benar
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faExclamationTriangle,faPencilAlt,faCheck,faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { MultiSelect } from 'primereact/multiselect';

const MySwal = withReactContent(Swal)

const InputInventory = () => {
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'))
  const [loadingImport, setLoadingImport] = useState(false)
  const [items, setItems] = useState([]) // State untuk menyimpan item yang ditambahkan
  const [modalUpload, setModalUpload] = useState(false)
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const itemsPerPage = 20

  const [inventory, setInventory] = useState([])
  const [selectedMrp, setSelectedMrp] = useState([])
  const [selectedMaterialNo, setSelectedMaterialNo] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDescription, setSelectedDescription] = useState(null)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [conversionUom, setConversionUom] = useState('')
  const [baseUom, setBaseUom] = useState('')
  const [isWbs, setIsWbs] = useState(false);
  const [picOptions, setPicOptions] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
const [editingRemark, setEditingRemark] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const {getInput,getInputById,postInput,updateInput,deleteInputById,getMaterial,getGic,getWbs,getMasterData,uploadInputData } = useInputService()
  const { getCompareDefisit,updateCompareDefisit} = useCompareDefService()
  const [stockData, setStockData] = useState([]);
  const [sohData, setSohData] = useState();
  const [selectedSoh, setSelectedSoh] = useState(null);
  const [isEditable, setIsEditable] = useState(false); // To toggle edit mode
  const [sortField, setSortField] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [uploadData, setUploadData] = useState()
    const [sortOrder, setSortOrder] = useState(null);
    const [editingRows, setEditingRows] = useState(null);
    const [qtyRecValues, setQtyRecValues] = useState({});
const [selectedDate, setSelectedDate] = useState(null);
const [selectedDialog, setSelectedDialog] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [pic, setPic] = useState(null); // State untuk menyimpan PIC
const [selectedPic, setSelectedPic] = useState(null); // State untuk menyimpan PIC
const [ visibleColumns, setVisibleColumns ] = useState([]);
const [editingDateId, setEditingDateId] = useState(null);
const { name, roleName, imgProfile } = useVerify()
const [loading, setLoading] = useState(false); 

  
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
  const columns = [
    {
      field: "Remark",
      header: "Remark",
      body: (rowData) => (
        <div 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            background: "white", 
            padding: "5px", 
            borderRadius: "4px", 
            justifyContent: "space-between",
            maxWidth: "130px",
          }}
        >
           { (roleName === "group head" || roleName === "super admin") ? (
            <>
          <input 
            type="text" 
            value={rowData.Remark || ""} 
            onChange={(e) => handleRemarkChange(rowData.id, e.target.value)}
            style={{ 
              flexGrow: 1, 
              border: "none", 
              outline: "none", 
              maxWidth: "90px", 
              overflow: "hidden",
              background: "transparent" 
            }} 
          />
          <button 
            onClick={() => handleSubmitRemark(rowData)}
            style={{ background: "none", border: "none", cursor: "pointer", marginLeft: "8px", alignSelf: "flex-end" }}
          >
            <FontAwesomeIcon icon={faPaperPlane} style={{ color: "blue" }} />
          </button>
          </>
      ) : (
        <span 
          style={{ 
            flexGrow: 1, 
            color: rowData.Remark && rowData.Remark.trim() ? "black" : "gray", 
            maxWidth: "130px", 
            whiteSpace: "nowrap", 
            overflow: "hidden", 
            textOverflow: "ellipsis"
          }}
          title={rowData.Remark} 
        >
          {rowData.Remark && rowData.Remark.trim() ? rowData.Remark : "...."}
        </span>
      )}
    </div>
      )
    }
  ];
  
  const fetchDataCompare = async (startDate = "", endDate = "") => {
    try {
      setLoading(true); 
      const response = await getCompareDefisit(startDate, endDate); 
      setItems(response?.data || []); 
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChangeTabel = (e) => {
    setSelectedDate(e.value);

    if (e.value && e.value.length === 2) {
      const [startDate, endDate] = e.value.map(date => format(date, "yyyy-MM-dd"));
      fetchDataCompare(startDate, endDate);
    } else {
      fetchDataCompare("", ""); // Ambil semua data jika tidak ada filter
    }
  };

  // Fetch data saat pertama kali render
  useEffect(() => {
    fetchDataCompare();
  }, []);



   
  useEffect(() => {
}, [items]); // Ini memastikan kita melihat perubahan pada items
  //materials untu MaterialNo
  const renderHeader = () => {
    return (
      <div className="d-flex align-items-center">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
            style={{ width: '200px', borderRadius: '4px', paddingRight: '10px' }}
          />
        </IconField>
  
        {globalFilterValue && (
          <button 
            onClick={clearSearch} 
            style={{ 
              marginLeft: '-30px', 
              border: 'none', 
              background: 'transparent', 
              cursor: 'pointer', 
              fontSize: '16px', 
              color: '#888' 
            }}
          >
            ?
          </button>
        )}
      </div>
    );
  };
  const onGlobalFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setGlobalFilterValue(value);
  
    if (value === "") {
      // Jika input kosong, tampilkan kembali semua data
      fetchData();
    } else {
      // Filter hanya berdasarkan 'MaterialNo' dan 'Description'
      const filtered = items.filter((item) =>
        item.MaterialNo.toLowerCase().includes(value) || 
        item.Description.toLowerCase().includes(value)
      );
      setItems(filtered);
    }
  };
  
  // Fungsi untuk menghapus pencarian
  const clearSearch = () => {
    setGlobalFilterValue(""); 
    fetchData(); // Ambil ulang semua data
  };
  
  

  
const exportExcel = () => {
  import("xlsx").then((xlsx) => {
    if (!items || items.length === 0) {
      console.warn("No data to export");
      return;
    }
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Hasil: "YYYY-MM-DD"

    // ✅ Mapping data dengan memastikan nilai tidak null atau undefined
    const mappedData = items.map((item, index) => ({
      No: index + 1,
      Date: item.InputDate || "", // Pastikan tidak null
      Shift: shiftOptions.find((shift) => shift.value === item.ShiftId)?.label || "",
      MaterialNo: item.MaterialNo || "",
      Description: item.Description || "",
      PIC: picOptions.find((pic) => pic.value === item.PicId)?.label || "",
      Address: item.Address || "",
      CardNo: item.CardNo || "",
      Section: item.Section || "",
      QtyRec: item.QtyReq || 0,
      SOH: item.StockDatum?.soh ?? 0, // Gunakan `??` untuk nilai default
      OrderDate: item.OrderDate || "",
      OrderPic: item.OrderPic || "",
      Remark: item.Remark || "",
    }));

    // ✅ Buat worksheet dari data yang telah dimapping
    const worksheet = xlsx.utils.json_to_sheet(mappedData);

    // ✅ Tambahkan auto filter (opsional)
    worksheet["!autofilter"] = { ref: "A1:M1" };

    // ✅ Buat workbook dan tambahkan worksheet
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Data");

    // ✅ Konversi workbook menjadi buffer array
    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // ✅ Simpan file Excel
    saveAsExcelFile(excelBuffer, `Data_Red_Post_${formattedDate}`);
  });
};

// ✅ Fungsi untuk menyimpan file
const saveAsExcelFile = (buffer, fileName) => {
  import("file-saver").then((FileSaver) => {
    const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    FileSaver.saveAs(data, `${fileName}.xlsx`);
  });
};



  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "100%", // Pastikan Select tetap 100% lebarnya
    }),
    control: (provided, state) => ({
      ...provided,
      width: "100%", // Memastikan width tetap penuh
      borderColor: "#b22e2e", // Border merah selalu merah
      boxShadow: state.isFocused ? "0 0 0 1px #b22e2e" : "none", // Efek saat fokus
      "&:hover": {
        borderColor: "#b22e2e", // Border tetap merah saat hover
      },
    }),
  };

  // Sort items to show newest first
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => new Date(b.InputDate) - new Date(a.InputDate));
  }, [items]);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  const onSort = (e) => {
    setSortField(e.sortField);
    setSortOrder(e.sortOrder);
};

const onRowEditComplete = async (e) => {
  let { newData, index } = e;
  let updatedData = [...data];
  updatedData[index] = newData;
  try {
      if (newData.id) {
          await updateInput(Number(newData.id), { QtyReq: Number(newData.QtyReq) || 0 });
      } else {
          await postInput({ QtyReq: Number(newData.QtyReq) || 0 });
      }
  } catch (error) {
      console.error('Error updating or adding data:', error);
  }
};


const handleEditClick = (itemId, qtyReqValue) => {
  setIsEditable(itemId); // Tandai item yang sedang diedit
  setQtyRecValues((prev) => ({
    ...prev,
    [itemId]: qtyReqValue ?? "", // Pastikan nilai awal tidak undefined
  }));
};

const handleQtyUpdate = (e, itemId) => {
  setQtyRecValues((prev) => ({
    ...prev,
    [itemId]: e.target.value,
  }));
};

const handleSubmitQty = async (itemId) => {
  setIsEditable(null); // Nonaktifkan mode edit setelah submit

  try {
    const updatedItem = { QtyReq: Number(qtyRecValues[itemId]) || 0 };

    if (itemId) {
      await updateInput(Number(itemId), updatedItem);
    } else {
      await postInput(updatedItem);
    }

    // Perbarui nilai di tabel setelah berhasil update
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, QtyReq: updatedItem.QtyReq } : item
      )
    );
  } catch (error) {
    console.error("Error updating or adding data:", error);
  }
};

const handleKeyPress = async (e, itemId) => {
  if (e.key === "Enter") {
    await handleSubmitQty(itemId);
  }
};





const handleRemarkChange = (id, value) => {
  setItems((prevItems) =>
    prevItems.map((item) =>
      item.id === id ? { ...item, Remark: value } : item
    )
  );
};

const handleSubmitRemark = async (rowData) => {
  const updatedData = { ...rowData };

  try {
    await updateInput(rowData.id, updatedData);
    console.log("Remark updated:", updatedData);
  } catch (error) {
    console.error("Error updating remark: ", error);
  }
};




const handleCardClick = (rowData) => {
  setSelectedDialog(rowData); // Simpan data yang diklik
  setIsModalOpen(true); // Buka modal
};

// Fungsi untuk menutup modal
const closeModal = () => {
  setIsModalOpen(false);
};
const handlePicChange = (selected) => {
  setSelectedPic(selected);

  if (selected) {
    // Cari shift berdasarkan ShiftId dari PIC yang dipilih
    const shift = shiftOptions.find((s) => s.value === selected.ShiftId);
    setSelectedShift(shift || null);
  } else {
    setSelectedShift(null);
  }
};


  const handleDateOrder = (value, rowData) => {
    const updatedData = { 
      ...rowData, 
      OrderDate: value, 
      PICOrder: name // Set PIC Order sesuai user yang mengedit
    };

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === rowData.id ? updatedData : item
      )
    );

  setEditingDateId(rowData.id); // Tandai bahwa item ini sedang diedit
};


const onColumnToggle = (event) => {
  let selectedColumns = event.value
  let orderedSelectedColumns = columns.filter((col) =>
    selectedColumns.some((sCol) => sCol.field === col.field),
  )
  setVisibleColumns(orderedSelectedColumns)
}
const header = () => (
  <MultiSelect
    value={visibleColumns}
    options={columns}
    optionLabel="header"
    onChange={onColumnToggle}
    className="w-full sm:w-20rem mb-2 mt-2"
    display="chip"
    placeholder="Show Hidden Columns"
    style={{ borderRadius: '5px' }}
  />
)

const statusBodyTemplate = (rowData) => {
  if (rowData.Soh > 0 && rowData.Defisit > 0) {
      return (
          <CTooltip content="Check IWMS" placement="top">
              <span>
                  <FaCheckCircle style={{ color: "green", fontSize: "20px", cursor: "pointer" }} />
              </span>
          </CTooltip>
      );
  } else if (rowData.Soh > 0 || rowData.Defisit > 0) {
      return (
          <CTooltip content="Check GI" placement="top">
              <span>
                  <FaExclamationTriangle style={{ color: "orange", fontSize: "20px", cursor: "pointer" }} />
              </span>
          </CTooltip>
      );
  }
  return null; // Jika keduanya kosong, tidak menampilkan ikon
};




  return (
    <CRow>
      <CCol>
        <CCard className="mt-3">
          <CCardHeader className="fw-bold fs-6 fst-italic" >Tabel Compare SOH x Defisit</CCardHeader>
          <CForm>
            <CCardBody>
              <CRow>
                <CCol xs={12} sm={12} md={5} lg={6} xl={8}>
                  <div className="d-flex flex-wrap justify-content-start">
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
                <CCol xs={6} sm={6} md={4} lg={3} xl={2} >
                <div className="d-flex flex-wrap justify-content-end">
                <div className="calendar-container custom-calendar ">
                  <Calendar 
                    value={selectedDate} 
                    onChange={handleDateChangeTabel} 
                    dateFormat="yy-mm-dd" 
                    placeholder="Filter by Date Range"
                    selectionMode="range"
                    readOnlyInput 
                  />
                  <i className="pi pi-calendar calendar-icon"></i>
                </div>
                  </div>
                 </CCol>
                     <CCol xs={6} sm={6} md={3} lg={3} xl={2}>
                     <div className="d-flex flex-wrap justify-content-center">
                  {renderHeader()}
                  </div>
                </CCol>
              </CRow>
              <CRow className="mt-4">
                <div
                  style={{
                    overflowX: 'auto', // Membuat tabel bisa digeser horizontal
                  }}
                >
                  <DataTable 
                      value={items} 
                      sortField={sortField} 
                      sortOrder={sortOrder} 
                      onSort={onSort}
                      header={header}
                      paginator 
                      rowsPerPageOptions={[12, 50, 100, 500]}
                      rows={12}
                      filters={filters}
                      globalFilterFields={['date', 'pic', 'shift', 'materialNo', 'description']}
                      editable 
                      onRowEditComplete={onRowEditComplete}
                      editingRows={editingRows} 
                      onEditingRowsChange={setEditingRows}
                      className="custom-table dashboard"
                      scrollable 
                      scrollHeight="900px"
                      scrollDirection="horizontal"
                    >
                      <Column className='' header="No" body={(rowBody, { rowIndex }) => rowIndex + 1}></Column>
                      {/* <Column field="InputDate" header="Date" 
                      sortable
                      frozen alignFrozen="left"
                      style={{ whiteSpace: 'nowrap', minWidth: '40px' }}  /> */}
                     
                      <Column field="MaterialNo" header="Material No" 
                      style={{ whiteSpace: 'nowrap', minWidth: '85px' }}/>
                      <Column field="Description" header="Description" 
                      style={{ whiteSpace: 'nowrap'}}/>
                  
                      <Column field="Address" header="Address" />
                    
                      <Column 
                        field="Uom" 
                        header="UoM" 
                      />
                     <Column 
                          field="Soh" 
                          header="Count SoH"
                          body={(rowData) => (
                              <span style={{ fontWeight: "bold", color: "#FE4F2D" }}>
                                  {rowData.Soh}
                              </span>
                          )}
                      />

                      <Column 
                          field="Defisit" 
                          header="Count Defisit"
                          body={(rowData) => (
                              <span style={{ fontWeight: "bold", color: "#FF6500" }}>
                                  {rowData.Defisit}
                              </span>
                          )}
                      />
                   {visibleColumns.map((col, index) => (
                    <Column
                      key={index}
                      field={col.field}
                      header={col.header}
                      body={col.body}
                      sortable={col.sortable}
                      // headerStyle={col.headerStyle}
                      // bodyStyle={col.bodyStyle}
                    />
                  ))}
                     <Column 
                      header="Status"
                      body={statusBodyTemplate} 
                      style={{ textAlign: "center" }}
                  />
                  </DataTable>
                </div>
              </CRow>
                <CModal visible={isModalOpen} onClose={closeModal}>
                  <CModalHeader>
                    <CModalTitle>Card No Detail</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    {selectedDialog && (
                      <div>
                        <p><strong>Card No:</strong> {selectedDialog.CardNo}</p>
                        <p><strong>Section:</strong> {selectedDialog.Section}</p>
                      </div>
                    )}
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={closeModal}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
            </CCardBody>
          </CForm>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default InputInventory
