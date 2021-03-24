import '@fortawesome/fontawesome-free/js/all.js'

import React, { Component } from 'react'

import styles from './SearchBar.module.css'

class SearchBar extends Component {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <div className={styles['search-container']}>
        <form>
          <input className={styles['search-bar']} type='text' placeholder='' defaultValue='' />
          <span>
            <button className={styles['search-btn']} type='submit'>
              <i className={'fas fa-search'}></i>
            </button>
          </span>
        </form>
      </div>
    );
  }
}

export default SearchBar
