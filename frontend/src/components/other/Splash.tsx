import { css, cx } from '@emotion/css'

import React from 'react'
import preview from '../../../src/preview.png'
import styles from './Splash.module.css'

export function Splash() {
  return (
    <div className={styles['splash']}>
      <div className={styles['home']}>
        <div className={styles['header']}>
          <div className={cx(
            'grid-container',
            css`
              display: flex;
              height: 127px;
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
                <button className={styles['signup-btn']}>Sign up</button>
                <h5 className={cx(
                  'or',
                  css`
                    font-family: sans-serif;
                    font-weight: 400;
                  `
                )}>or</h5>
                <button className={styles['login-btn']}>Log in</button>
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
                  Take notes anywhere. Find information faster. Share notes with anyone. Meeting notes, web pages, projects, to-do lists—with this shameless copy of EverNote, you can keep track of it all.
                </p>
              </li>
              <button className={styles['center-button']}>
                <a>CHECK IT OUT</a>
              </button>
            </ul>
            <img className={styles['comp']} src={preview} />
          </div>
        </div>
      </div>
      <div className={styles['footer-container']}>
        <div className={styles['footer-cw']}>
          <p className={styles['footer-paragraph']}>© 2021 Jean-Paul Valencia. All allusions to EverNote made under fair use.</p>
        </div>
      </div>
    </div>
  );
}