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
  CForm,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CButton,
  CFormInput 

} from '@coreui/react'
import { Button } from 'primereact/button'
import withReactContent from 'sweetalert2-react-content'
import 'primereact/resources/themes/nano/theme.css'
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.min.css'
import useInputService from '../../services/InputDataService'
import usePicService from '../../services/PicService'
import useShiftService from '../../services/ShiftService'
import useStockDataService from '../../services/StockDataService'
import useVerify from '../../hooks/useVerify2.jsx'
import { AbortedDeferredError } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { FaPencilAlt,FaTrash } from "react-icons/fa"; // ? Benar
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faPaperPlane, faCalendarAlt ,faCircle, faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';





const MySwal = withReactContent(Swal)

const InputInventory = () => {
  const { name, roleName, imgProfile } = useVerify()
   const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState([]) // State untuk menyimpan item yang ditambahkan
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const itemsPerPage = 20
  const [inventory, setInventory] = useState([])
  const [selectedMaterialNo, setSelectedMaterialNo] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isWbs, setIsWbs] = useState(false);
  const [cardOptions, setCardOptions] = useState([]);
  const [picOptions, setPicOptions] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [selectedPic, setSelectedPic] = useState(name);
  const [selectedShift, setSelectedShift] = useState(null);
  const [stockId, setStockId] = useState(null);
  const {getInput,getInputById,postInput,updateInput,deleteInputById,getMaterial,getGic,getWbs,getMasterData,uploadInputData } = useInputService()
  const { getStockData, uploadStockData,getSohData } = useStockDataService()
  const [stockData, setStockData] = useState([]);
  const [sohData, setSohData] = useState();
    const {getPic } = usePicService()
  const {getShift} = useShiftService()
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [editingRows, setEditingRows] = useState(null);
const [selectedDate, setSelectedDate] = useState(null);
const [selectedDialog, setSelectedDialog] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [editingRemark, setEditingRemark] = useState("ada");
const [orderDate, setOrderDate] = useState(null);
const [isEditing, setIsEditing] = useState(false);
const [selectedRows, setSelectedRows] = useState([]); // Simpan array ID baris yang dipilih


    const apiSection = 'section-public'
   const apiWbs = 'wbs-public'
    const apiGic = 'gic-public'
  
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
  
    const fetchData = async () => {
      try {
        const response = await getInput(); // Fetch data on mount
        setItems(response.data); // Assuming the response contains data
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    useEffect(() => {
      fetchData()
    }, [])

    
    const getInventories = async () => {
      try {
        const response = await getMaterial();
        console.log("response", response);
  
        // Urutkan data berdasarkan addressRackName
        const sortedData = response.data.sort((a, b) => {
          const rackA = a.Address_Rack?.addressRackName?.toLowerCase() || "";
          const rackB = b.Address_Rack?.addressRackName?.toLowerCase() || "";
          return rackA.localeCompare(rackB);
        });
  
        setInventory(sortedData);
      } catch (error) {
        console.error("Error fetching inventories:", error);
      }
    };
  
    // Fungsi untuk mendapatkan data stok berdasarkan material yang dipilih

    console.log("stockData",stockData);
    
    const fetchStockData = async () => {
      setLoading(true);
      try {
        const response = await getStockData();
        setStockData(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching StockData:", error);
        setStockData([]);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      getInventories();
    }, []);

    useEffect(() => {
      if (selectedMaterialNo) {
        fetchStockData(selectedMaterialNo);
      } else {
        setStockData([]); // Reset stockData jika tidak ada Material No yang dipilih
      }
    }, [selectedMaterialNo]);

    const fetchCardData = useCallback(async () => {
      setIsLoading(true);
      try {
        const response = await getMasterData(apiSection); // Ambil data dari API Section
        const options = response.data.map((item) => ({
          value: item.id,
          label: isWbs ? item.WB.wbsNumber : item.GIC.gicNumber, // Pilih wbsNumber atau gicNumber
          sectionName: item.sectionName, // Simpan sectionName untuk digunakan nanti
        }));
        setCardOptions(options);
      } catch (error) {
        console.error('Failed to fetch card data:', error);
      } finally {
        setIsLoading(false);
      }
  });

  // Trigger fetchCardData when isWbs changes
  useEffect(() => {
    fetchCardData();
  }, [isWbs]);

console.log("picOptions",picOptions);

console.log("Selected Pic Value:", selectedPic);


  const fetchShiftData = async () => {
    try {
      const data = await getShift();

      setShiftOptions(data.data.map((item) => ({ value: item.id, label: item.ShiftName })));
    } catch (error) {
      console.error("Error fetching Shift data:", error);
    }
  };

  useEffect(() => {
    fetchShiftData();
  }, []);
  useEffect(() => {
    if (name === "Shift Red WH") {
      setSelectedShift({ value: 1, label: "Red" });
    } else if (name === "Shift Putih WH") {
      setSelectedShift({ value: 2, label: "White" });
    } else {
      setSelectedShift(null);
    }
  }, [name]);
 
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

const handleRowClick = (rowData) => {
  setSelectedRows((prevSelected) => {
    if (prevSelected.includes(rowData.id)) {
      // Jika sudah ada, hapus dari daftar
      return prevSelected.filter(id => id !== rowData.id);
    } else {
      // Jika belum ada, tambahkan ke daftar
      return [...prevSelected, rowData.id];
    }
  });
};

const mrpBodyTemplate = (rowData) => {
    return rowData.Mrp === 'NQC' ? <Tag severity="danger" value={rowData.Mrp} /> : rowData.Mrp;
};


const actionBodyTemplateRec = (rowData) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
          <span>{rowData.QtyReq}</span>
    </div>
  );
};

const handleDateChangeTabel = (e) => {
  setSelectedDate(e.value);

  if (e.value && e.value.length === 2) {
    const [startDate, endDate] = e.value.map(date => format(date, 'yyyy-MM-dd'));

    setFilters({
      ...filters,
      InputDate: { value: [startDate, endDate], matchMode: 'between' } // Mode "between"
    });
  } else {
    setFilters({
      ...filters,
      InputDate: { value: null, matchMode: 'between' }
    });
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
  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      if (!items || items.length === 0) {
        console.warn("No data to export");
        return;
      }
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0]; // Hasil: "YYYY-MM-DD"
  
      // ✅ Mapping data dengan memastikan nilai tidak null atau undefined
      const mappedData = items.map((item, index) => {
        const remaining = (item.Soh || 0) - (item.SohEdit || 0);
        return {
          No: index + 1,
          Date: item.InputDate || "", 
          PIC: picOptions.find((pic) => pic.value === item.PicId)?.label || "",
          Shift: shiftOptions.find((shift) => shift.value === item.ShiftId)?.label || "",
          MaterialNo: item.MaterialNo || "",
          Description: item.Description || "",
          Address: item.Address || "",
          MRP: item.Mrp || "",
          CardNo: item.CardNo || "",
          UoM: item.Uom || "",
          QtyReq: item.QtyReq || 0,
          SOH: item.Soh ?? 0,
          SoHChange: item.SohEdit ?? 0,
          RemainingSOH: remaining,
          Status: remaining === 0 ? "= IWMS" : "≠ IWMS",
          StatusDate: remaining === 0 ? (item.SohEditDate || formattedDate) : "", // Jika status hijau, tampilkan tanggal
        };
      });
  
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
      saveAsExcelFile(excelBuffer, `Data_RP_Follow_Up_${formattedDate}`);
    });
  };
  
  // ✅ Fungsi untuk menyimpan file
  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((FileSaver) => {
      const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      FileSaver.saveAs(data, `${fileName}.xlsx`);
    });
  };
  const handleEditSohEdit = (rowData) => {
    setEditingRemark(rowData.SohEdit);
    setIsEditing(rowData.id);
  };
  
  const handleSubmitSohEdit = async (rowData) => {
    const editedValue = Number(editingRemark);
    
    if (!editingRemark || !/^\d+$/.test(editingRemark) || editedValue > rowData.Soh) {
      alert("SoH Change tidak boleh lebih dari SOH!");
      return;
    }
  
    const updatedData = { ...rowData, SohEdit: editedValue };
  
    try {
      await updateInput(rowData.id, updatedData);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === rowData.id ? { ...item, SohEdit: editedValue } : item
        )
      );
      setIsEditing(null);
    } catch (error) {
      console.error("Error updating SohEdit: ", error);
    }
  };
  
  const handleDateChange = (value, rowData) => {
    setOrderDate(value);
    const updatedData = { ...rowData, OrderDate: value };
  
    setItems((prevItems) => prevItems.map(item =>
      item.id === rowData.id ? updatedData : item
    ));
  };
   


  return (
    <CRow>
      <CCol>
        <CCard className="mt-3">
        <CCardHeader>
        <span className="blinking-text">
            Follow Up SoH
            </span> 
            </CCardHeader>
          <CForm>
            <CCardBody>
            <CRow className="align-items-center">
                {/* Bagian kiri untuk Button & Calendar */}
                <CCol xs={6} sm={6} md={6} lg={6} xl={6}>
                    
                    <Button
                        type="button"
                        label="Excel"
                        icon="pi pi-file-excel"
                        severity="success"
                        className="rounded-3"
                        onClick={exportExcel}
                        data-pr-tooltip="XLS"
                    />

                    {/* <div className="calendar-container custom-calendar">
                        <Calendar
                        value={selectedDate}
                        onChange={handleDateChangeTabel}
                        dateFormat="yy-mm-dd"
                        placeholder="Filter by Date Range"
                        selectionMode="range"
                        readOnlyInput
                        />
                        <i className="pi pi-calendar calendar-icon"></i>
                    </div> */}
                </CCol>

                {/* Bagian kanan untuk renderHeader */}
                <CCol xs={6} sm={6} md={6} lg={6} xl={6}>
                <div className="d-flex gap-1 d-flex flex-wrap justify-content-end align-items-center">
                <div className="calendar-container custom-calendar">
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
                    <div className="d-flex flex-wrap justify-content-end align-items-center">
                    {renderHeader()}
                    </div>
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
                  rowClassName={(rowData) => selectedRows.includes(rowData.id) ? "selected-row" : ""}
                  onRowClick={(e) => handleRowClick(e.data)} // Klik untuk toggle
                >
                  <Column className='' header="No" body={(rowBody, { rowIndex }) => rowIndex + 1}></Column>
                  <Column field="InputDate" header="Date" 
                    sortable
                    frozen alignFrozen="left"
                    style={{ whiteSpace: 'nowrap', minWidth: '80px' }}  
                  />
                  <Column 
                    field="ShiftId" 
                    header="Shift" 
                    frozen alignFrozen="left"
                    body={(rowData) => (
                      <span>
                        {shiftOptions.find(shift => shift.value === rowData.ShiftId)?.label.charAt(0) || ""}
                      </span>
                    )} 
                  />
                  <Column field="MaterialNo" header="Material No" 
                    style={{ whiteSpace: 'nowrap', minWidth: '90px' }}
                  />
                  <Column field="Description" header="Description" 
                    style={{ whiteSpace: 'nowrap'}}
                  />
                  <Column field="Address" header="Address" />
                  <Column field="Mrp" header="MRP Type" body={mrpBodyTemplate}  />
                  <Column 
                    field="CardNo" 
                    header="Card No" 
                    body={(rowData) => (
                      <span 
                        style={{ cursor: "pointer" }} 
                        onClick={() => handleCardClick(rowData)}
                      >
                        {rowData.CardNo}
                      </span>
                    )} 
                  />
                  <Column field="Uom" header="UoM" />
                  <Column body={actionBodyTemplateRec} 
                    field="QtyReq" 
                    header="Qty Req"
                  />
                  <Column 
                    field="Soh" 
                    header="SOH" 
                    body={(rowData) => (
                      <div style={{ 
                        textAlign: 'center', 
                        fontWeight: 'bold', 
                        color: rowData.Soh > 0 ? 'red' : 'black' 
                      }}>
                        {rowData.Soh}
                      </div>
                    )}
                  />
              <Column 
              field="SohEdit" 
              header="SoH Change"
              body={(rowData) => (
                <div 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    background: "white", 
                    padding: "5px", 
                    borderRadius: "4px", 
                    justifyContent: "space-between",
                    maxWidth: "100px",
                  }}
                >
                  {isEditing === rowData.id ? (
                    <CFormInput
                      type="number"
                      value={editingRemark}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {  
                          setEditingRemark(value); 
                        }
                      }}
                      onBlur={() => {
                        if (Number(editingRemark) > rowData.Soh) {
                          setEditingRemark(rowData.Soh.toString()); // Jika lebih dari SOH, reset ke SOH
                        }
                      }}
                      min={0}
                      max={rowData.Soh} 
                      placeholder="0"
                      style={{ 
                        flexGrow: 1, 
                        border: "none", 
                        outline: "none", 
                        maxWidth: "100px",
                        maxHeight: "20px", 
                        fontSize: "12px",
                        overflow: "hidden"
                      }}
                    />
                  ) : (
                    <span 
                    style={{ 
                      flexGrow: 1, 
                      color: rowData.SohEdit ? "black" : "gray", 
                      maxWidth: "80px", 
                      whiteSpace: "nowrap", 
                      overflow: "hidden", 
                      textOverflow: "ellipsis" 
                    }}
                    title={rowData.SohEdit ? String(rowData.SohEdit) : "0"}
                  >
                    {rowData.SohEdit ? String(rowData.SohEdit).trim() : "0"}
                  </span>                  
                    )}
                      <button 
                        onClick={() => isEditing === rowData.id ? handleSubmitSohEdit(rowData) : handleEditSohEdit(rowData)}
                        style={{ background: "none", border: "none", cursor: "pointer", marginLeft: "8px", alignSelf: "flex-end" }}
                        disabled={isEditing === rowData.id && (!editingRemark || !/^\d+$/.test(editingRemark))}
                      >
                        {isEditing === rowData.id ? (
                          <FontAwesomeIcon icon={faPaperPlane} style={{ color: editingRemark ? "blue" : "gray" }} />
                        ) : (
                          <FontAwesomeIcon icon={faPencilAlt} style={{ color: "gray" }} />
                        )}
                      </button>
                     </div>
                    )}
                  />
                   <Column 
                    field="Remaining" 
                    header="Remain. SOH"
                    body={(rowData) => {
                      const remaining = (rowData.Soh || 0) - (rowData.SohEdit || 0);
                      
                      return (
                        <div 
                          style={{ 
                            textAlign: "center", 
                            fontWeight: "bold", 
                            color: remaining > 0 ? "red" : "black" 
                          }}
                        >
                          {remaining}
                        </div>
                      );
                    }}
                  />
                                  
                   <Column 
                    field="Status" 
                    frozen alignFrozen="right"
                    header="Status"  
                    body={(rowData) => {
                      const remaining = (rowData.Soh || 0) - (rowData.SohEdit || 0);
                  
                      return (
                        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                          {remaining === 0 ? (
                            <FontAwesomeIcon 
                              icon={faCircle} 
                              style={{ color: 'green', fontSize: '1.2rem' }} 
                              title="= IWMS" 
                            />
                          ) : (
                            <FontAwesomeIcon 
                              icon={faExclamationTriangle} 
                              style={{ color: 'orange', fontSize: '1.2rem' }} 
                              title="≠ IWMS" 
                            />
                          )}
                        </div>
                      );
                    }}
                    sortable
                  />
                 <Column 
                  field="SohEditDate" 
                  header="Status Date"
                  body={(rowData) => {
                    const remaining = (rowData.Soh || 0) - (rowData.SohEdit || 0);

                    return remaining === 0 ? ( // Hanya tampil jika Status sudah hijau
                      <div style={{ display: "flex", alignItems: "center", background: "white", padding: "5px", borderRadius: "4px" }}>
                        <input
                          type="date"
                          value={rowData.SohEditDate || new Date().toISOString().split("T")[0]} // Default ke hari ini jika kosong
                          onChange={(e) => handleDateChange(e.target.value, rowData)}
                          style={{ flexGrow: 1, border: "none", outline: "none" }}
                        />
                      </div>
                    ) : (
                      <span>-</span> // Tampilkan "-" jika Status belum hijau
                    );
                  }}
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
