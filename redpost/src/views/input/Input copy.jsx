import React, { useState, useEffect, useRef,useCallback, Suspense,useMemo } from 'react'
import { FilterMatchMode } from 'primereact/api'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import * as XLSX from "xlsx";
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
import usePicService from '../../services/PicService'
import useShiftService from '../../services/ShiftService'
import useStockDataService from '../../services/StockDataService'
import useVerify from '../../hooks/useVerify2.jsx'
import { AbortedDeferredError } from 'react-router-dom'
import { format, parseISO } from 'date-fns'

const MySwal = withReactContent(Swal)

const InputInventory = () => {
  const { name, roleName, imgProfile } = useVerify()
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
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false)
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [selectedMrp, setSelectedMrp] = useState([])
  const [selectedMaterialNo, setSelectedMaterialNo] = useState(null)
  const [searchTerm, setSearchTerm] = useState('') // Menyimpan input pengguna
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDescription, setSelectedDescription] = useState(null)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [conversionUom, setConversionUom] = useState('')
  const [baseUom, setBaseUom] = useState('')
  const [isWbs, setIsWbs] = useState(true);
  const [cardOptions, setCardOptions] = useState([]);
  const [picOptions, setPicOptions] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [selectedPic, setSelectedPic] = useState(name);
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [qtyRec, setQtyRec] = useState(null);
  const [stockId, setStockId] = useState(null);
  const {getInput,getInputById,postInput,updateInput,deleteInputById,getMaterial,getGic,getWbs,getMasterData } = useInputService()
  const { getStockData, uploadStockData,getSohData } = useStockDataService()
  const [stockData, setStockData] = useState([]);
  const [sohData, setSohData] = useState();
  const [selectedSoh, setSelectedSoh] = useState(null);
  const [isEditable, setIsEditable] = useState(false); // To toggle edit mode
  const {getPic } = usePicService()
  const {getShift} = useShiftService()
  const [loading, setLoading] = useState(false);
  const [qtyReq, setQtyReq] = useState(null); // Track the value of the input field
  const [qtyReqEdit, setQtyReqEdit] = useState(0); // Untuk update (handleEditClick)
  
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
      const response = isWbs ? await getMasterData(apiWbs) : await getMasterData(apiGic); // Call the appropriate API
      const options = response.data.map((item) => ({
        value: item.id,
        label: isWbs ? item.wbsNumber: item.gicNumber // Use cardNo or a fallback
      }));
      setCardOptions(options); // Update options
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
  


  
  const fetchSohData = async (materialNo) => {
    setLoading(true);
    try {
      const response = await getSohData(materialNo);
      console.log("cek soh:", response.data.soh);

      setSohData(response.data.soh);
      setStockId(response.data.id);
    } catch (error) {
      console.error("Error fetching StockData:", error);
      setSohData();
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
      // Check if stockId is set before proceeding
    if (!stockId) {
      console.error("stockId is null or undefined");
      return; // Exit early if stockId is not available
    }
    // Menyiapkan data yang akan dikirim ke API
    const timeZone = 'Asia/Jakarta';
    // Get the current date in WIB (Asia/Jakarta)
    const currentDateInWIB = new Date(); // Current local time
    const today = format(currentDateInWIB, 'yyyy-MM-dd', { timeZone }); // Format the date to "yyyy-mm-dd"

    const data = {
      InputDate: today, // Tanggal
      MaterialNo: selectedMaterialNo?.label, // PIC yang dipilih
      Description: selectedDescription?.label, // Shift yang dipilih
      Address: selectedAddress?.label, // Material No yang dipilih
      Mrp: selectedMrp?.label,
      CardNo: selectedCard?.label, // Description yang dipilih
      QtyReq: qtyRec, // Card No yang dipilih
      ShiftId: selectedShift?.value, // Quantity yang dimasukkan
      Pic :name,
      Soh : sohData,
      StockDataId:stockId
    };
    console.log("TESSS",data)
    
  
    // Memulai loading saat proses request
    setIsLoading(true);
  
    try {
      const response = await postInput(data); // Mengirim data ke API
      if (response) {
        // Menambahkan item baru ke state items
        setItems((prevItems) => [response.data, ...prevItems]); // ⬅️ Tambahkan item ke paling atas
        setCurrentPage(1);
        localStorage.setItem("currentPage", 1); // ⬅️ Simpan state ke localStorage
        setQtyReq(0); // Reset qtyReq agar tidak digunakan untuk update
        // Reset form setelah submit berhasil
        setDate(new Date().toLocaleDateString('en-CA'));
        setSelectedPic(null);
        setSelectedShift(null);
        setSelectedMaterialNo(null);
        setSelectedMrp(null);
        setSelectedDescription(null);
        setSelectedCard(null);
        setQtyRec(null);
        setStockId(null);
      }
    } catch (error) {
      console.error("Error adding data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // ⬅️ Reset ke halaman pertama saat refresh
  }, []);

  useEffect(() => {
  console.log("Updated Items:", items);
}, [items]); // Ini memastikan kita melihat perubahan pada items
  //materials untu MaterialNo
  
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
  

  //qty Change untuk add/input
  const handleQtyChange = (e) => {
    const value = e.target.value; // Extract the value from the event
    setQtyRec(value); // Set the value as state
  };
  console.log("stockId",stockId);
  console.log("QtyRec",qtyRec);

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
    import("xlsx").then((xlsx) => {
      // 🔹 Mapping data dari tabel agar sesuai dengan format Excel
      const mappedData = currentItems.map((item, index) => ({
        No: index + 1,
        Date: item.InputDate,
        PIC: picOptions.find((pic) => pic.value === item.PicId)?.label || "",
        Shift: shiftOptions.find((shift) => shift.value === item.ShiftId)?.label || "",
        "Material No": item.MaterialNo,
        Description: item.Description,
        Address: item.Address,
        "MRP Type": item.Mrp,
        "Card No": item.CardNo,
        "Qty Rec": item.QtyReq,
        SOH: item.StockDatum?.soh || 0, // Pastikan SOH tetap terisi
      }));
  
      // 🔹 Buat worksheet dari data yang telah dimapping
      const worksheet = xlsx.utils.json_to_sheet(mappedData);
  
      // 🔹 Buat workbook baru dan tambahkan worksheet
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Data");
  
      // 🔹 Konversi workbook menjadi buffer array
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
  
      // 🔹 Simpan file Excel
      saveAsExcelFile(excelBuffer, "Data Red Post");
    });
  };
  
  // ✅ Fungsi untuk menyimpan file Excel dengan nama yang mencantumkan tanggal
  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((FileSaver) => {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      const fileWithDate = `${fileName} ${formattedDate}.xlsx`; // Tambahkan tanggal ke nama file
  
      const data = new Blob([buffer], { type: "application/octet-stream" });
      FileSaver.saveAs(data, fileWithDate);
    });
  };
  

  const handleMaterialNoChange = (selectedMaterial) => {
    console.log("Selected Material:", selectedMaterial);
    if (selectedMaterial) {

      // Temukan item dari inventory berdasarkan materialNo yang dipilih
      const selectedItem = inventory.find((item) => item.id === selectedMaterial.value)


      if (selectedItem) {
        // Set nilai description, address, dan uom berdasarkan item yang ditemukan
        setSelectedMaterialNo(selectedMaterial) // Atur material yang dipilih
        setSelectedDescription({ value: selectedItem.id, label: selectedItem.Material.description })
        setSelectedMrp({ value: selectedItem.id, label: selectedItem.Material.mrpType })
        setSelectedAddress({
          value: selectedItem.id,
          label: selectedItem.Address_Rack.addressRackName,
        })
        fetchSohData(selectedItem.Material.materialNo)
        setBaseUom(selectedItem.Material.uom)
      }
    } else {
      // Reset semua state jika tidak ada material yang dipilih
      
      setSelectedMaterialNo(null)
      setSelectedDescription(null)
      setSohData(null)
      setSelectedMrp(null)
      setSelectedAddress(null)
    }
  }

  const handleDescriptionChange = (selectedDescription) => {
    if (selectedDescription) {
      // Temukan item dari inventory berdasarkan description yang dipilih
      const selectedItem = inventory.find((item) => item.id === selectedDescription.value)

      if (selectedItem) {
        // Set nilai description, address, dan uom berdasarkan item yang ditemukan
        setSelectedDescription(selectedDescription) // Atur material yang dipilih
        setSelectedMaterialNo({ value: selectedItem.id, label: selectedItem.Material.materialNo })
        setSelectedAddress({
          value: selectedItem.id,
          label: selectedItem.Address_Rack.addressRackName,
        })
        setSelectedMrp({ value: selectedItem.id, label: selectedItem.Material.mrpType })
        setConversionUom(selectedItem.Material.Packaging?.packaging)
        setConversionRate(selectedItem.Material.Packaging?.unitPackaging)
        setBaseUom(selectedItem.Material.uom)

      }
    } else {
      // Reset semua state jika tidak ada material yang dipilih
      setSelectedMaterialNo(null)
      setSelectedDescription(null)
      setSelectedMrp(null)
      setSelectedAddress(null)
    }
  }
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
  console.log('cek wbs',isWbs);
  
  

  // Enable the input field for editing
  const handleEditClick = (itemId, qtyReqValue) => {
    setIsEditable(itemId); // Set the item to be editable
    setQtyReq(qtyReqValue); // Set the initial value for the input field
  };

  // Handle the Enter key press to confirm changes
  const handleKeyPress = async (e, itemId) => {
    if (e.key === 'Enter') {
      setIsEditable(null); // Menonaktifkan mode edit
  
      try {
        const updatedItem = { QtyReq: Number(qtyReqEdit) || 0 }; // Pastikan tidak null
  
        console.log("Updating item with ID:", itemId); // Debugging
  
        if (itemId) {
          await updateInput(Number(itemId), updatedItem); // Pastikan itemId dikonversi ke angka
        } else {
          await postInput(updatedItem);
        }
      } catch (error) {
        console.error('Error updating or adding data:', error);
      }
    }
  };
  
  // Sort items to show newest first
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => new Date(b.InputDate) - new Date(a.InputDate));
  }, [items]);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);


  

  return (
    <CRow>
      <CCol>
        {isFormVisible && (
          <CCard>
            <CCardHeader>Form Input</CCardHeader>
            <CForm>
              <CCardBody>
                <CRow className="mt-1">
                <CCol xs={12} sm={6} md={3} xl={3}>
                  <CFormLabel htmlFor="materialNo" 
                  style={{ 
                    fontSize: '13px', }}>
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
                     styles={customStyles}
                   />
                    </CInputGroup>
                 </CCol>
                  <CCol xs={12} sm={6} md={4} xl={4} >
                    <CFormLabel htmlFor="description" style={{ fontSize: '13px' }}>
                      Description
                    </CFormLabel>
                    <Select
                    className="basic-single"
                    classNamePrefix="Select Material No"
                    isLoading={isLoading}
                    isClearable={isClearable}
                    isDisabled={true}
                    options={(filteredInventory.length > 0 ? filteredInventory : inventory).map(
                      (i) => ({
                        value: i.id,
                        label: i.Material.description,
                      }),
                    )}
                    id="description"
                    onChange={handleDescriptionChange}
                    value={selectedDescription}
                  />
                  </CCol>
                  <CCol xs={12} sm={6} md={3} xl={3} >
                  <CFormLabel htmlFor="address" style={{ fontSize: '13px' }}>Address</CFormLabel>
                  <Select
                    className="basic-single"
                    classNamePrefix="Select Material No"
                    isLoading={isLoading}
                    isClearable={isClearable}
                    options={(filteredInventory.length > 0 ? filteredInventory : inventory).map(
                      (i) => ({
                        value: i.id,
                        label: i.Address_Rack.addressRackName,
                      }),
                    )}
                    id="address"
                    onChange={setSelectedAddress}
                    value={selectedAddress}
                    isDisabled={true}
                  />
                </CCol>
                <CCol xs={12} sm={6} md={2} xl={2} >
                  <CFormLabel htmlFor="mrp" style={{ fontSize: '13px' }}>MRP</CFormLabel>
                  <Select
                    className="basic-single"
                    classNamePrefix="Select Material No"
                    isLoading={isLoading}
                    isClearable={isClearable}
                    options={(filteredInventory.length > 0 ? filteredInventory : inventory).map(
                      (i) => ({
                        value: i.id,
                        label: i.Material.mrpType,
                      }),
                    )}
                    id="mrp"
                    onChange={setSelectedMrp}
                    value={selectedMrp}
                    isDisabled={true}
                  />
                </CCol>
                  </CRow>
                  <CRow>
                  <CCol xs={12} sm={2} md={2} xl={2}  className="mt-1">
                        <label style={{ fontSize: '13px' }}>Card No</label>
                        <CFormCheck
                          type="radio"
                          id="payment1"
                          label="WBS"
                          checked={isWbs} // Properly bind to isWbs
                          onChange={() => setIsWbs(true)} // Set state to WBS
                        />
                        <CFormCheck
                          type="radio"
                          id="payment2"
                          label="GIC"
                          checked={!isWbs} // Check if GIC is selected
                          onChange={() => setIsWbs(false)} // Set state to GIC
                        />
                      </CCol>
                      <CCol xs={12} sm={10} md={4} xl={3}  className="mt-1">
                       <CFormLabel htmlFor="cardNo" style={{ fontSize: '13px' }}>
                         ID Card
                       </CFormLabel>
                       <CInputGroup className="flex-nowrap" style={{ width: '100%' }}>
                         <Select
                           className="basic-single"
                           classNamePrefix="select"
                            isLoading={isLoading} // Show loading spinner
                           options={cardOptions} // Options from API
                           onChange={setSelectedCard}
                           id="cardNo"
                           placeholder="Select Card..."
                           styles={{ container: (provided) => ({ ...provided, width: '100%' }) }}
                           isDisabled={!selectedMaterialNo} // DISABLED jika Material No belum dipilih
                         />
                       </CInputGroup>
                     </CCol>
                     <CCol xs={12} sm={6} md={3} xl={4}  className="mt-1">
                    <CFormLabel htmlFor="pic" style={{ fontSize: '13px' }}>
                      PIC
                    </CFormLabel>
                    <CInputGroup className="flex-nowrap" style={{ width: '100%' }}>
                      <CFormInput
                        className="basic-single"
                        placeholder="PIC"
                        id="pic"
                        value={name}
                        styles={{ container: (provided) => ({ ...provided, width: '100%' }) }}
                        disabled
                      />
                    </CInputGroup>
                  </CCol>
                  <CCol xs={12} sm={6} md={3} xl={3}  className="mt-1">
                    <CFormLabel htmlFor="shift" style={{ fontSize: '13px' }}>
                      Shift
                    </CFormLabel>
                    <CInputGroup className="flex-nowrap" style={{ width: '100%' }}>
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        isClearable={isClearable}
                        id="shift"
                        options={shiftOptions}
                        value={selectedShift}
                        onChange={setSelectedShift}
                        styles={{ container: (provided) => ({ ...provided, width: '100%' }) }}
                        isDisabled={!selectedMaterialNo} // DISABLED jika Material No belum dipilih
                      />
                    </CInputGroup>
                  </CCol>
                  </CRow>  
                <CRow>
                  <CCol xs={12} sm={6} md={3} xl={3} className="mt-1">
                    <CFormLabel htmlFor="qty" style={{ fontSize: '13px' }}>
                    {`Quantity Input (${baseUom})`}
                    </CFormLabel>
                    <CFormInput
                      type="number"
                      placeholder="Input.."
                      text="Must be number."
                      aria-describedby="quantity"
                      required
                      inputMode="numeric"
                      value={qtyRec}
                      onChange={handleQtyChange} // Attach the change handler
                      autoComplete="off"
                      disabled={!selectedMaterialNo} // DISABLED jika Material No belum dipilih
                    />
                  </CCol>
                  <CCol xs={12} sm={5} md={3} xl={2} className="mt-1">
                      <CFormLabel htmlFor="soh" style={{ fontSize: "13px" }}>
                        {` SOH  (${baseUom})`}
                      </CFormLabel>
                      <CFormInput
                      type="text"
                      placeholder="SoH.."
                      required
                      inputMode="numeric"
                      autoComplete="off"
                      className="basic-single"
                      classNamePrefix="Select Material No"
                      isClearable
                      id="soh"
                      value={sohData}
                      disabled={true} // DISABLED jika Material No belum dipili
                    />
                    </CCol>
                  <CCol
                    xs={12} sm={6} md={3} xl={3}
                    className="d-flex justify-content-start align-items-center mt-1"
                  >
                   <CButton color="primary" onClick={handleAdd}>Add</CButton>
                  </CCol>
                </CRow>
                {/* Collapse content */}
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
                      label={isFormVisible ? 'Hide Input' : 'Show Input'}
                      icon={isFormVisible ? 'pi pi-minus' : 'pi pi-plus'}
                      severity="primary"
                      className="rounded-3 me-2 mb-2"
                      onClick={() => setIsFormVisible((prev) => !prev)}
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
                    style={{
                      fontSize: '14px', // Mengurangi ukuran font
                    }}
                  >
                    <CTableHead color="dark">
                      <CTableRow>
                        <CTableHeaderCell
                          scope="col"
                          onClick={() => handleSort('date')}
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
                          onClick={() => handleSort('pic')}
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
                        <CTableHeaderCell scope="col" onClick={() => handleSort('materialNo')} >
                          Material No{' '}
                          {sortConfig.key === 'materialNo' && (
                            <CIcon
                              icon={sortConfig.direction === 'asc' ? cilArrowTop : cilArrowBottom}
                            />
                          )}
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" onClick={() => handleSort('description')} >
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
                        <CTableHeaderCell scope="col" onClick={() => handleSort('qtyRec')}>
                          Qty Rec{' '}
                          {sortConfig.key === 'qtyRec' && (
                            <CIcon
                              icon={sortConfig.direction === 'asc' ? cilArrowTop : cilArrowBottom}
                            />
                          )}
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" onClick={() => handleSort('soh')}   style={{ color: 'red' }} >
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
                      {currentItems.map((item) => (
                        <CTableRow key={item.id}>
                          <CTableDataCell className="align-middle"> {item.InputDate}</CTableDataCell>
                          <CTableDataCell className="align-middle">{item.Pic}</CTableDataCell>
                          <CTableDataCell className="align-middle">{shiftOptions.find(shift => shift.value === item.ShiftId)?.label || ""}</CTableDataCell>
                          <CTableDataCell className="align-middle">{item.MaterialNo}</CTableDataCell>
                          <CTableDataCell className="align-middle">{item.Description}</CTableDataCell>
                          <CTableDataCell className="align-middle">{item.Address}</CTableDataCell>
                          <CTableDataCell 
                          className={`align-middle ${item.Mrp === 'NQC' ? 'bg-danger text-white' : ''}`}>{
                            item.Mrp}
                          </CTableDataCell>
                          <CTableDataCell className="align-middle">{item.CardNo}</CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex align-items-center">
                              {/* Conditionally render either the input or the label */}
                              {isEditable === item.id ? (
                                <CFormInput
                                  type="number"
                                  value={qtyReq}
                                  onChange={(e) => handleQtyChange(e, item.id)} // Pass itemId here
                                  onKeyDown={(e) => handleKeyPress(e, item.id)} // Listen for Enter key press
                                  className="form-control-sm text-center align-middle"
                                  style={{ width: "65px" }}
                                  autoFocus // Automatically focus on the input field
                                />
                              ) : (
                                <div 
                                  className="d-flex align-items-center" 
                                  style={{
                                    padding: "5px 10px", 
                                    border: "1px solid #ccc", 
                                    borderRadius: "4px", 
                                    backgroundColor: "#fff", 
                                    minWidth: "65px", 
                                    textAlign: "center"
                                  }}
                                >
                                  <span>{item.QtyReq}</span> {/* Display current value if not in edit mode */}
                                </div>
                              )}
                                    <CIcon
                                      className="ms-2"
                                      icon={cilPencil}
                                      size="sm"
                                      style={{ fontSize: "10px", cursor: "pointer", color: "black" }}
                                      onClick={() => handleEditClick(item.id, item.QtyReq)} // Trigger edit mode for specific item
                                    />
                                  </div>
                          </CTableDataCell>
                          <CTableDataCell className="align-middle"> 
                              {item.Soh}
                            </CTableDataCell>

                          <CTableDataCell
                            style={{ position: 'sticky', right: 0 }}
                             className="text-center align-middle"
                          >
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
                  <div className="d-flex justify-content-center align-items-center mt-3">
                    <CButton disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                      Previous
                    </CButton>
                    <span className="mx-3">Page {currentPage} of {totalPages}</span>
                    <CButton disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                      Next
                    </CButton>
                  </div>
                </div>
              </CRow>
            </CCardBody>
          </CForm>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default InputInventory
