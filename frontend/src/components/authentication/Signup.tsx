import React, { useState } from 'react'

import { axiosInstance } from '../../axiosAPI'
import styles from '../../stylesheets/authentication/Auth.module.css'

export function Signup() {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      const response = await axiosInstance.post(
        '/auth/user/create/',
        {
          email,
          password
        }
      )

      return response;
    } catch(err) { throw err; }
  }
  
  return (
    <div className={styles['form-container']}>
      <div className={styles['form-frame']}>
        <div className={styles['form-wrapper']}>
          <div className={styles['form-body']}>
            <div className={styles['heading']}>
              <p className={styles['tagline']}>
                Sign up
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <ol>
                <li className={styles['row']}>
                  <input name='email' value={email} placeholder='Email' className={styles['form-input']} onChange={e => setEmail(e.target.value)} />
                </li>
                <li className={styles['row']}>
                  <input name='password' type='password' value={password} placeholder='Password' className={styles['form-input']} onChange={e => setPassword(e.target.value)} />
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
  );
}