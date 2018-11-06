import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
// import router from '@/router'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['Authorization'] = getToken()
  }
  return config
}, error => {
  Promise.reject(error)
})

service.interceptors.response.use((response) => {
  return response
}, function(error) {
  if (error.response.status === 302) {
    window.location = '/login'
  }
  return Promise.reject(error)
});
export default service
