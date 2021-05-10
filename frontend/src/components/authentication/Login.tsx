import React, { useState } from 'react'

import { axiosInstance } from '../../axiosAPI'

export function Login() {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      const response = await axiosInstance.post(
        '/auth/token/obtain/',
        {
          email,
          password
        }
      )

      axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)

      return response.data;
    } catch(err) { throw err; }
  }
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Email address:
          <input name='email' value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          Password:
          <input name='password' value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <input type='submit' value='Submit' />
      </form>
    </>
  );
}