import NotebookIndex from './NotebookIndex'
import React from 'react'
import SideBar from '../sidebar/SideBar'
import styles from '../../stylesheets/notebooks/NotebookIndexContainer.module.css'

function NotebookIndexContainer() {
  return (
    <div className={styles['notebook-index-container']}>
      <SideBar />
      <NotebookIndex />
    </div>
  );
}

export default NotebookIndexContainer
