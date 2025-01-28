import axios from 'axios'

const useVerify = () => {
  // const token = localStorage.getItem('token') // Atau metode lain untuk mendapatkan token
  const axiosAutoToken= axios.create({
    baseURL: 'http://localhost:5001/api',
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
  })

  return { axiosAutoToken }
}

export default useVerify
