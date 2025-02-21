import useVerify from '../hooks/useVerify'
import useVerify2 from '../hooks/useVerify2'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'

const MySwal = withReactContent(Swal)

const useDashboardService = () => {
  const { axiosAutoToken  } = useVerify()
  const { token, axiosJWT } = useVerify2()


  const handleError = (error, message) => {
    console.error(message, error)
    MySwal.fire('Error', `${error.response.data.message}`, 'error')
    throw new Error(message + error.message)
  }

  const getCardData = async (startdate,enddate) => {
    try {
      const response = await axiosAutoToken.get(`/card-data?startDate=${startdate}&endDate=${enddate}`);
      return response.data;
    } catch (error) {
      handleError(error, 'Error fetching inventory:');
    }
  }
  

  const getCombGraph = async (startdate,enddate) => {
    try {
      const response = await axiosAutoToken.get(`/comb-graph?startDate=${startdate}&endDate=${enddate}`, {
      })
      return response
    } catch (error) {
      handleError(error, 'Error fetching inventory:')
    }
  }
  const getLineGraph = async (startdate,enddate) => {
    try {
      const response = await axiosAutoToken.get(`/line-graph?startDate=${startdate}&endDate=${enddate}`, {
      })
      return response
    } catch (error) {
      handleError(error, 'Error fetching inventory:')
    }
  }
  const getDoughnutGraph = async (startdate,enddate) => {
    try {
      const response = await axiosAutoToken.get(`/doughnut-graph?startDate=${startdate}&endDate=${enddate}`, {
      })
      return response
    } catch (error) {
      handleError(error, 'Error fetching inventory:')
    }
  }
  const getShiftGraph = async (startdate,enddate) => {
    try {
      const response = await axiosAutoToken.get(`/bar-shift-graph?startDate=${startdate}&endDate=${enddate}`, {
      })
      return response
    } catch (error) {
      handleError(error, 'Error fetching inventory:')
    }
  }
 
 
  return {
    getCardData,
    getCombGraph,
    getLineGraph,
    getDoughnutGraph,
    getShiftGraph,
  }
}

export default useDashboardService
