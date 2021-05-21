import axios from 'axios'

const baseURL = 'http://localhost:8000/'

export const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    'xsrfHeaderName': 'X-CSRFTOKEN',
    'xrsfCookieName': 'csrftoken',
    'Authorization': 'JWT ' + localStorage.getItem('access_token'),
    'Content-Type': 'application/json',
    'accept': 'application/json'
  }
})

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config
    const refreshToken = localStorage.getItem('refresh_token')

    // Prevent infinite loops if login credentials invalid
    if (error.response.status === 401 && originalRequest.url === baseURL + 'token/refresh/') {
      window.location.href = '/login/'
      
      return Promise.reject(error);
    }

    // Respond to expired refresh tokens
    if (error.response.data.code === 'token_not_valid' && error.response.status === 401 && error.response.statusText === 'Unauthorized') {
      if (refreshToken) {
        const tokenObj = JSON.parse(atob(refreshToken.split('.')[1]))
        const currentTime = Math.ceil(Date.now() / 1000)
        
        if (tokenObj.exp > currentTime) {
          return axiosInstance
            .post('/token/refresh/', { refresh: refreshToken })
            .then(response => {
              localStorage.setItem('access_token', response.data.access)
              localStorage.setItem('refresh_token', response.data.refresh)

              axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access
              originalRequest.headers['Authorization'] = 'JWT ' + response.data.access

              return axiosInstance(originalRequest);
            })
        }
      }
    }
    
    // Respond to invalid access tokens
    if (error.response.status === 401 && error.response.statusText === 'Unauthorized') {
      return axiosInstance
        .post('/auth/token/refresh/', { refresh: refreshToken })
        .then(response => {
          localStorage.setItem('access_token', response.data.access)
          localStorage.setItem('refresh_token', response.data.refresh)
          
          axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access
          originalRequest.headers['Authorization'] = 'JWT ' + response.data.access

          return axiosInstance(originalRequest)
        })
    }
  }
)