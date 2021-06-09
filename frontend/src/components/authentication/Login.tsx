import React, { useState } from 'react'
import { css, cx } from '@emotion/css'

import { axiosInstance } from '../../axiosAPI'
import styles from '../../stylesheets/authentication/Auth.module.css'
import { useHistory } from 'react-router-dom'

function Login() {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ error, setError ] = useState(false)

  const history = useHistory()

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

      if (response.data.detail === 'No active account found with the given credentials') {
        setError(true)
      }

      axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)

      history.push('/notebooks')
    } catch(err) {
      setError(true)
      
      throw err;
    }
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
                  {
                    error &&
                    <li className={styles['row']}>
                      <p className={cx(css`color: red;`)}>Invalid login credentials.</p>
                    </li>
                  }
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

export default Login
