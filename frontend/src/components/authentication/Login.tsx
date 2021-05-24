import React, { useState } from 'react'

import { axiosInstance } from '../../axiosAPI'
import styles from './Auth.module.css'

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
    <div className={styles['form-container']}>
      <div className={styles['form-frame']}>
        <div className={styles['form-wrapper']}>
          <div className={styles['form-body']}>
            <div className={styles['heading']}>
              <p className={styles['tagline']}>
                Log in
              </p>
            </div>
            <div className={styles['form-proper']}>
              <form onSubmit={handleSubmit}>
                <ol>
                  <li className={styles['row']}>
                    <input className={styles['form-input']} name='email' value={email} placeholder='Email address' onChange={e => setEmail(e.target.value)} />
                  </li>
                  <li className={styles['row']}>
                    <input className={styles['form-input']} name='password' type='password' value={password} placeholder='Password' onChange={e => setPassword(e.target.value)} />
                  </li>
                  <li className={styles['row']}>
                    <input className={styles['form-submit']} type='submit' value='Submit' />
                  </li>
                </ol>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}