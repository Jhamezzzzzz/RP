import useVerify from '../hooks/useVerify'
import useVerify2 from '../hooks/useVerify2'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'

const MySwal = withReactContent(Swal)

const useInputService = () => {
  const { axiosAutoToken  } = useVerify()
  const { token, axiosJWT } = useVerify2()


  const handleError = (error, message) => {
    console.error(message, error)
    MySwal.fire('Error', `${error.response.data.message}`, 'error')
    throw new Error(message + error.message)
  }

  const getInput = async () => {
    try {
      const response = await axiosAutoToken.get(`/inputRedPost/`, {
      })
      return response
    } catch (error) {
      handleError(error, 'Error fetching inventory:')
    }
  }
  const getInputById = async (id) => {
    try {
      const response = await axiosAutoToken.get(
        `/inputRedPost/${id}`,

      )
      return response
    } catch (error) {
      handleError(error, 'Error fetching inventory:')
    }
  }
  const postInput = async (data) => {
    try {
      const response = await axiosAutoToken.post(`/inputRedPost/`, data, )
      return response
    } catch (error) {
      handleError(error, 'Error post:')
    }
  }

  const updateInput = async (id,data) => {
    try {
      const response = await axiosAutoToken.put(`/inputRedPost/${id}`, data, {
   
      })
      return response
    } catch (error) {
      handleError(error, 'Error post:')
    }
  }


  const deleteInputById = async (id) => {
    try {
      const response = await axiosAutoToken.get(`/inputRedPost-delete/${id}`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      })
      return response.data // Returning the data instead of the whole response
    } catch (error) {
      handleError(error, `Error delete data for ID ${id}:`)
    }
  }
  const getMaterial = async () => {
    try {
      const response = await axiosJWT.get(
        `/inventory?plantId=1&storageId=&type=`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response
    } catch (error) {
      handleError(error, 'Error fetching inventory:')
    }
  }

  const getGic = async () => {
    try {
      const response = await axiosJWT.get(`/gic`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response
    } catch (error) {
      handleError(error, 'Error fetching inventory:')
    }
  }
  const getWbs = async () => {
    try {
      const response = await axiosJWT.get(`/wbs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response
    } catch (error) {
      handleError(error, 'Error fetching inventory:')
    }
  }

  const getMasterData = async (api) => {
    try {
      const response = await axiosJWT.get(`/${api}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response
    } catch (error) {
      handleError(error, 'Error fetching:')
    }
  }
  const uploadInputData = async (data) => {
    try {
      const response = await axiosAutoToken.post(`upload-inputRedPost`, data)
      return response
    } catch (error) {
      handleError(error, 'Error post StockData:')
    }
  }
  return {
    getInput,
    getInputById,
    postInput,
    updateInput,
    deleteInputById,
    getMaterial,
    getGic,
    getWbs,
    getMasterData,
    uploadInputData
  }
}

export default useInputService
