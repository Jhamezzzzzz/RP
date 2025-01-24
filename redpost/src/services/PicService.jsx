import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import useVerify from '../hooks/useVerify'

const MySwal = withReactContent(Swal)

const usePicService = () => {
  const { axiosAutoToken  } = useVerify()

  const handleError = (error, message) => {
    console.error(message, error)
    MySwal.fire('Error', `${error.response.data.message}`, 'error')
    throw new Error(message + error.message)
  }

  const getPic = async () => {
    try {
      const response = await axiosAutoToken.get(`stockData/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response
    } catch (error) {
      handleError(error, 'Error fetching:')
    }
  }

  const getPicById = async (id) => {
    try {
      const response = await axiosAutoToken.get(`/pic/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data // Returning the data instead of the whole response
    } catch (error) {
      handleError(error, `Error fetching data for ID shift:`)
    }
  }

  const postPic = async (data) => {
    try {
      const response = await axiosAutoToken.post(`/pic/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response
    } catch (error) {
      handleError(error, 'Error post:')
    }
  }

  const updatePic = async (id,data) => {
    try {
      const response = await axiosAutoToken.put(`/pic/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response
    } catch (error) {
      handleError(error, 'Error post:')
    }
  }


  const deletePicById = async (id) => {
    try {
      const response = await axiosAutoToken.get(`/pic-delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data // Returning the data instead of the whole response
    } catch (error) {
      handleError(error, `Error delete data for ID ${id}:`)
    }
  }

  return {
    getPic,
    getPicById,
    postPic,
    updatePic,
    deletePicById,
  }
}

export default usePicService
