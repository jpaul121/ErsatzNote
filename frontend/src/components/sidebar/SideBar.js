import '@fortawesome/fontawesome-free/js/all.js'

import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'
import styles from './Sidebar.module.css'

class SideBar extends Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    return (
      <div className={styles['nav-bar']}>
        <h1 className={styles['user']}>Guest</h1>
        <SearchBar />
        <div className={styles['buttons']}>
          <button className={styles['new-note']}>
            <i className={'fas fa-plus'}></i>&nbsp;&nbsp;&nbsp;New Note
          </button>
        </div>
        <div className={styles['notebooks']}>
          <div className={styles['row']}>
            <Link to={`/notebooks`}>
              <i className={'fas fa-book'}></i>
              <h3>&nbsp;&nbsp;&nbsp;Notebooks</h3>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default SideBar
