import NotebookIndex from '../notebooks/NotebookIndex'
import React from 'react'
import Sidebar from '../sidebar/Sidebar'
import styles from '../../stylesheets/pages/NotebookIndexContainer.module.css'

function NotebookIndexContainer() {
  return (
    <div className={styles['notebook-index-container']}>
      <Sidebar />
      <NotebookIndex />
    </div>
  );
}

export default NotebookIndexContainer
