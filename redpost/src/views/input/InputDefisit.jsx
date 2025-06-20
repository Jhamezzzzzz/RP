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
import CreatableSelect from "react-select/creatable";
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
  CToast, 
  CToastBody, 
  CToastClose,
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
import useInputDefService from '../../services/InputDefisitService'
import usePicService from '../../services/PicService'
import useShiftService from '../../services/ShiftService'
import useStockDataService from '../../services/StockDataService'
import useVerify from '../../hooks/useVerify2.jsx'
import { AbortedDeferredError } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { FaPencilAlt,FaTrash,FaCheck } from "react-icons/fa"; // ? Benar
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faExclamationTriangle,faPencilAlt,faCircleCheck,faTimesCircle,faCheck,faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { MultiSelect } from 'primereact/multiselect';
import { useToast } from "../../App";
import { set } from 'lodash'

const MySwal = withReactContent(Swal)



const InputInventory = () => {
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'))
  const [isFormVisible, setIsFormVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isClearable, setIsClearable] = useState(true)
  const [items, setItems] = useState([]) // State untuk menyimpan item yang ditambahkan
  const [totalDefisit, setTotalDefisit] = useState() // State untuk menyimpan item yang ditambahkan
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const itemsPerPage = 20
  const [inventory, setInventory] = useState([])
  const [selectedMrp, setSelectedMrp] = useState([])
  const [selectedMaterialNo, setSelectedMaterialNo] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDescription, setSelectedDescription] = useState(null)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [costcenter, setCostcenter] = useState(null)
  const [conversionUom, setConversionUom] = useState('')
  const [baseUom, setBaseUom] = useState('')
  const [isWbs, setIsWbs] = useState(false);
  const [cardOptions, setCardOptions] = useState([]);
  const [picOptions, setPicOptions] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [qtyRec, setQtyRec] = useState(null);
  const [headtext, setHeadtext] = useState(null);
  const [stockId, setStockId] = useState(null);
  const { getInputDefisit,getTotalInputDefisit, getInputDefisitById, postInputDefisit, updateInputDefisit, deleteInputById, getMaterial, getGic, getWbs, getMasterData,uploadInputData } = useInputDefService()
  const [sohData, setSohData] = useState();
  const [isEditable, setIsEditable] = useState(false); // To toggle edit mode
  const {getPic } = usePicService()
  const {getShift} = useShiftService()
  const [qtyReq, setQtyReq] = useState(null); // Track the value of the input field
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
  const addToast = useToast();
  const { name, roleName, imgProfile } = useVerify()
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

  const columns = [
    {
      field: "createdAt", // ← pakai titik dua
      header: "Created At",
      style: { whiteSpace: 'nowrap', minWidth: '500px', textAlign: 'center' },
      body: (rowData) => {
        if (!rowData.createdAt) return "-";
        const date = new Date(rowData.createdAt);
        return format(date, "dd-MM-yyyy");
      }
    }
  ];
  
  const fetchTotalDef = async () => {
    const data = await getTotalInputDefisit(selectedDate); // Jika `selectedDate` null, API akan menampilkan semua data
    setTotalDefisit(data.totalDefisit);
  };
  
  useEffect(() => {
    fetchTotalDef();
  }, [selectedDate]); // Akan fetch ulang saat tanggal berubah

    const fetchData = async () => {
      try {
        
        const response = await getInputDefisit(); // Fetch data on mount
        
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

    useEffect(() => {
      getInventories();
    }, []);


    const fetchCardData = useCallback(async () => {
      setIsLoading(true);
      try {
        // Ambil data dari API Section
        const responseSection = await getMasterData(apiSection);
        const optionsSection = responseSection.data.map((item) => ({
          value: item.id,
          label: isWbs ? item.WB.wbsNumber : item.GIC.gicNumber,
          sectionName: item.sectionName, // Gunakan sectionName dari apiSection
        }));
    
        let optionsGic = [];
        if (!isWbs) { // Jika memilih GIC, tambahkan data dari apiGic
          const responseGic = await getMasterData(apiGic);
          optionsGic = responseGic.data.map((item) => ({
            value: item.id,
            label: item.gicNumber,
            sectionName: item.Cost_Center.costCenterName, // Ambil costCenterName dari apiGic
          }));
        }
    
        // Gabungkan data dari apiSection dan apiGic (jika GIC dipilih)
        setCardOptions([...optionsSection, ...optionsGic]);
      } catch (error) {
        console.error('Failed to fetch card data:', error);
      } finally {
        setIsLoading(false);
      }
    })

  // Trigger fetchCardData when isWbs changes
  useEffect(() => {
    fetchCardData();
  }, [apiSection, apiGic, isWbs]);


const fetchPic = async () => {
  try {
    const response = await getPic();
    if (response?.data?.length > 0) {
      setPicOptions(response.data.map((item) =>  ({
        value: item.id,
        label: item.PicName,
        ShiftId: item.ShiftId, // Tambahkan ShiftId ke setiap PIC
      })));
      // Ambil PIC pertama dari list sebagai contoh
      setPic(response.data.PicName); 
    }
  } catch (error) {
    console.error("Error fetching PIC:", error);
  }
};

// Panggil fetchPic saat komponen dimuat
useEffect(() => {
  fetchPic();
}, []);

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



  const handleAdd = async () => {
      // Check if stockId is set before proceeding
 
    // Menyiapkan data yang akan dikirim ke API
    const timeZone = 'Asia/Jakarta';
    // Get the current date in WIB (Asia/Jakarta)
    const currentDateInWIB = new Date(); // Current local time
    const today = format(currentDateInWIB, 'yyyy-MM-dd', { timeZone }); // Format the date to "yyyy-mm-dd"

    const data = {
      InputDate: today, // Tanggal
      MaterialNo: selectedMaterialNo?.label, // PIC yang dipilih
      Description: selectedDescription?.label || "", // Bisa input manual atau kosong
      Address: selectedAddress?.label || "", // Material No yang dipilih
      Mrp: selectedMrp?.label || "",
      CardNo: selectedCard?.label, // Description yang dipilih
      CostCenter:costcenter,
      Uom:baseUom,
      QtyReq: qtyRec, 
      QtyUpdate:"",
      RemainQty:"",
      DefPic: "",
      Section: selectedSection || "",
      NoGI: headtext, // Remark awal kosong
      OrderDate: null,
      ShiftId: selectedShift?.value, 
      PicId : selectedPic?.value,

    };
    // Memulai loading saat proses request
    setIsLoading(true);
  
    try {
      const response = await postInputDefisit(data); // Mengirim data ke API
      if (response) {
        // Menambahkan item baru ke state items
        setItems((prevItems) => [response.data, ...prevItems]); // ?? Tambahkan item ke paling atas
        setCurrentPage(1);
        localStorage.setItem("currentPage", 1); // ?? Simpan state ke localStorage
        setQtyReq(0); // Reset qtyReq agar tidak digunakan untuk update
        // Reset form setelah submit berhasil
        setDate(new Date().toLocaleDateString('en-CA'));
        setSelectedSection(null);
        setSelectedShift(null);
        setSelectedAddress(null);
        setSelectedMaterialNo(null);
        setSelectedPic(null);
        setSelectedMrp(null);
        setSelectedDescription(null);
        setSelectedCard(null);
        setSelectedSection(null);
        setQtyRec("");
        setHeadtext("");
        setStockId(null);
        setCostcenter("");
        setSohData("");
        setBaseUom("");

        addToast("Success, Input Defisit", "success", "info");
      }
    } catch (error) {
      console.error("Error adding data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // ?? Reset ke halaman pertama saat refresh
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
  
  
const handleDelete = async (id) => {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: 'Data yang dihapus tidak dapat dikembalikan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteInputById(id); // Hapus data berdasarkan ID
        const updatedData = await getInputDefisit(); // Ambil data terbaru setelah penghapusan
        setItems(updatedData.data); // Perbarui state

        Swal.fire(
          'Terhapus!',
          'Data berhasil dihapus.',
          'success'
        );
      } catch (error) {
        console.error('Error deleting item:', error);
        Swal.fire(
          'Gagal!',
          'Terjadi kesalahan saat menghapus data.',
          'error'
        );
      }
    }
  });
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
      // QtyUpd: item.QtyUpdate || 0,
      // Remain: item.RemainQty || 0,
      OrderDate: item.OrderDate || "",
      DefPic: item.DefPic || "",
      NoGI: item.NoGI || "",
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
    saveAsExcelFile(excelBuffer, `Data_Defisit_${formattedDate}`);
  });
};

// ✅ Fungsi untuk menyimpan file
const saveAsExcelFile = (buffer, fileName) => {
  import("file-saver").then((FileSaver) => {
    const data = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    FileSaver.saveAs(data, `${fileName}.xlsx`);
  });
};


const optionsMaterial = inventory.map((i) => ({
  value: i.id,
  label: i.Material.materialNo,
}));
const optionsDescription = inventory.map((i) => ({
  value: i.id,
  label: i.Material.description,
}));

const handleMaterialNoChange = (inputValue) => {
  if (!inputValue) {
    setSelectedMaterialNo(null);
    setSelectedDescription(null);
    setSelectedMrp(null);
    setSelectedAddress(null);
    setBaseUom(null);
    return;
  }

  // Cek apakah input sudah ada dalam inventory
  const selectedItem = inventory.find((item) => item.Material.materialNo === inputValue.label);

  if (selectedItem) {
    // Jika ada, set data berdasarkan item yang ditemukan
    setSelectedMaterialNo(inputValue);
    setSelectedDescription({ value: selectedItem.id, label: selectedItem.Material.description });
    setSelectedMrp({ value: selectedItem.id, label: selectedItem.Material.mrpType });
    setSelectedAddress({ value: selectedItem.id, label: selectedItem.Address_Rack.addressRackName });
    setBaseUom(selectedItem.Material.uom);
  } else {
    // Jika tidak ada, simpan input baru sebagai opsi baru
    setSelectedMaterialNo({ value: inputValue.label, label: inputValue.label });
    setSelectedDescription(null);
    setSelectedMrp(null);
    setSelectedAddress(null);
    setBaseUom(null);
  }
};
const handleDescriptionChange = (selectedDescription, actionMeta) => {
  if (actionMeta.action === "create-option") {
    // Jika input manual, simpan nilai input sebagai selectedDescription
    setSelectedDescription({ value: selectedDescription.label, label: selectedDescription.label });
  } else if (selectedDescription) {
    // Jika memilih dari dropdown, cari item di inventory
    const selectedItem = inventory.find((item) => item.id === selectedDescription.value);

    if (selectedItem) {
      setSelectedDescription(selectedDescription);
      setSelectedMaterialNo({ value: selectedItem.id, label: selectedItem.Material.materialNo });
      setSelectedAddress({
        value: selectedItem.id,
        label: selectedItem.Address_Rack.addressRackName,
      });
      setSelectedMrp({ value: selectedItem.id, label: selectedItem.Material.mrpType });
      setConversionUom(selectedItem.Material.Packaging?.packaging);
      setConversionRate(selectedItem.Material.Packaging?.unitPackaging);
      setBaseUom(selectedItem.Material.uom);
    }
  } else {
    // Jika input dikosongkan
    setSelectedMaterialNo(null);
    setSelectedDescription(null);
    setSelectedMrp(null);
    setSelectedAddress(null);
  }
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
  const customStylesnotborder = {
    container: (provided) => ({
      ...provided,
      width: "100%", // Pastikan Select tetap 100% lebarnya
    }),
    control: (provided, state) => ({
      ...provided,
      width: "100%", // Memastikan width tetap penuh
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 99999,
      position: "absolute",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 99999,
      position: "absolute",
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
          await updateInputDefisit(Number(newData.id), { QtyReq: Number(newData.QtyReq) || 0 });
      } else {
          await postInputDefisit({ QtyReq: Number(newData.QtyReq) || 0 });
      }
  } catch (error) {
      console.error('Error updating or adding data:', error);
  }
};


const actionBodyTemplate = (rowData) => {
    return (
<Button 
  className="p-button-danger p-button-text" 
  onClick={() => handleDelete(rowData.id)}
>
  <FaTrash size={14} color="red" />
</Button>
    );
};
const handleHeaderText = (e) => {
  const value = e.target.value; // Extract the value from the event
  setHeadtext(value); // Set the value as state
};

const handleQtyChange = (e) => {
  const value = e.target.value; // Extract the value from the event
  setQtyRec(value); // Set the value as state
};
const handleCostCenter = (e) => {
  const value = e.target.value; // Extract the value from the event
  setCostcenter(value); // Set the value as state
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
      await updateInputDefisit(Number(itemId), updatedItem);
    } else {
      await postInputDefisit(updatedItem);
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

const actionBodyTemplateRec = (rowData) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {isEditable === rowData.id ? (
        <>
          <input
            type="number"
            value={qtyRecValues[rowData.id] ?? ""} // Ambil nilai dari state
            onChange={(e) => handleQtyUpdate(e, rowData.id)}
            onKeyDown={(e) => handleKeyPress(e, rowData.id)}
            style={{
              width: "40px",
              padding: "3px",
              textAlign: "center",
              border: "1px solid gray",
              borderRadius: "4px",
            }}
            autoFocus
          />
          <FaCheck
            style={{ color: "green", cursor: "pointer", marginLeft: "8px" }}
            onClick={() => handleSubmitQty(rowData.id)}
          />
        </>
      ) : (
        <>
          <div
            style={{
              padding: "3px 10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: "#fff",
              minWidth: "50px",
              textAlign: "center",
            }}
          >
            <span>{rowData.QtyReq}</span>
          </div>
          <FaPencilAlt
            style={{ color: "gray", cursor: "pointer", marginLeft: "8px" }}
            onClick={() => handleEditClick(rowData.id, rowData.QtyReq)}
          />
        </>
      )}
    </div>
  );
};


const handleRemarkChange = (id, value) => {
  setItems((prevItems) =>
    prevItems.map((item) =>
      item.id === id ? { ...item, NoGI: value } : item
    )
  );
};

const handleSubmitRemark = async (rowData) => {
  const updatedData = { ...rowData };

  try {
    await updateInputDefisit(rowData.id, updatedData);
    console.log("Remark updated:", updatedData);

    // **Update state setelah berhasil submit**
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === rowData.id ? { ...item, Remark: updatedData.Remark } : item
      )
    );
  } catch (error) {
    console.error("Error updating remark: ", error);
  }
};



const handleDateChangeTabel = (e) => {
  setSelectedDate(e.value);

  if (Array.isArray(e.value)) {
    if (e.value.length === 2) {
      // Jika memilih rentang (dua tanggal)
      const [startDate, endDate] = e.value.map(date => format(date, 'yyyy-MM-dd'));

      setFilters({
        ...filters,
        InputDate: { value: [startDate, endDate], matchMode: 'between' } // Mode "between"
      });
    } else if (e.value.length === 1) {
      // Jika hanya memilih satu tanggal
      const selectedDate = format(e.value[0], 'yyyy-MM-dd');

      setFilters({
        ...filters,
        InputDate: { value: selectedDate, matchMode: 'equals' } // Mode "equals" untuk satu tanggal
      });
    }
  } else {
    // Jika tidak ada tanggal yang dipilih, reset filter
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
const handleInputDate = (date, rowData) => {
  setItems((prevItems) =>
    prevItems.map((item) =>
      item.id === rowData.id 
        ? { ...item, InputDate: date } // Perbarui state lokal
        : item
    )
  );
};

const handleSubmitInputDate = async (rowData) => {
  if (!rowData.InputDate) return; // Cegah update jika InputDate kosong

  const updatedData = { 
    InputDate: rowData.InputDate 
  };

  try {
    await updateInputDefisit(rowData.id, updatedData);

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === rowData.id
          ? { ...item, InputDate: rowData.InputDate }
          : item
      )
    );

    // Tampilkan toast sukses
    addToast("Success, Updated GI Date", "success", "info");
  } catch (error) {
    console.error("Error updating GI Date: ", error);
  }
};


const handleDateOrder = (date, rowData) => {
  setItems((prevItems) =>
    prevItems.map((item) =>
      item.id === rowData.id 
        ? { ...item, OrderDate: date, DefPic: name } // Saat OrderDate diisi, DefPic otomatis terisi
        : item
    )
  );
};


const handleSubmitDateOrder = async (rowData) => {
  if (!rowData.OrderDate) return; // Pastikan OrderDate tidak kosong

  const updatedData = { 
    ...rowData, 
    OrderDate: rowData.OrderDate,
    DefPic: name // Pastikan DefPic juga dikirim
  };

  try {
    await updateInputDefisit(rowData.id, updatedData);
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === rowData.id 
          ? { ...item, OrderDate: rowData.OrderDate, DefPic: name} 
          : item
      )
    );
     // Tampilkan toast
     addToast("Success ,Updated Defisit Input", "success", "info");
  } catch (error) {
    console.error("Error updating Order Date & Def PIC: ", error);
  }
};
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

const onColumnToggle = (event) => {
  let selectedColumns = event.value
  let orderedSelectedColumns = columns.filter((col) =>
    selectedColumns.some((sCol) => sCol.field === col.field),
  )
  setVisibleColumns(orderedSelectedColumns)
}

  return (
    <CRow>
      <CCol>
        {isFormVisible && (
          <CCard>
            <CCardHeader className="fw-bold fs-6 fst-italic">
               <div className="d-flex  justify-content-between align-items-center">
              <div className='d-flex align-items-center'>
                <span className='me-2'> Form Input </span>
                <p className="mb-0" style={{ color: "Orange" }} >Defisit</p>
              </div>
              <label className='me-2 mb-0'
              style={{ cursor: 'pointer' ,color:isFormVisible ? 'black' : 'blue'}}
              onClick={() => setIsFormVisible((prev) => !prev)}
              >
              {isFormVisible ? 'Hide' : 'Show'}
              </label>
            </div>
              </CCardHeader>
              <CForm>
                <CCardBody>
                  <CRow className="mt-1">
                    <CCol xs={12} sm={6} md={3} xl={3}>
                      <CFormLabel htmlFor="materialNo" style={{ fontSize: '13px', }}>
                      Material No
                      </CFormLabel>
                      <CInputGroup className="flex-nowrap" style={{ width: '100%' }}>
                        <CreatableSelect
                          className="basic-single"
                          classNamePrefix="select"
                          isLoading={isLoading}
                          options={optionsMaterial}
                          isClearable={isClearable}
                          id="materialNo"
                          onChange={handleMaterialNoChange}
                          value={selectedMaterialNo}
                          styles={customStyles}
                          placeholder="Input Material No"
                          isValidNewOption={(inputValue, selectValue, selectOptions) =>
                            !selectOptions.some((option) => option.label === inputValue)
                          }
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol xs={12} sm={6} md={4} xl={5} >
                      <CFormLabel htmlFor="description" style={{ fontSize: '13px' }}>
                      Description
                      </CFormLabel>
                        <CreatableSelect
                        className="basic-single"
                        classNamePrefix="select"
                        isLoading={isLoading}
                        options={optionsDescription}
                        isClearable={isClearable}
                        id="materialNo"
                        onChange={handleDescriptionChange}
                        value={selectedDescription}
                        styles={customStylesnotborder}
                        placeholder="Please select Material No first"
                        isValidNewOption={(inputValue, selectValue, selectOptions) =>
                        !selectOptions.some((option) => option.label === inputValue)}
                        /> 
                    </CCol>
                    <CCol xs={12} sm={6} md={3} xl={2} >
                      <CFormLabel htmlFor="address" style={{ fontSize: '13px' }}>Address</CFormLabel>
                        <CFormInput
                          type="text"
                          id="address"
                          placeholder="Select Material.."
                          value={selectedAddress ? selectedAddress.label : ""}
                          onChange={(e) => setSelectedAddress({ value: e.target.value, label: e.target.value })}
                          disabled={true}
                        />
                    </CCol>
                    <CCol xs={12} sm={6} md={2} xl={2} >
                      <CFormLabel htmlFor="mrp" style={{ fontSize: '13px' }}>MRP</CFormLabel>
                        <CFormInput
                          type="text"
                          id="mrp"
                          placeholder="Select Material.."
                          value={selectedMrp ? selectedMrp.label : ""}
                          onChange={(e) => setSelectedMrp({ value: e.target.value, label: e.target.value })}
                          disabled={true}
                        />
                    </CCol>
                  </CRow>
                  <hr className='my-2'/>
                  <CRow>
                    <CCol xs={12} sm={3} md={2} xl={2}  >
                      <label style={{ fontSize: '13px' }}>Card No</label>
                      <div className="d-flex gap-3 align-items-center mt-2">
                        <CFormCheck
                          type="radio"
                          id="payment1"
                          label="GIC"
                          checked={!isWbs}
                          onChange={() => setIsWbs(false)}
                          disabled={!selectedMaterialNo} // Perbaikan: Gunakan `disabled`
                        />
                        <CFormCheck
                          type="radio"
                          id="payment2"
                          label="WBS"
                          checked={isWbs}
                          onChange={() => setIsWbs(true)}
                          disabled={!selectedMaterialNo} // Perbaikan: Gunakan `disabled`
                        />
                      </div>
                    </CCol>
                    <CCol xs={12} sm={9} md={6} xl={4}  className="mt-1">
                      <CFormLabel htmlFor="cardNo" style={{ fontSize: '13px' }}>
                        ID Card
                      </CFormLabel>
                      <CInputGroup className="flex-nowrap" style={{ width: '100%' }}>
                        <CreatableSelect
                          className="basic-single"
                          classNamePrefix="select"
                          isLoading={isLoading}
                          options={cardOptions}
                          isClearable={isClearable}
                          isDisabled={!selectedMaterialNo}
                          id="materialNo"
                          onChange={(selected) => {
                            setSelectedCard(selected);
                            setSelectedSection(selected ? selected.sectionName : ""); // Pastikan sectionName muncul di input Section
                          }}
                          value={selectedCard}
                          styles={customStylesnotborder}
                          placeholder="Please Select Card No"
                          isValidNewOption={(inputValue, selectValue, selectOptions) =>
                            !selectOptions.some((option) => option.label === inputValue)
                          }
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol xs={12} sm={6} md={5} xl={3}  className="mt-1">
                      <CFormLabel htmlFor="cc" style={{ fontSize: '13px' }}>
                        Cost Center
                      </CFormLabel>
                      <CInputGroup className="flex-nowrap" style={{ width: '100%' }}>
                      <CFormInput
                        type="text"
                        id="cc"
                        placeholder="Select ID"
                        value={costcenter}
                        onChange={handleCostCenter} 
                        disabled={!selectedMaterialNo}
                      />
                      </CInputGroup>
                    </CCol>
                    <CCol xs={12} sm={6} md={5} xl={3}  className="mt-1">
                      <CFormLabel htmlFor="section" style={{ fontSize: '13px' }}>
                        Section
                      </CFormLabel>
                      <CInputGroup className="flex-nowrap" style={{ width: '100%' }}>
                      <CFormInput
                        type="text"
                        id="section"
                        placeholder="Select Material.."
                        value={selectedSection}
                        disabled={!selectedMaterialNo}
                      />
                      </CInputGroup>
                    </CCol>
                  </CRow> 
                  <hr className='my-2' /> 
                  <CRow>
                    <CCol xs={12} sm={6} md={6} xl={2}  className="mt-1">
                      <CFormLabel htmlFor="pic" style={{ fontSize: '13px' }}>
                        PIC
                      </CFormLabel>
                      <CInputGroup className="flex-nowrap" style={{ width: '100%' }}>
                        <Select
                            className="basic-single"
                            placeholder="Select PIC.."
                            options={picOptions}
                            id="pic"
                            value={selectedPic}
                            isDisabled={!selectedMaterialNo}
                            onChange={handlePicChange} // Panggil fungsi yang sudah kita buat
                            styles={{
                              container: (provided) => ({ ...provided, width: '100%' }),
                              menuPortal: (base) => ({ ...base, zIndex: 99999, position: "absolute" }),
                              menu: (base) => ({ ...base, zIndex: 99999, position: "absolute" }),
                            }}
                          />
                      </CInputGroup>
                    </CCol>
                    <CCol xs={12} sm={6} md={6} xl={2}  className="mt-1">
                      <CFormLabel htmlFor="shift" style={{ fontSize: '13px' }}>
                        Shift
                      </CFormLabel>
                      <CInputGroup className="flex-nowrap" style={{ width: '100%' }}>
                        <Select
                          className="basic-single"
                          placeholder="Select PIC.."
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
                    <CCol xs={12} sm={6} md={3} xl={2} className="mt-1">
                      <CFormLabel htmlFor="qty" style={{ fontSize: '13px' }}>
                      {`Quantity Good Issue (${baseUom})`}
                      </CFormLabel>
                      <CFormInput
                        type="number"
                        placeholder="Input Qty.."
                        text="Must be number."
                        aria-describedby="quantity"
                        required
                        inputMode="numeric"
                        value={qtyRec}
                        onChange={handleQtyChange} 
                        autoComplete="off"
                        disabled={!selectedMaterialNo}
                        min="0" // Mencegah angka negatif
                      />
                    </CCol>
                    <CCol xs={12} sm={6} md={3} xl={2} className="mt-1">
                      <CFormLabel htmlFor="qty" style={{ fontSize: '13px' }}>
                      Header Text
                      </CFormLabel>
                      <CFormInput
                        type="text"
                        placeholder="Input Please"
                        text="Must be number."
                        required
                        inputMode="numeric"
                        value={headtext}
                        onChange={handleHeaderText} 
                        autoComplete="off"
                        disabled={!selectedMaterialNo}
                        min="0" // Mencegah angka negatif
                      />
                    </CCol>
                    <CCol xs={12} sm={6} md={3} xl={3}
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
            <CCardHeader className="fw-bold fs-6 fst-italic">Table Defisit</CCardHeader>
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
                      {/* <Button
                        type="button"
                        label="Upload"
                        icon="pi pi-file-import"
                        severity="primary"
                        className="rounded-5 me-2 mb-2"
                        onClick={showModalUpload}
                        data-pr-tooltip="XLS"
                      /> */}
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
              <CRow>
                <span className='fw-bold fs-6 fst-italic'>
                 Total Defisit: {totalDefisit !== null ? `${totalDefisit} item` : "Loading..."}
               </span>     
              </CRow>
              <CRow className="mt-3">
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
                        columnResizeMode="expand"
                
                    >
                        <Column
                        className=""
                        header="No"
                        body={(rowData, { rowIndex }) => items.length - rowIndex}>
                      </Column>

                        <Column
                          field="InputDate"
                          header="GI Date"
                          body={(rowData) => (
                            <input
                              type="date"
                              value={rowData.InputDate || ""}
                              onChange={(e) => handleInputDate(e.target.value, rowData)}
                              onBlur={() => handleSubmitInputDate(rowData)} // Update ke database saat blur
                              style={{ flexGrow: 1, border: "none", outline: "none" }}
                              disabled={!(roleName === "group head" || roleName === "super admin")}
                            />
                          )}
                        />
                      <Column 
                      field="ShiftId" 
                      header="Shift" 
                      sortable
                        frozen alignFrozen="left"
                      
                      body={(rowData) => (
                        <span>
                          {shiftOptions.find(shift => shift.value === rowData.ShiftId)?.label.charAt(0) || ""}
                        </span>
                      )} 
                    />
                      <Column field="MaterialNo" 
                      header="Material No" 
                      style={{ whiteSpace: 'nowrap', minWidth: '85px' }}
                      />
                      <Column field="Description" header="Description" 
                      style={{ whiteSpace: 'nowrap'}}/>
                    {/* <Column 
                        field="Pic" 
                        header="PIC"  
                        style={{ whiteSpace: 'nowrap' }} 
                        body={(rowData) => (
                          <span>
                          {picOptions?.find(pic => pic.value === rowData.PicId)?.label || ""}
                        </span>                         
                        )} 
                      /> */}
                      <Column field="Address" header="Address" />
                      <Column 
                          field="CardNo" 
                          header="Card No" 
                          body={(rowData) => (
                            <span 
                              style={{ 
                                cursor: "pointer" 
                              }} 
                              onClick={() => handleCardClick(rowData)}
                            >
                              {rowData.CardNo}
                            </span>
                          )} 
                        />
                        <Column 
                        field="CostCenter" 
                        header="Cost Center"
                      />
                      <Column 
                        field="Uom" 
                        header="UoM" 
                      />
                      <Column body={actionBodyTemplateRec} 
                      field="QtyReq" 
                      header="Qty GI"
                        />
                    <Column
                    field="NoGI"
                    header="Header Text"
                    body={(rowData) => (
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
                  {(roleName === "group head" || roleName === "super admin") ? (
                    <>
                      <input 
                        type="text" 
                        value={rowData.NoGI || ""} 
                        onChange={(e) => handleRemarkChange(rowData.id, e.target.value)}
                        onBlur={() => handleSubmitRemark(rowData)} // Update ke database saat blur
                        style={{ 
                          flexGrow: 1, 
                          border: "none", 
                          outline: "none", 
                          maxWidth: "90px", 
                          overflow: "hidden",
                          background: "transparent" 
                        }} 
                      />
                    
                    </>
                  ) : (
                    <span 
                      style={{ 
                        flexGrow: 1, 
                        color: rowData.NoGI && rowData.NoGI.trim() ? "black" : "gray", 
                        maxWidth: "130px", 
                        whiteSpace: "nowrap", 
                        overflow: "hidden", 
                        textOverflow: "ellipsis"
                      }}
                      title={rowData.NoGI} 
                    >
                        {rowData.NoGI && rowData.NoGI.trim() ? rowData.NoGI : "...."}
                      </span>
                    )}
                     </div>
                    )}
                    />
                    <Column 
                        field="OrderDate" 
                        header="GI Input"
                        body={(rowData) => (
                          <input
                            type="date"
                            value={rowData.OrderDate || ""}
                            onChange={(e) => handleDateOrder(e.target.value, rowData)}
                            onFocus={() => setEditingDateId(rowData.id)}
                            onBlur={() => setTimeout(() => setEditingDateId(null), 200)}
                            placeholder="Silakan isi"
                            style={{ flexGrow: 1, border: "none", outline: "none" }}
                            disabled={!(roleName === "group head" || roleName === "super admin")}
                          />
                        )}
                      />
                <Column 
                  field="DefPic" 
                  header="PIC GI"
                  className="highlight-border"
                  body={(rowData) => (
                    <div 
                      style={{ 
                        padding: "5px", 
                        background: "#f9f9f9", 
                        borderRadius: "4px",
                        textAlign: "center"
                      }}
                    >
                      {rowData.DefPic || ""} 
                    </div>
                  )}
                />
    
              
             <Column 
              header="Action"
              body={(rowData) => {
                const isDisabled = !rowData.OrderDate || !rowData.DefPic; // Cek apakah OrderDate & DefPic sudah diisi

                return (
                  <button 
                    onClick={() => !isDisabled && handleSubmitDateOrder(rowData)} // Hanya bisa diklik jika tidak disabled
                    style={{ 
                      background: "none", 
                      border: "none", 
                      cursor: isDisabled ? "not-allowed" : "pointer" // Ubah cursor sesuai status
                        }}
                        disabled={isDisabled} // Nonaktifkan tombol jika belum lengkap
                      >
                        <FontAwesomeIcon 
                          icon={faCheck} 
                          style={{ color: isDisabled ? "gray" : "green" }} // Warna abu-abu jika belum lengkap
                        />
                      </button>
                      );
                    }}
                  />
                  <Column 
                  header="Status"
                  className="highlight-border"
                  body={(rowData) => {
                    const isCompleted = rowData.OrderDate && rowData.DefPic; // Cek apakah OrderDate & DefPic sudah diisi
                    return (
                      <FontAwesomeIcon 
                        icon={isCompleted ? faCircleCheck : faTimesCircle} 
                        style={{ color: isCompleted ? "green" : "red", fontSize: "18px" }} 
                      />
                    );
                  }}
                />
                 <Column 
                    body={actionBodyTemplate} 
                    header="Delete" 
                    frozen alignFrozen="right"
                    align="center" 
                    style={{ minWidth: '60px' }} 
                  />
                  {visibleColumns.map((col, index) => (
                  <Column
                    key={index}
                    field={col.field}
                    header={col.header}
                    body={col.body}
                    sortable={col.sortable}
                    headerStyle={col.headerStyle}
                    bodyStyle={col.bodyStyle}
                  />
                ))}
                  </DataTable>
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
