import React, { useEffect, useState } from 'react'
import jwt, { JwtPayload } from 'jwt-decode'

import { Redirect } from 'react-router-dom'
import { axiosInstance } from '../../axiosAPI'

interface ErsatzNoteToken extends JwtPayload {
  user: string,
}

function useGetUser() {
  const [ user, setUser ] = useState<string | null>(null)
  const [ isLoading, setLoading ] = useState<boolean>(true)

  useEffect(() => {
    async function getUser() {
      if (localStorage.getItem('refresh_token')) {
        axiosInstance
        .post('/auth/token/refresh/', { refresh: localStorage.getItem('refresh_token') })
        .then(response => {
          localStorage.setItem('access_token', response.data.access)
          localStorage.setItem('refresh_token', response.data.refresh)

          axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access
        })
        
        if (localStorage.getItem('access_token')) {
          const tokenObj = jwt<ErsatzNoteToken>(localStorage.getItem('access_token')!)
  
          setLoading(false)
          setUser(tokenObj.user)

          return;
        }
      }

      return <Redirect to={'/login'} />;
    }

    getUser()
  })

  return {
    user,
    setUser,
    isLoading,
  };
}

export default useGetUser
