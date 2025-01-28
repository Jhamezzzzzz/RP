import useVerify from '../hooks/useVerify'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const useStockDataService = () => {
  const { axiosAutoToken  } = useVerify()

  const handleError = (error, message) => {
    console.error(message, error)
    MySwal.fire('Error', `${error.response.data.message}`, 'error')
    throw new Error(message + error.message)
  }

  const getStockData = async ( page = 1) => {
    try {
      const response = await axiosAutoToken.get(`/stockData?page=${page}`)
      return response // Return the response if successful
    } catch (error) {
      handleError(error, 'Error fetching StockData:') // Handle the error
      return null // Return null or a fallback value on error
    }
  }

  const uploadStockData = async (data) => {
    try {
      const response = await axiosAutoToken.post(`upload-stockData`, data)
      return response
    } catch (error) {
      handleError(error, 'Error post StockData:')
    }
  }

  return {
    getStockData,
    uploadStockData,
  }
}

export default useStockDataService
