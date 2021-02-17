import axios from 'axios'

// this could use /simple/ instead, but then as there is no CORS header, the full api has to be used instead
const api = 'https://api.mcsrvstat.us/2/'

const axiosInstance = axios.create({
  baseURL: api
})

export default ({ Vue }) => {
  Vue.prototype.$axios = axiosInstance
}

export { axiosInstance }
