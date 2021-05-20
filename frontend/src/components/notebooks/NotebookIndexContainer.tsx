import React, { Component } from 'react'

import NotebookIndex from './NotebookIndex'
import SideBar from '../sidebar/SideBar'
import styles from './NotebookIndexContainer.module.css'

class NotebookIndexContainer extends Component {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <div className={styles['notebook-index-container']}>
        <SideBar />
        <NotebookIndex />
      </div>
    );
  }
}

export default NotebookIndexContainer
