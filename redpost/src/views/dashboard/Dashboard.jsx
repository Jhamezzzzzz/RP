import React, { useRef, useState } from 'react'
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
  const itemsPerPage = 4
  const startIndex = (currentPage - 1) * itemsPerPage

  const doughnutData = {
    labels: ['White', 'Red'],
    datasets: [
      {
        label: 'Colors',
        data: [11, 13], // Data
        backgroundColor: ['#C4E4FF', '#C63C51'], // Warna putih dan merah
        borderColor: ['#DDDDDD', '#CC0000'], // Warna border
        borderWidth: 1, // Ketebalan border
      },
    ],
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false, // Grafik mengikuti ukuran container
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 15,
        },
      },
      datalabels: {
        display: true,
        color: 'black',
        font: {
          size: 14,
          weight: 'bold',
        },
        formatter: (value) => value,
        anchor: 'center',
        align: 'center',
        backgroundColor: 'white',
        borderRadius: 4,
        padding: 6,
      },
    },
    cutout: '50%', // Ukuran lubang tengah
  }

  const lineChartData = {
    labels: ['01-20', '01-21', '01-22', '01-23', '01-24', '01-25', '01-26'], // Labels for X axis (Material No)
    datasets: [
      {
        type: 'line',
        label: 'Frequency Material Red Post', // Dataset label
        data: [14, 15, 28, 30, 21, 44, 8], // Data for each label
        borderColor: 'rgba(75, 192, 192, 1)', // Line color
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // This will make the area below the line filled (optional)
        borderWidth: 2, // Line thickness
        fill: false, // Set to false for no area fill under the line
        pointRadius: 5, // Point size on the line chart
        pointHoverRadius: 7, // Hover effect radius
      },
    ],
  };
  
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        color: '#000', // Text color for labels
        align: 'top', // Position labels at the top of the points
        anchor: 'center',
        font: {
          size: 12,
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Material No', // X-axis title (Material No)
          font: {
            size: 10,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Frequency', // Y-axis title (Frequency)
          font: {
            size: 10,
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.4, // Smooth line curve
      },
      point: {
        radius: 5, // Point size on the line chart
        hoverRadius: 7, // Hover effect radius
      },
    },
  };
  
  
  const barData = {
    labels: ['B222', 'B233'], // X-axis labels (material numbers)
    datasets: [
      {
        label: 'White',
        data: [20, 17], // Values for White shift
        backgroundColor: '#C4E4FF', // White color
        borderColor: '#C4E4FF', // Border color for White
        borderWidth: 1,
      },
      {
        label: 'Red',
        data: [33, 65], // Values for Red shift
        backgroundColor: '#C63C51', // Red color
        borderColor: '#C63C51', // Border color for Red
        borderWidth: 1,
      },
    ],
  }

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
          text: 'Material No', // Keterangan sumbu X
          font: {
            size: 10,
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

  const combinedData = {
    labels: ['b444455', 'b333325', 'b300000', 'b300001'],
    datasets: [
      {
        type: 'bar',
        label: 'Bar Data',
        data: [20, 12, 22, 40],
        backgroundColor: '#BCCCDC',
        borderColor: '#BCCCDC',
        borderWidth: 1,
        datalabels: {
          color: '#000', // Warna teks
          align: 'center', // Posisi di ujung bar
          anchor: 'center', // Mengikuti ujung elemen bar
          backgroundColor: null, // Tidak ada latar belakang
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      {
        type: 'line',
        label: 'Line Data',
        data: [21, 31, 25, 50],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        tension: 0.1,
        datalabels: {
          color: '#000', // Warna teks
          align: 'top', // Posisi di atas garis
          anchor: 'center', // Di tengah-tengah elemen
          backgroundColor: 'white', // Latar belakang putih
          borderRadius: 4, // Radius sudut
          padding: 4, // Padding di sekitar angka
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
    ],
  }

  const combinedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Material No', // Keterangan sumbu X
          font: {
            size: 10,
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

  const tableData = [
    {
      materialNo: 'b972-301214',
      mrp: 'ROP',
      description: 'WRENCH OPEN-END STANDARD 12-14 ACESA',
      soh2: 3,
    },
    {
      materialNo: 'B972-311719',
      mrp: 'ROP',
      description: 'WRENCH CLOSE-END (OFFSET) 17-19 ACESA',
      soh2: 3,
    },
    {
      materialNo: 'b750-030154',
      mrp: 'ROP',
      description: 'WHEEL CASTOR 8" SWIV SHOCK ABSORB HAMM',
      soh2: 2,
    },
    {
      materialNo: 'b964-201003',
      mrp: 'ROP',
      description: 'VICE-GRIP 10 CR AMERICAN TOOL',
      soh2: 1,
    },
    {
      materialNo: 'b981-296212',
      mrp: 'ROP',
      description: 'VERNIER CALIPER MANUAL 100/0.001MM CANON',
      soh2: 2,
    },
    {
      materialNo: 'b836-001900',
      mrp: 'OTH',
      description: 'THINNER DUCO CHELSEA 0.8 LTR',
      soh2: 58,
    },
    {
      materialNo: 'b982-240153',
      mrp: 'ROP',
      description: 'TAPPER GAUGE 700A (0-15 MM) SHINWA',
      soh2: 4,
    },
    {
      materialNo: 'B027-122750',
      mrp: 'NQC',
      description: 'TAPE COTTON 2" WHITE SAZANAMI',
      soh2: 59,
    },
    {
      materialNo: 'b029-112011',
      mrp: 'ROP',
      description: 'TALI HELMET BP65 LOCAL',
      soh2: 8,
    },
    {
      materialNo: 'b029-392005',
      mrp: 'ROP',
      description: 'SUPPORTER BACK SIZE L 38"-47" KWN LM',
      soh2: 78,
    },
    {
      materialNo: 'B880-330700',
      mrp: 'NQC',
      description: 'SUNSPATTER RE-330M70 SUGIMURA',
      soh2: 216,
    },
  ]
  const currentPageData = tableData.slice(startIndex, startIndex + itemsPerPage)
  const totalPages = Math.ceil(tableData.length / itemsPerPage)

  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setFocus() // Fokus ke input DatePicker
    }
  }

  return (
    <>
      <CCard className="mb-2">
        <CCardBody>
          <CRow >
            <CCol sm={6}>
              <h2 id="traffic" className="card-title mb-0">
                RED POST VISUALIZATION
              </h2>
              <div className="small text-body-secondary">WAREHOUSE CONSUMABLE</div>
            </CCol>
            <CCol sm={3} className="d-none d-md-block">
              <label htmlFor="plant" className="mb-1 form-label small">
                MRP
              </label>
              <Select className="basic-single" classNamePrefix="select" isClearable />
            </CCol>
            <CCol sm={3}  className="d-none d-md-block">
              <label htmlFor="plant" className="mb-1 form-label small">
                Date
              </label>
              <CInputGroup >
                <DatePicker ref={datePickerRef} dateFormat="yyyy-MM-dd" className="form-control" />
                <CInputGroupText  style={{ width: '40px',}}onClick={handleIconClick}>
                  <CIcon  icon={cilCalendar} />
                </CInputGroupText>
              </CInputGroup>
            </CCol>
          </CRow>
          <hr />
          <CRow>
            <CCol sm={2}>
              <CCard className="mb-1 mt-1">
                <CCardHeader className="text-muted small text-center fw-bold">
                  Total Red Post
                </CCardHeader>
                <CCardBody className="text-center">
                  <CCardText className="fs-1 fw-bold">46</CCardText>
                </CCardBody>
              </CCard>

              <CCard className="mb-1 mt-2">
                <CCardHeader className="text-muted small text-center fw-bold">
                  SOH ＞ 0
                </CCardHeader>
                <CCardBody className="text-center">
                  <CCardText className="fs-1 fw-bold">25</CCardText>
                </CCardBody>
              </CCard>

              <div className="mb-3 mt-3" style={{ width: '100%', height: '15rem' }}>
                <h6 className="text-center">Total Material By Shift</h6>
                <div style={{ width: '100%', height: '97%' }}>
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
              </div>
            </CCol>
            <CCol lg={10} sm={10} xs={12}>
              <CRow>
              <CCol lg={5} sm={6} xs={12}>
                <div className="mb-2 mt-2">
                  <h6>Summary Material & SOH </h6>
                  <div style={{ width: '100%', height: '15rem' }}>
                    {' '}
                    {/* Responsive dan tinggi tetap */}
                    <Bar data={combinedData} options={combinedOptions} />
                  </div>
                </div>
                </CCol>
                <CCol lg={7} sm={6} xs={12}>
                <div className="mb-2 mt-2">
                  <h6>Summary Red Post (Last 2 Weeks)</h6>
                  <div style={{ width: '100%', height: '100%' }}>
                    {' '}
                    {/* Responsive dan tinggi tetap */}
                    <Bar data={lineChartData} options={lineChartOptions } />
                  </div>
                </div>
                </CCol>
                </CRow>
                <CRow>
             
                <div className="mb-2 mt-2">
                  <h6>Material Numbers by Shift</h6>
                  <div style={{ width: '100%', height: '15rem' }}>
                    <Bar
                      data={barData}
                      options={{
                        ...barOptions,
                        maintainAspectRatio: false, // Pastikan aspek rasio tidak dipertahankan
                      }}
                    />
                  </div>
                </div>
      
              </CRow>
              </CCol>
              <CCol xs={12}>
                <hr/>
              <CRow>
                <div className="mt-3">
                  <h6>Material Data Table</h6>
                  <CTable striped bordered responsive style={{ fontSize: '0.80rem' }}>
                    {' '}
                    {/* Ukuran font lebih kecil */}
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Material No</CTableHeaderCell>
                        <CTableHeaderCell>MRP</CTableHeaderCell>
                        <CTableHeaderCell>Description</CTableHeaderCell>
                        <CTableHeaderCell>SOH2</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {currentPageData.map((item, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{item.materialNo}</CTableDataCell>
                          <CTableDataCell>{item.mrp}</CTableDataCell>
                          <CTableDataCell>{item.description}</CTableDataCell>
                          <CTableDataCell>{item.soh2}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                  {/* Pagination */}
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
              </CRow>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
