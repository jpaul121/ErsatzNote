import '@fortawesome/fontawesome-free/js/all.js'

import React, { useContext } from 'react'

import UserContext from '../other/UserContext'
import styles from '../../stylesheets/sidebar/SearchBar.module.css'

function SearchBar() {
  const { searchQuery, setSearchQuery } = useContext(UserContext)
  
  return (
    <div className={styles['search-container']}>
      <form>
        <input className={styles['search-bar']} type='text' placeholder='' value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        <span>
          <button className={styles['search-btn']} type='submit'>
            <i className={'fas fa-search'}></i>
          </button>
        </span>
      </form>
    </div>
  );
}

export default SearchBar
