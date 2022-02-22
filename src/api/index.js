import axios from 'axios'

// 请求拦截器
axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截
axios.interceptors.response.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

function fetch (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params).then(response => {
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}
export default {
  fetch
}
