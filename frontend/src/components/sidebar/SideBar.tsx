import '@fortawesome/fontawesome-free/js/all.js'

import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'
import styles from '../../stylesheets/sidebar/SideBar.module.css'

class SideBar extends Component {
  constructor(props: any) {
    super(props)
  }
  
  render() {
    return (
      <div className={styles['nav-bar']}>
        <h1 className={styles['user']}>
          <i className={'fas fa-user-circle fa-2x'}></i>
          &nbsp;
          Guest User
        </h1>
        <SearchBar />
        <div className={styles['buttons']}>
          <button className={styles['new-note']}>
            <Link to={`/new-note`}>
              <i className={'fas fa-plus'}></i>
              &nbsp;&nbsp;&nbsp;
              New Note
            </Link>
          </button>
        </div>
        <div className={styles['notebooks']}>
          <div className={styles['row']}>
            <Link to={`/notebooks`}>
              <i className={'fas fa-book'}></i>
              <h3>
                &nbsp;&nbsp;&nbsp;
                Notebooks
              </h3>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default SideBar
