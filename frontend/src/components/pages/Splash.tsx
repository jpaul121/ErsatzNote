import '@fortawesome/fontawesome-free/js/all.js'

import { css, cx } from '@emotion/css'

import React from 'react'
import { axiosInstance } from '../../axiosAPI'
import preview from '../../../src/preview.png'
import styles from '../../stylesheets/pages/Splash.module.css'
import { useHistory } from 'react-router-dom'

const GUEST_USER_CREDENTIALS = JSON.parse(
  document.getElementById('guestUserCredentials')!.textContent!
)

function Splash() {
  const history = useHistory()

  async function loginAnonymousUser() {
    try {
      const response = await axiosInstance.post(
        '/auth/token/obtain/', {
          email: GUEST_USER_CREDENTIALS['EMAIL'],
          password: GUEST_USER_CREDENTIALS['PASSWORD'],
        }
      )

      axiosInstance.defaults.headers['Authorization'] = `JWT ${response.data.access}`
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
    } catch(err) {
      console.log(err)
    }

    history.push('/notebooks/')
  }
  
  return (
    <div className={styles['splash']}>
      <div className={styles['home']}>
        <div className={styles['header']}>
          <div className={cx(
            'grid-container',
            css`
              display: flex;
              height: 117px;
              align-items: center;
              justify-content: space-between;
              grid-template-columns: auto auto;
              padding: 5px 20px;
              margin-left: 128px;
              margin-right: 125px;
            `
          )}>
            <div className={cx(
              css`
                grid-column: 1 / auto;
                display: flex;
                flex-direction: row;
                justify-content: center;
                height: 67px;
              `
            )}>
              <div className={cx(
                'grid-container',
                css`
                  display: flex;
                  align-items: center;
                  justify-content: space-evenly;
                  grid-template-columns: auto auto;
                `
              )}>
                <div className={cx(css`grid-column: 1 / auto;`)}>
                  <div className={cx(
                    'grid-container',
                    css`
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                      grid-template-columns: auto auto auto;
                    `
                  )}>
                    <div>
                      <i className={cx(
                        'material-icons',
                        css`
                          font-size: 4em;
                          color: rgb(4, 168, 46);
                        `
                      )}>
                        create
                      </i>
                    </div>
                    <div>
                      <span className={cx(css`font-size: 2em;`)}>ErsatzNote</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={cx(
                css`
                  grid-column: 2 / auto;
                  padding-left: 1em;
                  display: flex;
                  flex-direction: row;
                  justify-content: center;
                  align-items: center;
                `
              )}>
                <a href='mailto:jpaulvalen@gmail.com'>
                  <button className={cx(
                    css`
                      background-color: transparent;
                      border: none;
                      text-align: center;
                      font-size: 1em;
                      text-decoration: none;
                      font-family: sans-serif;
                      cursor: pointer;
                    `
                  )}>
                    CONTACT
                  </button>
                </a>
              </div>
            </div>
            <div className={cx(css`grid-column: 2 / auto;`)}>
              <div className={cx(
                'grid-container',
                css`
                  display: flex;
                  align-items: center;
                  justify-content: right;
                  grid-template-columns: auto auto auto;
                `
              )}>
                <button className={styles['signup-btn']} type='button' onClick={() => history.push('/signup')}>Sign up</button>
                <h5 className={cx(
                  'or',
                  css`
                    font-family: sans-serif;
                    font-weight: 400;
                  `
                )}>or</h5>
                <button className={styles['login-btn']} type='button' onClick={() => history.push('/login')}>Log in</button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles['center']}>
          <div className={styles['center-img']}>
            <ul className={styles['center-list']}>
              <li>
                <h1>Your notes.</h1>
              </li>
              <li>
                <h1>Organized.</h1>
              </li>
              <li>
                <h1>Effortless.</h1>
              </li>
              <li>
                <p>
                  Take notes anywhere. Find information faster. Share notes with anyone. Meeting notes, web pages, projects, to-do lists—with ErsatzNote as your productivity app, you can keep track of it all.
                </p>
              </li>
              <button className={styles['center-button']}>
                <a onClick={loginAnonymousUser}>CHECK IT OUT</a>
              </button>
            </ul>
            <img src={preview} />
          </div>
        </div>
        <div className={styles['footer-container']}>
          <div className={styles['footer-cw']}>
            <p className={styles['footer-paragraph']}>© 2021 Jean-Paul Valencia. All rights reserved.</p>
          </div>
          <div className={styles['footer-icons']}>
            <a href='https://github.com/jpaul121'>
              <i className='fab fa-github fa-2x'></i>
            </a>
            <a href='https://linkedin.com/in/jpaulvalen'>
              <i className='fab fa-linkedin fa-2x'></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Splash
