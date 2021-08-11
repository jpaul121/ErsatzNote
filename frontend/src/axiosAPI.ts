import axios from 'axios'

const COMPILE_TIME_SETTING = JSON.parse(document.getElementById('compileTimeSetting')!.textContent!)['NODE_ENV']
const PORT = Number(document.getElementById('port')!.textContent!)

const BASE_URL = COMPILE_TIME_SETTING === 'production' ? 'https://ersatznote.herokuapp.com' : 'http://localhost:8000'
const DEFAULT_HTTPS_PORT = 443

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'xsrfHeaderName': 'X-CSRFTOKEN',
    'xrsfCookieName': 'csrftoken',
    'Authorization': localStorage.getItem('access_token') ? `JWT ${localStorage.getItem('access_token')}` : null,
    'Content-Type': 'application/json',
    'accept': 'application/json',
    'Access-Control-Allow-Origin': BASE_URL,
  },
  proxy: {
    protocol: COMPILE_TIME_SETTING === 'production' ? 'https' : 'http',
    host: BASE_URL,
    port: PORT || DEFAULT_HTTPS_PORT,
  }
})

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config

    if (error.response) {
      // Prevent infinite loops if login credentials invalid
      if ((error.response.status === 401 || 406) && originalRequest.url === `${BASE_URL}/auth/token/refresh/`) {
        if (window.location.href !== '/login/') window.location.href = '/login/'
        
        return Promise.reject(error);
      }

      // Respond to expired refresh tokens
      if (error.response.data.code === 'token_not_valid' && error.response.status === 401 && error.response.statusText === 'Unauthorized') {
        const refreshToken = localStorage.getItem('refresh_token')
        
        if (refreshToken) {
          const tokenObj = JSON.parse(atob(refreshToken.split('.')[1]))
          const currentTime = Math.ceil(Date.now() / 1000)
          
          if (tokenObj.exp > currentTime) {
            return axiosInstance
              .post('/auth/token/refresh/', { refresh: refreshToken })
              .then(response => {
                localStorage.setItem('access_token', response.data.access)
                localStorage.setItem('refresh_token', response.data.refresh)

                axiosInstance.defaults.headers['Authorization'] = `JWT ${response.data.access}`
                originalRequest.headers['Authorization'] = `JWT ${response.data.access}`

                return axiosInstance(originalRequest);
              })
              .catch(err => {
                throw err;
              })
          } else {
            console.log('Refresh token is expired.')
            if (window.location.href !== '/login/') window.location.href = '/login/'
          }
        } else {
          console.log('Refresh token not available.')
          if (window.location.href !== '/login/') window.location.href = '/login/'
        }
      }
      
      // Respond to invalid access tokens
      if (error.response.status === 401 && error.response.statusText === 'Unauthorized') {
        const refreshToken = localStorage.getItem('refresh_token')
        
        return axiosInstance
          .post('/auth/token/refresh/', { refresh: refreshToken })
          .then(response => {
            localStorage.setItem('access_token', response.data.access)
            localStorage.setItem('refresh_token', response.data.refresh)
            
            axiosInstance.defaults.headers['Authorization'] = `JWT ${response.data.access}`
            originalRequest.headers['Authorization'] = `JWT ${response.data.access}`

            return axiosInstance(originalRequest)
          }).catch(err => {
            throw err;
          })
      }
    } else if (error.request) {
      console.log('The request was made, but no response was received.')
      console.log(JSON.stringify(error))
      console.log(error.request)
    } else {
      console.log('Something happened in setting up the request that triggered an error.')
      console.log(`Error: ${error.message}`)
    }
  }
)