import useVerify from '../hooks/useVerify'
import useVerify2 from '../hooks/useVerify2'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'

const MySwal = withReactContent(Swal)

const useInputDefService = () => {
  const { axiosAutoToken  } = useVerify()
  const { token, axiosJWT } = useVerify2()


  const handleError = (error, message) => {
    console.error(message, error)
    MySwal.fire('Error', `${error.response.data.message}`, 'error')
    throw new Error(message + error.message)
  }

  const getInputDefisit = async () => {
    try {
      const response = await axiosAutoToken.get(`/inputDefisit/`, {
      })
      return response
    } catch (error) {
      handleError(error, 'Error fetching inputDefisit:')
    }
  }
  const getInputDefisitById = async (id) => {
    try {
      const response = await axiosAutoToken.get(`/inputDefisit/${id}`,

      )
      return response
    } catch (error) {
      handleError(error, 'Error fetching inputDefisit:')
    }
  }
  const postInputDefisit = async (data) => {
    try {
      const response = await axiosAutoToken.post(`/inputDefisit/`, data, )
      return response
    } catch (error) {
      handleError(error, 'Error post inputDefisit')
    }
  }

  const updateInputDefisit = async (id,data) => {
    try {
      const response = await axiosAutoToken.put(`/inputDefisit/${id}`, data, {
   
      })
      return response
    } catch (error) {
      handleError(error, 'Error put inputDefisit:')
    }
  }


  const deleteInputById = async (id) => {
    try {
      const response = await axiosAutoToken.get(`/inputDefisit-delete/${id}`, {
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
    getInputDefisit,
    getInputDefisitById,
    postInputDefisit,
    updateInputDefisit,
    deleteInputById,
    getMaterial,
    getGic,
    getWbs,
    getMasterData,
    uploadInputData
  }
}

export default useInputDefService
