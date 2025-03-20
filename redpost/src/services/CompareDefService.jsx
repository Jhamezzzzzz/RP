import useVerify from '../hooks/useVerify'
import useVerify2 from '../hooks/useVerify2'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'

const MySwal = withReactContent(Swal)

const useCompareDefService = () => {
  const { axiosAutoToken  } = useVerify()
  const { token, axiosJWT } = useVerify2()


  const handleError = (error, message) => {
    console.error(message, error)
    MySwal.fire('Error', `${error.response.data.message}`, 'error')
    throw new Error(message + error.message)
  }

  const getCompareDefisit = async (startdate,enddate) => {
    try {
      const response = await axiosAutoToken.get(`/compare?startDate=${startdate}&endDate=${enddate}`);
      return response
    } catch (error) {
      handleError(error, 'Error fetching inputDefisit:')
    }
  }


  const updateCompareDefisit = async (id,data) => {
    try {
      const response = await axiosAutoToken.put(`/update-compare/${id}`, data, {
   
      })
      return response
    } catch (error) {
      handleError(error, 'Error put CompareDefisit:')
    }
  }


//   const deleteInputById = async (id) => {
//     try {
//       const response = await axiosAutoToken.get(`/inputDefisit-delete/${id}`, {
//         // headers: {
//         //   Authorization: `Bearer ${token}`,
//         // },
//       })
//       return response.data // Returning the data instead of the whole response
//     } catch (error) {
//       handleError(error, `Error delete data for ID ${id}:`)
//     }
//   }
  
  return {
    getCompareDefisit,
    updateCompareDefisit
  }
}

export default useCompareDefService
