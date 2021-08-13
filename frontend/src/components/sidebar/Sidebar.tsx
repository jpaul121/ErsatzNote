import '@fortawesome/fontawesome-free/js/all.js'

import { Link, useHistory } from 'react-router-dom'
import { RouteComponentProps, withRouter } from 'react-router'

import React from 'react'
import SearchBar from './SearchBar'
import styles from '../../stylesheets/sidebar/Sidebar.module.css'

function Sidebar({ match }: RouteComponentProps<{ notebook_id: string }>) {
  const history = useHistory()
  
  return (
    <div className={styles['sidebar']}>
      <h1 className={styles['user']}>
        <i className={'fas fa-user-circle fa-2x'}></i>
        &nbsp;
        Guest User
      </h1>
      <SearchBar />
      <div className={styles['new-note-container']}>
        <button
         className={styles['new-note-button']}
         onClick={() => history.push(
           match.params.notebook_id
           ? `/notebooks/${match.params.notebook_id}`
           : `/new-note`
         )}
        >
          <Link to={
            match.params.notebook_id
            ? `/notebooks/${match.params.notebook_id}`
            : `/new-note`
          }>
            <i className={'fas fa-plus'}></i>
            &nbsp;&nbsp;&nbsp;
            New Note
          </Link>
        </button>
      </div>
      <div className={styles['navigation']}>
      <div
         className={styles['nav-button']}
         onClick={() => history.push(`/all-notes`)}
      >
          <Link to={`/all-notes`}>
            <i className={'fas fa-file-alt'}></i>
            <h3>
              &nbsp;&nbsp;&nbsp;
              All Notes
            </h3>
          </Link>
        </div>
        <div
           className={styles['nav-button']}
           onClick={() => history.push(`/notebooks`)}
           style={{ marginTop: '1.1111vh' }}
        >
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

// @ts-ignore
const finishedSidebar = withRouter(Sidebar)

export default finishedSidebar
