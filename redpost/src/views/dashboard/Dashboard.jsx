import React, { useState, useEffect, useRef,useCallback, Suspense,useMemo } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LineElement,
  PointElement,
  LinearScale,
  BarElement,
} from 'chart.js' // Import CategoryScale and BarElement
import { format } from "date-fns";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import Select from 'react-select'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CCardText,
  CCol,
  CRow,
  CInputGroup,
  CInputGroupText,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCalendar } from '@coreui/icons'
import useInputService from '../../services/InputDataService'
import useDashboardService from '../../services/DashboardService'
// Daftarkan elemen Chart.js yang diperlukan
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LineElement,
  PointElement,
  LinearScale,
  BarElement,
  ChartDataLabels,
) // Register CategoryScale and BarElement



const Dashboard = () => {
  const datePickerRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const startIndex = (currentPage - 1) * itemsPerPage
  const [mrpOptions, setMrpOptions] = useState([]);
  const [selectedMrp, setSelectedMrp] = useState(null);
  const [combGraphData, setCombGraphData] = useState(null);
  const {getInput} = useInputService()
  const { getCardData,getCombGraph,getLineGraph,getDoughnutGraph,getShiftGraph,} = useDashboardService()
  const [tableData, setTableData] = useState([]); // 🔹 State untuk tabel
  const [filteredData, setFilteredData] = useState([]); // 🔹 Data setelah filter
  const [items, setItems] = useState([]) // State untuk menyimpan item yang ditambahkan
  const [combGraph, setCombGraph] = useState();
  const [lineGraph, setLineGraph] = useState({
    labels: [],
    datasets: [],
  });
  const [shiftGraph, setShiftGraph] = useState({
    labels: [],
    datasets: [],
  });

  const [cardData, setCardData] = useState(null);
  const [doughnutGraph, setDoughnutGraph] = useState({
    labels: [],
    datasets: [],
  });
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);

  // Ambil tanggal besok
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Set date range awal
  const [dateRange, setDateRange] = useState([firstDayOfMonth, tomorrow]);

  const fetchData = async () => {
    try {
      const response = await getInput();
      if (!response || !Array.isArray(response.data)) { // ✅ Cek response.data
        console.error("Invalid API response:", response);
        return;
      }
  
      setTableData(response.data); // ✅ Gunakan response.data sebagai array
      setFilteredData(response.data); // ✅ Set default data ke tabel
  
      // 🔹 Ambil daftar unik MRP
      const uniqueMrp = [...new Set(response.data.map((item) => item.Mrp))];
  
      // 🔹 Format agar cocok dengan react-select
      const formattedOptions = [{ value: "", label: "All" }, ...uniqueMrp.map((mrp) => ({
        value: mrp,
        label: mrp,
      }))];
  
      setMrpOptions(formattedOptions);
    setSelectedMrp({ value: "", label: "All" }); // ✅ Set default ke "All"
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
  

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Filter data berdasarkan MRP setiap kali pilihan berubah
  useEffect(() => {
    if (!selectedMrp) {
      setFilteredData(tableData); // Jika tidak ada filter, tampilkan semua data
    } else {
      const filtered = tableData.filter((item) =>
        selectedMrp?.value ? item.Mrp === selectedMrp.value : true
      );
      setFilteredData(filtered);
    }
  }, [selectedMrp, tableData]);

  const currentPageData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setFocus();
    }
  };
  console.log("Updated Card Data:", cardData); // 🔍 Debug setelah set state
  const fetchCardData = async () => {
    try {
      const [startDate, endDate] = dateRange; // ✅ Ambil start & end dari array
      if (!startDate || !endDate) return; // Cegah API call jika tanggal tidak lengkap
      
      const data = await getCardData(startDate, endDate);
      if (!data) {
        console.error("Invalid API response:", data);
        return;
      }
      console.log("Fetched Card Data:", data);
      setCardData(data);
    } catch (error) {
      console.error("Error fetching card data:", error);
    }
};
useEffect(() => {
  if (dateRange[0] && dateRange[1]) {
    const startDate = format(dateRange[0], "yyyy-MM-dd");
    const endDate = format(dateRange[1], "yyyy-MM-dd");
    fetchCardData(startDate, endDate);
  }
}, [dateRange]);



  //untuk card data 

  const fetchCombGraph = async () => {
    try {
      const [startDate, endDate] = dateRange;
      if (!startDate || !endDate) return; // Cegah API call jika tanggal tidak lengkap
  
      const response = await getCombGraph(startDate, endDate);
      if (!response || !response.data) {
        console.error("Invalid API response:", response);
        return;
      }
  
      const { inputRedPostCounts } = response.data;
  
      // **Transform Data**
      const labels = inputRedPostCounts.map((item) => item.MaterialNo);
      const barData = inputRedPostCounts.map((item) => item.redPostCount);
  
      // **Update State dengan Data Chart.js**
      setCombGraphData({
        labels,
        datasets: [
          {
            type: "bar",
            label: "Red Post Count",
            data: barData,
            backgroundColor: barData.map((_, index) =>
              index % 2 === 0 ? "#BCCCDC" : "#9AA6B2"
            ), // 🔹 Selang-seling abu-abu dan hijau
            borderColor: barData.map((_, index) =>
              index % 2 === 0 ? "#BCCCDC" : "#9AA6B2"
            ),
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching combination graph data:", error);
    }
  };
  
  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      const startDate = format(dateRange[0], "yyyy-MM-dd");
      const endDate = format(dateRange[1], "yyyy-MM-dd");
      fetchCombGraph(startDate, endDate);
    }
  }, [dateRange]);
  
  const combinedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // 🔹 Sembunyikan legend
        position: "top", // Legend di bagian atas
        align: "end", // Legend sejajar ke kanan
        labels: {
          font: {
            size: 8,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
      datalabels: { // Menampilkan label data di atas batang
        color: "black", // Warna teks putih
        anchor: "end", // Letakkan di atas
        align: "bottom",
        font: {
          weight: "bold",
          size: 14,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
            display: true,
            text: "Description",
            font: {
                size: 10
            }
        },
        ticks: {
          font: {
            size: 9, // Ukuran font label di sumbu X lebih kecil
          },
          callback: function (value, index, ticks) {
            const item = shiftGraph.labels[index]; // Ambil data berdasarkan index
        
            if (!item || typeof item !== "string") return ""; // Pastikan item valid
        
            const descSubstring = item.length > 19 ? item.substring(0, 18) + "..." : item; // Batasi panjang
            return descSubstring.split(" "); // Wrap text jika ada spasi
          },
        },
    }, 
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Material Count",
          font: {
            size: 10,
          },
        },
      },
    },
  };
  



const fetchLineGraph = async () => {
  try {
    const [startDate, endDate] = dateRange;
    if (!startDate || !endDate) return; // Cegah API call jika tanggal tidak lengkap

    const formattedStartDate = format(new Date(startDate), "yyyy-MM-dd");
    const formattedEndDate = format(new Date(endDate), "yyyy-MM-dd");

    const response = await getLineGraph(formattedStartDate, formattedEndDate);
    if (!response || !response.data) {
      console.error("Invalid API response:", response);
      return;
    }

    const { data } = response; // Sesuai dengan struktur response

    // **Transform Data**
    const labels = data.map((item) => item.date);
    const lineData = data.map((item) => item.materialCount);

    // **Update State dengan Data Chart.js**
    setLineGraph({
      labels,
      datasets: [
        {
          type: "line",
          label: "Freq.Red Post",
          data: lineData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
          fill: false,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching line graph data:", error);
  }
};

useEffect(() => {
  if (dateRange[0] && dateRange[1]) {
    fetchLineGraph();
  }
}, [dateRange]);

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top", // Legend di bagian atas
      align: "start", // Legend sejajar ke kiri
      labels: {
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      enabled: true,
    },
    datalabels: {
      color: '#000',
      align: 'top',
      anchor: 'center',
      font: {
        size: 12,
        weight: 'bold',
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Date', // Sesuaikan dengan data tanggal dari API
        font: {
          size: 10,
        },
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Frequency', // Jumlah Material Red Post
        font: {
          size: 10,
        },
      },
    },
  },
  elements: {
    line: {
      tension: 0.4, // Membuat garis lebih halus
    },
    point: {
      radius: 5,
      hoverRadius: 7,
    },
  },
};


console.log("Updated Doughnut Data:", doughnutGraph); // 🔍 Debug setelah set state
const fetchDoughnutGraph = async () => {
  try {
    if (!dateRange[0] || !dateRange[1]) return; // Pastikan tanggal terisi sebelum fetch data

    const formattedStartDate = format(new Date(dateRange[0]), "yyyy-MM-dd");
    const formattedEndDate = format(new Date(dateRange[1]), "yyyy-MM-dd");

    console.log(`Fetching doughnut chart data from ${formattedStartDate} to ${formattedEndDate}`);

    const response = await getDoughnutGraph(formattedStartDate, formattedEndDate);
    
    // ✅ Perbaikan: Ambil data dari response.data
    if (!response || !response.data || !Array.isArray(response.data)) {
      console.error("Invalid API response:", response);
      return;
    }

    console.log("Fetched Doughnut Chart Data:", response.data); // Debug hasil API

    // **Map data dengan label "Red" dan "White" sesuai ShiftId**
    const labels = ["Red", "White"];
    const data = [0, 0]; // Default jika tidak ada nilai

    response.data.forEach((item) => {
      if (item.ShiftId === 1) {
        data[0] = item.count; // Red
      } else if (item.ShiftId === 2) {
        data[1] = item.count; // White
      }
    });

    setDoughnutGraph({
      labels,
      datasets: [
        {
          label: "Material By Shift",
          data,
          backgroundColor: ["#C63C51", "#C4E4FF"], // Warna Shift 1 dan Shift 2
          borderColor: ["#CC0000", "#DDDDDD"],
          borderWidth: 1,
        },
      ],
    });

  } catch (error) {
    console.error("Error fetching doughnut chart data:", error);
  }
};

// Fetch data saat `dateRange` berubah
useEffect(() => {
  if (dateRange[0] && dateRange[1]) {
    fetchDoughnutGraph();
  }
}, [dateRange]);

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 15,
      },
    },
    datalabels: {
      display: true,
      color: "black",
      font: {
        size: 14,
        weight: "bold",
      },
      formatter: (value) => value,
      anchor: "center",
      align: "center",
      backgroundColor: "white",
      borderRadius: 4,
      padding: 6,
    },
  },
  cutout: "50%", // Ukuran lubang tengah
};


console.log("Updated Shift Data:", shiftGraph); // 🔍 Debug setelah set state
const fetchShiftGraph = async () => {
  try {
    if (!dateRange[0] || !dateRange[1]) return; // Pastikan tanggal dipilih sebelum fetch data

    const formattedStartDate = format(new Date(dateRange[0]), "yyyy-MM-dd");
    const formattedEndDate = format(new Date(dateRange[1]), "yyyy-MM-dd");

    console.log(`Fetching shift graph data from ${formattedStartDate} to ${formattedEndDate}`);

    const response = await getShiftGraph(formattedStartDate, formattedEndDate);

    if (!response || !response.data || !Array.isArray(response.data)) {
      console.error("Invalid API response:", response);
      return;
    }

    console.log("Fetched Shift Graph Data:", response.data); // Debug hasil API

    // **Transform Data**
    const materialMap = new Map();

    response.data.forEach((item) => {
      const { Description, ShiftId, shiftCount } = item;
      if (!materialMap.has(Description)) {
        materialMap.set(Description, { White: 0, Red: 0 });
      }

      if (ShiftId === 1) {
        materialMap.get(Description).Red = shiftCount; // Shift 1 = Red
      } else if (ShiftId === 2) {
        materialMap.get(Description).White = shiftCount; // Shift 2 = White
      }
    });

    const labels = Array.from(materialMap.keys()); // Ambil semua MaterialNo
    const redData = labels.map((material) => materialMap.get(material).Red);
    const whiteData = labels.map((material) => materialMap.get(material).White);

    setShiftGraph({
      labels,
      datasets: [
        {
          label: "White",
          data: whiteData,
          backgroundColor: "#C4E4FF",
          borderColor: "#C4E4FF",
          borderWidth: 1,
        },
        {
          label: "Red",
          data: redData,
          backgroundColor: "#C63C51",
          borderColor: "#C63C51",
          borderWidth: 1,
        },
      ],
    });

  } catch (error) {
    console.error("Error fetching shift graph data:", error);
  }
};

// Fetch data saat `dateRange` berubah
useEffect(() => {
  if (dateRange[0] && dateRange[1]) {
    fetchShiftGraph();
  }
}, [dateRange]);

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Posisi legenda
      },
      tooltip: {
        enabled: true, // Tooltip aktif
      },
      datalabels: {
        color: '#000', // Warna teks
        backgroundColor: 'white', // Latar belakang putih
        borderRadius: 2, // Radius sudut latar
        padding: 1, // Padding di sekitar angka
        font: {
          size: 12, // Ukuran font
          weight: 'bold',
        },
        anchor: 'end', // Menempatkan label di ujung bar
        align: 'start', // Menempatkan label tepat di atas bar
        offset: -20, // Mengatur jarak label dari ujung bar
      },
    },

    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Description', // Keterangan sumbu X
          font: {
            size: 10, // Ukuran font judul sumbu X
          },
        },
        ticks: {
          font: {
            size: 8, // Ukuran font label di sumbu X lebih kecil
          },
          callback: function (value, index, ticks) {
            const item = shiftGraph.labels[index]; // Ambil data berdasarkan index
        
            if (!item || typeof item !== "string") return ""; // Pastikan item valid
        
            const descSubstring = item.length > 19 ? item.substring(0, 16) + "..." : item; // Batasi panjang
            return descSubstring.split(" "); // Wrap text jika ada spasi
          },
        },
        
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Frequency', // Keterangan sumbu Y
          font: {
            size: 10,
          },
        },
      },
    },
  }

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      minHeight: "28px", // Kurangi tinggi select
      height: "28px", // Pastikan tinggi tetap
      fontSize: "10px", // Perkecil teks di dalam select
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0px 6px", // Kurangi padding dalam select
    }),
    input: (base) => ({
      ...base,
      margin: "0px", // Hilangkan margin ekstra
    }),
  };

  const blinkStyle = {
    color: "red",
    animation: "blink 4s infinite"
  };


  return (
    <>
      <CCard className="mb-2"
      style={{borderBlockColor: "red",borderBlockWidth: "thick",borderBlockStyle: "solid"}}>
        <CCardBody>
          <CRow >
            <CCol sm={9}>
            <div>
              <h3 id="traffic" className="card-title" style={blinkStyle}>
                RED POST VISUALIZATION DASHBOARD
              </h3>

              <style>
                {`
                  @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                  }
                `}
              </style>
            </div>
              <div className="small text-body-secondary italic">WAREHOUSE CONSUMABLE</div>
            </CCol>
            {/* <CCol sm={3} className="d-none d-md-block">
            <label className="form-label" style={{ fontSize: "10px" }}>MRP</label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              isClearable
              options={mrpOptions}
              value={selectedMrp}
              onChange={setSelectedMrp}
              placeholder="Select MRP"
            />
          </CCol> */}
           <CCol sm={3} >
              <label htmlFor="dateRange" className="form-label" style={{ fontSize: "12px" }}>
                Date Range
              </label>
              <CInputGroup >
                <DatePicker
                  selectsRange
                  startDate={dateRange[0]}
                  endDate={dateRange[1]}
                  onChange={(update) => setDateRange(update)}
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                  placeholderText="Select a date range"
                />
              <CInputGroupText style={{ width: '40px' }} onClick={handleIconClick}>
                <CIcon icon={cilCalendar} />
              </CInputGroupText>
            </CInputGroup>
          </CCol>
          </CRow>
          <hr />
          <CRow>
            <CCol lg={2} sm={2} xs={2}>
            <CCard className="mb-1 ">
                <CCardHeader className="text-muted small text-center fw-bold">
                  Total Red Post
                </CCardHeader>
                <CCardBody className="text-center">
                  <CCardText className="fs-1 fw-bold">{cardData?.totalRedPost || "-"}</CCardText>
                </CCardBody>
              </CCard>

              <CCard className="mb-1 mt-2">
                <CCardHeader className="text-muted small text-center fw-bold">
                  SOH ＞ 0
                </CCardHeader>
                <CCardBody className="text-center">
                  <CCardText className="fs-1 fw-bold">{cardData?.totalSoh || "-"}</CCardText>
                </CCardBody>
              </CCard>
             
            </CCol>
              <CCol lg={10} sm={6} xs={12}>
              <div className="mb-2 mt-1">
                <h6>Summary Red Post By Material No</h6>
                <div style={{ width: "100%", height: "15rem" }}>
                  {combGraphData ? <Bar data={combGraphData} options={combinedOptions} /> : <p>Loading...</p>}
                </div>
              </div>
                </CCol>
              
                </CRow>
                <CRow className="align-items-center">   
                  <CCol lg={2} sm={6} xs={12} className="mb-1 mt-1">
                    <h6 className="text-center">Total Material By Shift</h6>
                    <div style={{ width: "100%", height: "12rem" }}>
                      {doughnutGraph ? (
                        <Doughnut data={doughnutGraph} options={doughnutOptions} />
                      ) : (
                        <p>Loading...</p> // Prevent render error jika data masih kosong
                      )}
                    </div>
                    </CCol>
                    <CCol lg={10} sm={6} xs={12}>
                <div className="mb-2 mt-1">
                  <h6>Summary Red Post By Date </h6>
                  <div style={{ width: '100%', height: '15rem' }}>
                    {lineGraph.labels.length > 0 ? (
                      <Bar data={lineGraph} options={lineChartOptions} />
                    ) : (
                      <p>Loading...</p> // ❗ Mencegah error dengan menunggu data
                    )}
                  </div>
                </div>
                </CCol>
                  {/* </CCol>
                    <h6>Summary Red Post Material No By Shift</h6>
                    <div style={{ width: "100%", height: "20rem" }}>
                      {shiftGraph && shiftGraph.labels && shiftGraph.labels.length > 0 ? (
                        <Bar data={shiftGraph} options={barOptions} />
                      ) : (
                        <p>Loading...</p> // ✅ Mencegah error jika shiftGraph masih kosong
                      )}
                    </div>
                  <CCol md="9" className="mb-2 mt-2"> */}
                  
                </CRow>
              <CCol xs={12}>
                {/* <hr/>
              <CRow>
                <div className="mt-3">
                  <h6>Summary Status</h6>
                  <CTable striped bordered responsive style={{ fontSize: '0.80rem' }}>
                    {' '}
                    Ukuran font lebih kecil
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Material No</CTableHeaderCell>
                        <CTableHeaderCell>MRP</CTableHeaderCell>
                        <CTableHeaderCell>Description</CTableHeaderCell>
                        <CTableHeaderCell>SOH</CTableHeaderCell>
                        <CTableHeaderCell>SOH</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {currentPageData.map((item, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{item.MaterialNo}</CTableDataCell>
                          <CTableDataCell>{item.Mrp}</CTableDataCell>
                          <CTableDataCell>{item.Description}</CTableDataCell>
                          <CTableDataCell> {item.StockDatum?.soh}</CTableDataCell>
                          <CTableDataCell> {item.StockDatum?.soh}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                  Pagination
                  <CPagination size="sm" align="center" className="mt-3">
                    <CPaginationItem
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    >
                      Previous
                    </CPaginationItem>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <CPaginationItem
                        key={index}
                        active={index + 1 === currentPage}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </CPaginationItem>
                    ))}
                    <CPaginationItem
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    >
                      Next
                    </CPaginationItem>
                  </CPagination>
                </div>
              </CRow> */}
            </CCol>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
