import useVerify from '../hooks/useVerify'
import useVerify2 from '../hooks/useVerify2'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'

const MySwal = withReactContent(Swal)

const useMasterDataService = () => {
  const { axiosAutoToken  } = useVerify()
  const { token, axiosJWT } = useVerify2()


  const handleError = (error, message) => {
    console.error(message, error)
    MySwal.fire('Error', `${error.response.data.message}`, 'error')
    throw new Error(message + error.message)
  }

  const getMasterPic = async () => {
    try {
      const response = await axiosAutoToken.get(`/pic`);
      return response;
    } catch (error) {
      handleError(error, 'Error fetching inventory:');
    }
  }
  const getMasterShift = async () => {
    try {
      const response = await axiosAutoToken.get(`/shift`);
      return response;
    } catch (error) {
      handleError(error, 'Error fetching inventory:');
    }
  }
  

  const postMasterPic = async (data) => {
    try {
      const response = await axiosAutoToken.post(`/pic/`, data, )
      return response
    } catch (error) {
      handleError(error, 'Error post:')
    }
  }

  const updateMasterPic = async (id,data) => {
    try {
      const response = await axiosAutoToken.put(`/pic/${id}`, data, {
   
      })
      return response
    } catch (error) {
      handleError(error, 'Error post:')
    }
  }


  const deleteMasterPicById = async (id) => {
    try {
      const response = await axiosAutoToken.get(`/pic-delete/${id}`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      })
      return response.data // Returning the data instead of the whole response
    } catch (error) {
      handleError(error, `Error delete data for ID ${id}:`)
    }
  }
 
  return {
    getMasterPic,
    getMasterShift,
    postMasterPic,
    updateMasterPic,
    deleteMasterPicById,
  }
}

export default useMasterDataService
