import React, { Component } from 'react'

import NotebookIndex from './NotebookIndex'
import SideBar from '../sidebar/SideBar'
import styles from './NotebookIndexContainer.module.css'

class NotebookIndexContainer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    console.log(window.location.pathname)
    return (
      <div className={styles['notebook-index-container']}>
        <SideBar />
        <NotebookIndex />
      </div>
    );
  }
}

export default NotebookIndexContainer
