import axios from 'axios'
import config from './Config.js'

const axiosInstance = axios.create({
  baseURL: `${config.TWIIS_URL}/api`,
  withCredentials: true,
})

export default axiosInstance
